import React from 'react';
import '../../styles/app.css'
import { useNavigate } from 'react-router-dom';
import { useQuestionListFetch } from '../../hooks/useQuestionListFetch';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { ListItemButton } from '@mui/material';

export default function Question_Menu() {
    const { state, loading, error, setIsLoadingMore } =
    useQuestionListFetch();
    const navigate = useNavigate();

    const handleNav = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>, id : string) => {
        event.preventDefault();
        navigate(`/question/${id}`);
    };

    return(
        <div className='box-container'>
            <div className='box'>
                <List sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'auto',
                    borderStyle: 'solid',
                    borderWidth: '1px',
                    borderColor: 'lightgrey',
                }}>
                        {state.results.map((id : string) => (
                        <>
                            <ListItem key={id}>
                                <ListItemButton onClick={(e) => handleNav(e, id)}>Question #{id}</ListItemButton>
                            </ListItem>
                        </>
                        ))}
                        
                </List>
            </div>
        </div>
    )
}