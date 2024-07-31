import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/app.css';
import '../../styles/question.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import TextField from '@mui/material/TextField';
import { useParams } from 'react-router-dom';
import { useQuestionFetch } from '../../hooks/useQuestionFetch';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import CircularProgress from '@mui/material/CircularProgress';
import { useTimer } from 'use-timer';
import NavButton from '../navigation/NavButton';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box';

// Initial state before submitting answer
const initialState = {
    success: '',
    tests_passed: '',
    total_tests: '',
    cases: [],
    llm_function: '',
    complete_success: false,
    returned: false
};

// Interface for state type definitions
interface StateType {
    success: string;
    tests_passed: string;
    total_tests: string;
    cases: test_case[];
    llm_function: string;
    complete_success: boolean;
    returned: boolean;
}

// Initial state for the error before submitting answer
const submitErrorInitialState = {
    errorMsg: '',
    error: false,
}

// Interface for error state type definitions
interface SubmitErrorStateType {
    errorMsg: string;
    error: boolean;
}

// Type definitions for expected json response from api
type response = {
    data: {
        success: string;
        tests_passed: string;
        total_tests: string;
        llm_function: string;
        cases: test_case[];
    }
}

// Type definitions for test_case json within a response
type test_case = {
    testID: number; 
    input : any[];
    expected_output : any;
    output : any;
    pass : boolean;
};

