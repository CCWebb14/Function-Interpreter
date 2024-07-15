import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/app.css'
import '../../styles/question.css'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import TextField from '@mui/material/TextField';
import { useParams } from 'react-router-dom';
import { useQuestionFetch } from '../../hooks/useQuestionFetch';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import CircularProgress from '@mui/material/CircularProgress';
import { useTimer } from 'use-timer';

const initialState = {
    success: '',
    tests_passed: '',
    tests_failed: '',
    failed_tests: [],
    llm_function: '',
    returned: false,
    complete_success: false,
};

interface StateType {
    success: string;
    tests_passed: string;
    tests_failed: string;
    llm_function: string;
    failed_tests: number[];
    returned: boolean;
    complete_success: boolean;
}

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
        tests_failed: string;
        failed_tests: number[];
        llm_function: string;
    }
}

export default function Question() {
    const [user_input, setUserInput] = useState('');
    const [state, setState] = useState<StateType>(initialState);
    const [submitError, setSubmitError] = useState<SubmitErrorStateType>(submitErrorInitialState);
    const { id } = useParams();
    const { questionFetchState, loading, error } = useQuestionFetch(id);
    const [submissionLoading, setSubmissionLoading] = useState(false);
    const { time, start, reset } = useTimer({
        autostart: true,
    });
    // TODO: remove hintUsed stub for implementation
    const [ hint_used ] = useState(false);

    const handleSubmit = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();

        try {
            setSubmissionLoading(true);
            const axios_response: response = await axios.post(`http://localhost:4001/api/question/submit/${id}`, {
                user_input, 
                time,
                hint_used
            });
            if (axios_response.data.success) {
                setState({
                    success: axios_response.data.success,
                    tests_passed: axios_response.data.tests_passed,
                    tests_failed: axios_response.data.tests_failed,
                    failed_tests: axios_response.data.failed_tests,
                    llm_function: axios_response.data.llm_function,
                    returned: true,
                    complete_success: (axios_response.data.tests_passed === axios_response.data.tests_failed)
                });
                setSubmitError(submitErrorInitialState);
                // Only reset question timer on successful response
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
                    errorMsg: 'Make sure no Javascript syntax is present. Please rephrase and try again.',
                    error: true,
                });
            } else {
                setSubmitError({
                    errorMsg: 'An unexpected error occured. Please try again.',
                    error: true,
                });
            }
        }
        setSubmissionLoading(false);

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
                {`Tests passed: ${state.tests_passed}/${state.tests_failed}`}
            </Alert>)
    } else if (state.returned) {
        alertContent =
            (<Alert severity="error" color='warning'>
                <AlertTitle>Incorrect</AlertTitle>
                {`Tests passed: ${state.tests_passed}/${state.tests_failed}`}
                <br />
                {`Failed test(s): ${state.failed_tests.map(index => index + 1).join(', ')}`}
            </Alert>)
    } else {
        alertContent = null;
    }

    return (
        <div className='question-container'>
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
                    <div className='question-header'>Question #{id}</div>
                    <SyntaxHighlighter language="javascript" showLineNumbers
                        customStyle={{ display: 'flex', width: '100%', flex: 1, padding: 0 }} >
                        {questionFetchState.results}
                    </SyntaxHighlighter>
                    <TextField
                        id="standard-multiline-static"
                        label="Interpretation"
                        multiline
                        rows={4}
                        variant="filled"
                        fullWidth
                        required
                        sx={{ display: 'flex' }}
                        onChange={
                            (e) => setUserInput(e.target.value)
                        }
                    />
                    <div className='footer'>
                        <div className='spacer'></div>
                        {submissionLoading ?
                            (<CircularProgress color="secondary" />) :
                            (<>{alertContent}</>)}
                        <div onClick={handleSubmit} className="submit-button">Submit</div>
                    </div>
                </div>
            </div>
        </div>
    )
}