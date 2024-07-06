import React, { useState } from 'react';
import '../../styles/app.css'
import '../../styles/question.css'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import TextField from '@mui/material/TextField';
import { useParams } from 'react-router-dom';
import { useQuestionFetch } from '../../hooks/useQuestionFetch';


export default function Question() {
    const [answer, setAnswer] = useState('');
    const { id } = useParams();
    const { state, loading, error, setIsLoadingMore } =
    useQuestionFetch(id);

    const handleSubmit = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>, id : string) => {
        event.preventDefault();
    };

    return(
        <div className='box-container-q'>
            <div className='box'>
                <SyntaxHighlighter  language="javascript" showLineNumbers
                customStyle={{display:'flex', width:'100%', flex: 1, padding: 0}} >
                    {state.results}
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
                <div className='submit-holder'>
                    <div onClick={handleSubmit} className="button">Submit</div>
                </div>
            </div>
        </div>
    )
}