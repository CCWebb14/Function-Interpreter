import { useState, useEffect } from 'react';
import axios from 'axios';


// good to have an initial state to reset 
const initialState = {
    userName: '',
    totalTime: 0,
    attemptedQuestions: 0,
    passedQuestions: 0,
};

interface StateType { 
    userName: string;
    totalTime: number;
    attemptedQuestions: number; 
    passedQuestions: number;
}

type response = { 
    data: {
        success: string; 
        userName: string;
        totalTime: number;
        attemptedQuestions: number; 
        passedQuestions: number;
    }
}

//Fetches User Statistics from backend
export const useProfileFetch = () => {
    // initial state as false 
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
    // add initial state from above
    const [profileFetchState, setProfileFetchState] = useState<StateType>(initialState);

    const FetchProfile = async () => {
        try { 
            setLoading(true); 
            const res : response = await axios.get('http://localhost:4001/api/users/dashboard')
            setProfileFetchState(() => ({
                userName: res.data.userName,
                totalTime: res.data.totalTime, 
                attemptedQuestions: res.data.attemptedQuestions,
                passedQuestions: res.data.passedQuestions,
            }));
        } catch(err) {
            setError(true);
        }
        setLoading(false);
    }

        // Use only on mount, [] is a dependancy array, ie: when do we want it to trigger
	// if empty will run once
	// Initial Render and search

    useEffect(() => {
        setProfileFetchState(initialState); 
        //fetch profile info
        FetchProfile();
    }, []);

    return { profileFetchState, loading, error };
}
