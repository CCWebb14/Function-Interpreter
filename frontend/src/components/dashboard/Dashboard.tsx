import { useProfileFetch } from '../../hooks/useProfileFetch';


export default function Dashboard() {
    const { profileFetchState } = useProfileFetch(); 

    return (
        <div className='box-container'>
            <div className='box'>
                <div className='form-group'>
                    <h1 className='dashboard-header'>User Profile</h1>
                    <div className='dashboard'><b>User Name:</b> {profileFetchState.userName}</div>
                    <div className='dashboard'><b>User ID:</b> {profileFetchState.userID}</div>
                    <div className='dashboard'><b>Total Time Spent:</b> {profileFetchState.totalTime} seconds</div>
                    <div className='dashboard'><b>Total Attempted Questions:</b> {profileFetchState.attemptedQuestions}</div>
                    <div className='dashboard'><b>Total Remaining Questions:</b> {5-profileFetchState.attemptedQuestions}</div>
                    <div className='dashboard'><b>Total Passed Questions:</b> {profileFetchState.passedQuestions}</div>
                    </div>
                    {/* <div className="question-list">
                <h2>Questions Fully Passed</h2>
                {profileFetchState.q.length > 0 ? (
                    <ul>
                        {profileFetchState.q.map((questionID) => (
                            <li key={questionID}>Question ID: {questionID}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No questions fully passed.</p>
                )}
            </div> */}
                </div>            
        </div>
    )
}





    

    

