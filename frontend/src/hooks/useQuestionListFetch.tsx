import { useState, useEffect } from 'react';
import axios from 'axios';

// good to have an initial state to reset
const initialState = {
	results: [],
};

interface StateType {
    results: string[];
}

type response = {
    data: {
        success: string;
        message: Array<string>;
    }
}

export const useQuestionListFetch = () => {
	// initial state as false
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
    // add initial state from above
    const [state, setState] = useState<StateType>(initialState);

    const FetchQuestionList = async () => {
        try {
            setLoading(true);
            const res : response = await axios.get('http://localhost:4001/api/question/list')
            console.log(res.data.message)

            setState(() => ({   
                results : res.data.message
			}));
        } catch (err) {
            setError(true);
        }
        setLoading(false);
        console.log(state.results.toString())
    }

    // Use only on mount, [] is a dependancy array, ie: when do we want it to trigger
	// if empty will run once
	// Initial Render and search
	useEffect(() => {
		setState(initialState);
		// fetch question list
		FetchQuestionList();
	}, []);

    return { state, loading, error };
}
