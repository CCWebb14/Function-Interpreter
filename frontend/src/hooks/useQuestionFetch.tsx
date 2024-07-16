import { useState, useEffect } from 'react';
import axios from 'axios';

// good to have an initial state to reset
const initialState = {
	function_string: '',
    hint: ''
};

interface StateType {
    function_string: string;
    hint: string;
}

type response = {
    data: {
        success: string;
        function_string: string;
        hint: string;
    }
}

export const useQuestionFetch = (id: string | undefined) => {
	// initial state as false
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
    // add initial state from above
    const [questionFetchState, setQuestionFetchState] = useState<StateType>(initialState);

    const FetchQuestion = async () => {
        try {
            setLoading(true);
            const res : response = await axios.get(`http://localhost:4001/api/question/id/${id}`)

            setQuestionFetchState(() => ({   
                function_string : res.data.function_string,
                hint: res.data.hint,
			}));
        } catch (err) {
            setError(true);
        }
        setLoading(false);
    }

    // Use only on mount, [] is a dependancy array, ie: when do we want it to trigger
	// if empty will run once
	// Initial Render and search
	useEffect(() => {
		setQuestionFetchState(initialState);
		// fetch question list
		FetchQuestion();
	}, []);

    return { questionFetchState, loading, error };
}
