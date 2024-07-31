import React from 'react';
import '../../styles/app.css'
import { useQuestionListFetch } from '../../hooks/useQuestionListFetch';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { QuestionButton } from './Question_Button';
import { useNavigate } from 'react-router-dom';


// React component for displaying the question menu page
// Dynamically renders a list of questions present on the backend
export default function Question_Menu() {
    // Fetch the backend question list
    const { state } = useQuestionListFetch('http://localhost:4001/api/question/list');
    const navigate = useNavigate();

    // Helper function to route the user to the question page based off of the button id
    const handleNav = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>, id: string) => {
        event.preventDefault();
        navigate(`/question/${id}`);
    };


    // Returning the question list page component, mapping results from the api call
    return (
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
                            <ListItem disablePadding sx={{ display: 'flex', width: '100%' }} key={questionID}>
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