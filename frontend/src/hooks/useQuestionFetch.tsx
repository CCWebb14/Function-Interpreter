import { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';

// good to have an initial state to reset
const initialState = {
	function_string: '',
    hint: ''
};

interface StateType {
    function_string: string;
    hint: string;
}

type Response = {
    data: {
        success: string;
        function_string: string;
        hint: string;
    }
}

export const useQuestionFetch = (id: number | undefined) => {
	// initial state as false
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
    // add initial state from above
    const [questionFetchState, setQuestionFetchState] = useState<StateType>(initialState);

    const FetchQuestion = async () => {
        try {
            setLoading(true);
            const res = await axios.get<Response>(`http://localhost:4001/api/question/id/${id}`)

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
	useEffect(() => {
		setQuestionFetchState(initialState);
		FetchQuestion();
	}, [id]);

    return { questionFetchState, loading, error };
}
