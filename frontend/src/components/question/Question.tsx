import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/app.css'
import '../../styles/question.css'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import TextField from '@mui/material/TextField';
import { useParams } from 'react-router-dom';
import { useQuestionFetch } from '../../hooks/useQuestionFetch';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

const initialState = {
    success: '',
    test_result: '',
    llm_function: '',
    returned: false
};

interface StateType {
    success: string;
    test_result: string;
    llm_function: string;
    returned: boolean;
}

type response = {
    data: {
        success: string;
        test_result: string;
        llm_function: string;
    }
}

export default function Question() {
    const [answer, setAnswer] = useState('');
    const [results, setResults] = useState(false);
    const [state] = useState<StateType>(initialState);
    const [submitError, setSubmitError] = useState('');
    const { id } = useParams();
    const { questionFetchState, loading, error, setIsLoadingMore } =
    useQuestionFetch(id);

    const handleSubmit = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();
        const json_submission = {answer}

        console.log(json_submission);
        console.log(answer);

        try {
            const axios_response : response = await axios.post(`http://localhost:4001/api/question/submit/${id}`, {
                answer
        });
            if (axios_response.data.success) {
                console.log(axios_response.data.test_result)
                state.returned = true;
                state.success = axios_response.data.success;
                state.test_result = axios_response.data.test_result;
                state.llm_function = axios_response.data.llm_function;
            } else {
                setSubmitError('Something went wrong');
            }
        } catch (err) {
            setSubmitError('An error occurred. Please try again.');
        }

        
    };

    return(
        <div className='box-container-q'>
            <div className='box'>
                <SyntaxHighlighter  language="javascript" showLineNumbers
                customStyle={{display:'flex', width:'100%', flex: 1, padding: 0}} >
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
                    sx={{display : 'flex'}}
                    onChange={
                        (e) => setAnswer(e.target.value)
                    }
                />
                <div className='footer'>
                    <div className='spacer'></div>
                    {state.returned ? (
                        <Alert severity="success">
                        <AlertTitle>Success</AlertTitle>
                            {state.test_result}
                        </Alert>
                    ) : null}
                    
                    <div onClick={handleSubmit} className="submit-button">Submit</div>
                </div>
            </div>
        </div>
    )
}