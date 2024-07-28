import React from 'react';
import '../../styles/app.css'
import { useQuestionListFetch } from '../../hooks/useQuestionListFetch';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { QuestionButton } from './Question_Button';
import { useNavigate } from 'react-router-dom';


export default function Question_Menu() {
    const { state, loading, error, setIsLoadingMore } =
    useQuestionListFetch('http://localhost:4001/api/question/list');
    const navigate = useNavigate();

    const handleNav = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>, id : string) => {
        event.preventDefault();
        navigate(`/question/${id}`);
    };


    return(
        <div className='box-container'>
            <div className='box'>
                <List disablePadding sx={{
                    display: 'flex',
                    flex: '1',
                    width: '100%',
                    flexDirection: 'column',
                    overflow: 'auto',
                    borderStyle: 'solid',
                    borderWidth: '1px',
                    borderColor: 'lightgrey',
                }}>
                        {Object.entries(state.results).map(([questionID, completionStatus]) => (
                        <>
                            <ListItem disablePadding sx={{display: 'flex', width: '100%'}} key={questionID}>
                                <QuestionButton questionID={questionID} completionStatus={completionStatus} clickFunction={handleNav} >
                                </QuestionButton>
                            </ListItem>
                        </>
                        ))}
                        
                </List>
            </div>
        </div>
    )
}