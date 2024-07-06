import React from 'react';
import '../../styles/question.css'

export default function Question() {

    const handleSubmit = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>, id : string) => {
        event.preventDefault();

    };

    return(
        <div className='box-container-su'>
            <div className='box'>
            
            </div>
        </div>
    )
}