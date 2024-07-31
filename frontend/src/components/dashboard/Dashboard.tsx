import { useProfileFetch } from '../../hooks/useProfileFetch';
import '../../styles/dashboard.css'



export default function Dashboard() {
    const { profileFetchState } = useProfileFetch();

    return (
        <div className='box-container-dashboard'>
            <div className='dashboard-header'>User Profile</div>
            <div className='dashboard'><b>User Name: </b> {profileFetchState.userName}</div>
            <div className='dashboard'>
                <b>Total Time Spent: </b>
                {profileFetchState.totalTime >= 60
                    ? `${Math.floor(profileFetchState.totalTime / 60)} minutes ${profileFetchState.totalTime % 60} seconds`
                    : `${profileFetchState.totalTime} seconds`}
            </div>
            <div className='dashboard'><b>Total Attempted Questions: </b> {profileFetchState.attemptedQuestions}</div>
            <div className='dashboard'><b>Total Remaining Questions: </b> {5 - profileFetchState.attemptedQuestions}</div>
            <div className='dashboard'><b>Total Passed Questions: </b> {profileFetchState.passedQuestions}</div>
        </div>
    )
}









