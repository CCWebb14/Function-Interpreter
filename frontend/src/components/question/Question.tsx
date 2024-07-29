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


// tests_failed is number of failed tests
// failed_tests is an array of failed tests 
const initialState = {
    success: '',
    tests_passed: '',
    total_tests: '',
    cases: [],
    llm_function: '',
    complete_success: false,
    returned: false
};

interface StateType {
    success: string;
    tests_passed: string;
    total_tests: string;
    cases: test_case[];
    llm_function: string;
    complete_success: boolean;
    returned: boolean;
}

type test_case = {
    testID: number; 
    input : any[];
    expected_output : any;
    output : any;
    pass : boolean;
};

const submitErrorInitialState = {
    errorMsg: '',
    error: false,
}

interface SubmitErrorStateType {
    errorMsg: string;
    error: boolean;
}

type response = {
    data: {
        success: string;
        tests_passed: string;
        total_tests: string;
        llm_function: string;
        cases: test_case[];
    }
}

export default function Question() {
    const [user_input, setUserInput] = useState('');
    const [reasoning, setReasoning] = useState('');
    const [state, setState] = useState<StateType>(initialState);
    const [submitError, setSubmitError] = useState<SubmitErrorStateType>(submitErrorInitialState);
    const { id } = useParams<{ id: string }>();
    const [ stateID, setStateID ] = useState(Number(id));
    const { questionFetchState, error } = useQuestionFetch(stateID);
    const [submissionLoading, setSubmissionLoading] = useState(false);
    const { time, start, reset } = useTimer({
        autostart: true,
    });
    const [ hint_used, setHintUsed ] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    if (!id) {
        return <div>Error: Question ID is missing.</div>;
    }

    const handleOpen = () => {
        setModalOpen(true);
    };

    // Function to close the modal
    const handleClose = () => {
        setModalOpen(false);
    };

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
                setSubmitError(submitErrorInitialState);
                // Only reset question timer on successful response
                setReasoning('');
                reset();
                start();
            } else {
                setSubmitError({
                    errorMsg: 'Server connection failed. Please try again.',
                    error: true,
                });
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setSubmitError({
                    errorMsg: 'Please rephrase and try again. The ollama container may still be pulling the model.',
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

    const nextQuestion = () => {
        setUserInput('');
        reset();
        setHintUsed(false);
        setState(initialState);
        setStateID(stateID + 1);
    }

    const toggleHint = () => {
        setHintUsed(!hint_used);
    };

    let alertContent;

    if (submitError.error) {
        alertContent =
            (<Alert severity="error">
                <AlertTitle>Warning</AlertTitle>
                {submitError.errorMsg}
            </Alert>)
    } else if (state.complete_success) {
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
                            Result: {testCase.output.toString()}
                            {(testCase.pass) ? (
                                <> == </>
                            ) : (<> != </>)}
                            {testCase.expected_output.toString()} <br />
                            Pass: {testCase.pass.toString()}
                        </Typography>
                        ))}
                    </Box>
                </Modal>
                <span onClick={handleOpen} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>test case breakdown</span>
            </Alert>)
    } else if (state.returned) {
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
                            Input: {testCase.input.toString()} <br />
                            Result: {testCase.output.toString()}
                            {(testCase.pass) ? (
                                <> == </>
                            ) : (<> != </>)}
                            {testCase.expected_output.toString()} <br />
                            Pass: {testCase.pass.toString()}
                        </Typography>
                        ))}
                    </Box>
                </Modal>
                <span onClick={handleOpen} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>test case breakdown</span>
            </Alert>)
    } else {
        alertContent = null;
    }

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
