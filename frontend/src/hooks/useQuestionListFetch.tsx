import { useState, useEffect } from 'react';
import axios from 'axios';

type qMap = {
    [questionID: number]: number;
};

// Initial state for resetting
const initialState = {
	results: [],
};

interface StateType {
    results: qMap;
}

type response = {
    data: {
        success: string;
        message: qMap;
    }
}

export const useQuestionListFetch = (path : string) => {
	// initial state as false
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
    // add initial state from above
    const [state, setState] = useState<StateType>(initialState);

    const FetchQuestionList = async () => {
        try {
            setLoading(true);
            const res : response = await axios.get(path)
            console.log(res.data.message)

            setState(() => ({   
                results : res.data.message
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
		setState(initialState);
		// fetch question list
		FetchQuestionList();
	}, []);

    return { state, loading, error };
}
