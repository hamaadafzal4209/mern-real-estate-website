import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

function OAuth() {

    const dispatch = useDispatch();
    const naviagate = useNavigate();

    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            const result = await signInWithPopup(auth, provider);

            const res = await fetch(`/backend/auth/google`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: result.user.displayName, email: result.user.email, photo: result.user.photoURL })
            });

            const data = await res.json();
            dispatch(signInSuccess(data));
            naviagate('/')

        } catch (error) {
            console.log('Could not sign in with Google', error);
        }
    }

    return (
        <button onClick={handleGoogleClick} type="button" className='bg-red-700 text-white p-3 rounded-lg uppercase font-semibold hover:bg-red-600'>
            Continue with Google
        </button>
    )
}

export default OAuth;
