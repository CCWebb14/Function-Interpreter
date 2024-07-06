import React, { useState } from 'react';
import '../../styles/app.css'
import '../../styles/question.css'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import TextField from '@mui/material/TextField';


export default function Question() {
    const [answer, setAnswer] = useState('');

    const handleSubmit = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>, id : string) => {
        event.preventDefault();

    };

    const codeString = '(num) => num + 1';

    return(
        <div className='box-container-q'>
            <div className='box'>
                <SyntaxHighlighter  language="javascript" showLineNumbers
                customStyle={{display:'flex', width:'100%', flex: 1}} >
                    {codeString}
                </SyntaxHighlighter>
                <TextField label="Answer" variant="outlined" size="medium" fullWidth required onChange={
                    (e) => setAnswer(e.target.value)
                }/>
                <div onClick={handleSubmit} className="button">Submit</div>
            </div>
        </div>
    )
}