// React component for displaying the question page
// Dynamically renders a question from the back-end
// Handles submissions
export default function Question() {
    const [user_input, setUserInput] = useState('');
    const [reasoning, setReasoning] = useState('');
    const [state, setState] = useState<StateType>(initialState);
    const [submitError, setSubmitError] = useState<SubmitErrorStateType>(submitErrorInitialState);
    // Fetching id from the url
    const { id } = useParams<{ id: string }>();
    // Applying parsed id into a state
    const [ stateID, setStateID ] = useState(Number(id));
    // React hook that handles fetching the question from the back-end
    const { questionFetchState, error } = useQuestionFetch(stateID);
    const [submissionLoading, setSubmissionLoading] = useState(false);
    const { time, start, reset } = useTimer({
        autostart: true,
    });
    const [ hint_used, setHintUsed ] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    // Catch for case where id is not parsable from url
    if (!id) {
        return <div>Error: Question ID is missing.</div>;
    }

    // Helper function to open MUI Modal
    const handleOpen = () => {
        setModalOpen(true);
    };

    // Helper function to close MUI Modal
    const handleClose = () => {
        setModalOpen(false);
    };

    // Helper function for resetting component states when accessing the next question
    const nextQuestion = () => {
        setUserInput('');
        reset();
        setHintUsed(false);
        setState(initialState);
        setStateID(stateID + 1);
    }

    // Helper function to toggle hint state
    const toggleHint = () => {
        setHintUsed(!hint_used);
    };

    // Handles the submission of a users interpretation when the submit button is pressed
    const handleSubmit = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();

        try {
            setSubmissionLoading(true);
            const axios_response: response = await axios.post(`http://localhost:4001/api/question/submit/${stateID}`, {
                user_input, 
                time,
                hint_used
            }, {
                timeout: 60000
            });
            if (axios_response.data.success) {
                setState({
                    success: axios_response.data.success,
                    tests_passed: axios_response.data.tests_passed,
                    total_tests: axios_response.data.total_tests,
                    cases: axios_response.data.cases,
                    llm_function: axios_response.data.llm_function,
                    returned: true,
                    complete_success: (axios_response.data.tests_passed === axios_response.data.total_tests)
                });

                
                // If a successful response is received, reset component state
                // Resets error, reasoning, and timer state
                setSubmitError(submitErrorInitialState);
                setReasoning('');
                reset();
                start();
            } else {
                // Catch all error message.
                // If an error isnt thrown but the response isnt successful.
                setSubmitError({
                    errorMsg: 'Server connection failed. Please try again.',
                    error: true,
                });
            }
        } catch (err) {
            // Catching 400 and 500 api errors, likely resulting from a faulty markdown block
            if (axios.isAxiosError(err)) {
                setSubmitError({
                    errorMsg: 'Please rephrase and try again. No code block was generated.',
                    error: true,
                });
            } else {
                setSubmitError({
                    errorMsg: 'An unexpected error occurred. Please try again.',
                    error: true,
                });
            }
        }
        setSubmissionLoading(false);
    };

    // alert variable
    let alertContent;

    // Alert component rendering that notifies the user of their submission results
    if (submitError.error) {
        // General error was returned, likely a 500 error
        alertContent =
            (<Alert severity="error">
                <AlertTitle>Warning</AlertTitle>
                {submitError.errorMsg}
            </Alert>)
    } else if (state.complete_success) {
        // Complete success was returned, generate modal
        alertContent =
            (<Alert severity="success">
                <AlertTitle>Success</AlertTitle>
                {`Tests passed: ${state.tests_passed}/${state.total_tests}`}
                <br />
                <Modal
                    open={modalOpen}
                    onClose={handleClose}
                >
                    <Box className="modal-style">
                        <Typography id="terms-modal-title" variant="h6" align="center">
                            Test Case Breakdown
                        </Typography>
                        {Object.entries(state.cases).map(([key, testCase]) => (
                        <Typography id="terms-modal-description" variant="body1" gutterBottom>
                            TestID: {key}  <br />
                            Input: {testCase.input.toString()} <br />
                            Output: {testCase.output.toString()} <br />
                            Expected Output: {testCase.expected_output.toString()} <br />
                            Pass: {testCase.pass.toString()}
                        </Typography>
                        ))}
                    </Box>
                </Modal>
                <span onClick={handleOpen} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>test case breakdown</span>
            </Alert>)
    } else if (state.returned) {
        // Parial success was returned, generate modal
        alertContent =
            (<Alert severity="error" color='warning'>
                <AlertTitle>Incorrect</AlertTitle>
                {`Tests passed: ${state.tests_passed}/${state.total_tests}`}
                <br />
                <Modal
                    open={modalOpen}
                    onClose={handleClose}
                >
                    <Box className="modal-style">
                        <Typography id="terms-modal-title" variant="h6" align="center">
                            Test Case Breakdown
                        </Typography>
                        {Object.entries(state.cases).map(([key, testCase]) => (
                        <Typography id="terms-modal-description" variant="body1" gutterBottom>
                            TestID: {key}  <br />
                            Input: {testCase.input ? testCase.input.toString() : 'undefined'} <br />
                            Output: {testCase.output ? testCase.output.toString() : 'undefined'} <br />
                            Expected Output: {testCase.expected_output.toString()} <br />
                            Pass: {testCase.pass.toString()}
                        </Typography>
                        ))}
                    </Box>
                </Modal>
                <span onClick={handleOpen} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>test case breakdown</span>
            </Alert>)
    } else {
        // No response present, no alert needed
        alertContent = null;
    }

    // Rendering of the question container based on state
    return (
        <div className='question-container'>
            {!error ? ( 
                <>
                    <div className='box-container-out'>
                    <div className='box'>
                        <div className='question-header'>Output</div>
                        <SyntaxHighlighter language="javascript" showLineNumbers style={dark}
                            customStyle={{ display: 'flex', width: '100%', flex: 1, padding: 0 }} >
                            {state.llm_function}
                        </SyntaxHighlighter>
                    </div>
                </div>
                <div className='box-container-q'>
                    <div className='box'>
                        <div className='question-header'>Question #{stateID}</div>
                        <SyntaxHighlighter language="javascript" showLineNumbers
                            customStyle={{ flex: 1, width: '100%', padding: 0 }} >
                            {questionFetchState.function_string}
                        </SyntaxHighlighter>
                        <div className='hint-container'>
                            <button onClick={toggleHint} className="hint-button">Show Hint</button>
                            {hint_used && <div className="hint">{questionFetchState.hint}</div>}
                        </div>
                        <TextField
                            id="standard-multiline-static"
                            label="Interpretation"
                            multiline
                            rows={2}
                            variant="filled"
                            fullWidth
                            required
                            value={user_input}
                            onChange={
                                (e) => setUserInput(e.target.value)
                            }
                        />
                        <div className='footer'>
                            <div className='footer-container'></div>
                            <div className='footer-container'>
                                {submissionLoading ?
                                    (<CircularProgress color="secondary" />) :
                                    (<>{alertContent}</>)}
                            </div>
                            <div className='footer-container-right'>
                                {!state.complete_success ? 
                                        (<div onClick={handleSubmit} className="submit-button">Submit</div>) :
                                        (<div onClick={nextQuestion} className="submit-button">Next Question</div>)
                                    }   
                            </div>
                        </div>
                    </div>
                </div>
                {state.returned && !state.complete_success ? 
                (<div className='box-container-q'>
                    <div className='box'>
                    <TextField
                        id="standard-multiline-static"
                        label="What are you changing and why?"
                        multiline
                        rows={2}
                        variant="filled"
                        fullWidth
                        sx={{ display: 'flex', flex: 1 }}
                        value={reasoning}
                        onChange={
                            (e) => setReasoning(e.target.value)
                        }
                    />
                    </div>
                </div>) : 
                    null
                }
            </>
        ) : (
                <>
                    <div className='error-container'>
                        <div className='error-content'>Invalid question id</div>
                        <NavButton name={'Return To Question List'} style={'submit-button'} path='/questions'></NavButton>
                    </div>
                </>
            )
        }
        </div>
    )
}
