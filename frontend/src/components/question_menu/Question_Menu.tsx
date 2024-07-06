import '../../styles/login-signup.css'
import Question_MenuBox from './Question_MenuBox'
import { useQuestionListFetch } from '../../hooks/useQuestionListFetch';

export default function Question_Menu() {
    const { state, loading, error, setIsLoadingMore } =
    useQuestionListFetch();

    state.results

    return(
        <>
            {/* <Question_MenuBox /> */}
            <div className='box-container'>{state.results}</div>
            {/* {state.results.map((result, index) )} */}
        </>
    )
}