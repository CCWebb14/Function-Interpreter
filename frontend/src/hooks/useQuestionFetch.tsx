import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config'

// Initial state before fetching
const initialState = {
	function_string: '',
    hint: ''
};

// Interface for state type definitions
interface StateType {
    function_string: string;
    hint: string;
}

// Type definitions for expected json response from api
type Response = {
    status: number,
    data: {
        success: string;
        function_string: string;
        hint: string;
    }
}

// React hook to fetch data specified based off of passed question id
export const useQuestionFetch = (id: number | undefined) => {
	const [loading, setLoading] = useState(false); 
	const [error, setError] = useState(false);
    const [questionFetchState, setQuestionFetchState] = useState<StateType>(initialState);

    const FetchQuestion = async () => {
        try {
            setLoading(true);
            const res : Response = await axios.get(config.baseURL + `/api/question/id/${id}`)

            if (res.status >= 400) {
                setError(true);
            } else {
                setQuestionFetchState(() => ({   
                    function_string : res.data.function_string,
                    hint: res.data.hint,
			}));
            }
            
        } catch (err) {
            setError(true);
        }
        setLoading(false);
    }

    // Use only on mount or when id changes, [] is a dependancy array, ie: when do we want it to trigger
    // re-render when id changes, allows user to progress to next question
	useEffect(() => {
		setQuestionFetchState(initialState);
		FetchQuestion();
	}, [id]);

    return { questionFetchState, loading, error };
}
