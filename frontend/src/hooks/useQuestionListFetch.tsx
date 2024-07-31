import { useState, useEffect } from 'react';
import axios from 'axios';



// Initial state for resetting
const initialState = {
	results: [],
};

// Interface for state type definitions
interface StateType {
    results: qMap;
}

// Type definition for expected json response from api
type response = {
    data: {
        success: string;
        message: qMap;
    }
}

// Type definition for qMap object
// Maps question id to completion status (0 (unattempted), 1 (attempted), 2 (completed))
type qMap = {
    [questionID: number]: number;
};

// React hook to fetch data specified based off passed path
export const useQuestionListFetch = (path : string) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
    const [state, setState] = useState<StateType>(initialState);

    const FetchQuestionList = async () => {
        try {
            setLoading(true);
            const res : response = await axios.get(path)

            setState(() => ({   
                results : res.data.message
			}));
        } catch (err) {
            setError(true);
        }
        setLoading(false);
    }

    // Use only on mount, [] is a dependancy array, ie: when do we want it to trigger
	// empty: will run on mount
	useEffect(() => {
		setState(initialState);
		FetchQuestionList();
	}, []);

    return { state, loading, error };
}
