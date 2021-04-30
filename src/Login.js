import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { auth } from './firebase'
import Logo from './images/agrocunda.png'
import './Login.css'
import { useStateValue } from './StateProvider'

function Login() {
    const [{ lastUrl }, dispatch] = useStateValue()
    const history = useHistory()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [registering, setRegistering] = useState(false)
    const [signing, setSigning] = useState(false)
    const [reset, setReset] = useState(false)
    const [display, setDisplay] = useState('login')
    
    const displayMessage = (severity, message, duration) => {
        dispatch({
            type: 'ADD_FLASH_MESSAGE',
            message: {
                severity,
                message,
                duration
            }
        })

        dispatch({
            type: 'SHOW_FLASH_MESSAGE',
            showFlash: true
        })
    }

    const redirectToPrev = () => {
        if(lastUrl !== null) {
            history.push(lastUrl)

            dispatch({
                type: 'RESET__URL'
            })
        } else {
            history.push('/')
        }
    }

    const signIn = e => {
        e.preventDefault()
        setSigning(true)

        if (!(navigator.onLine)) {
            return (
                displayMessage('error', 'No internet connection!', 5000),
                setSigning(false)
            )
        }

        if (email.length < 1) {
            return (
                displayMessage('warning', 'Input your Email!', 5000),
                setSigning(false)
            )
        }

        if (!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email))) {
            return (
                displayMessage('error', 'Invalid Email address!', 5000),
                setSigning(false)
            )
        }

        if (password.length < 1) {
            return (
                displayMessage('warning', 'Input your password!', 5000),
                setSigning(false)
            )
        }

        auth
            .signInWithEmailAndPassword(email, password)
            .then((user) => {
                redirectToPrev()

                displayMessage('success', `Welcome back ${user.user.displayName}`, 5000)
            })
            .catch(() => {
                setSigning(false)
                displayMessage('error', 'Invalid login credentials!', 5000)
            })
    }

    const register = (e) => {
        e.preventDefault()
        setRegistering(true)

        if (!(navigator.onLine)) {
            return (
                displayMessage('error', 'No internet connection!', 5000),
                setSigning(false)
            )
        }

        if (email.length < 1) {
            return (
                displayMessage('warning', 'Input your Email!', 5000),
                setRegistering(false)
            )
        }

        if (!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email))) {
            return (
                displayMessage('error', 'Invalid Email address!', 5000),
                setRegistering(false)
            )
        }

        if (password.length < 1) {
            return (
                displayMessage('warning', 'Input your password!', 5000),
                setRegistering(false)
            )
        }

        if (password.length < 6) {
            return (
                displayMessage('warning', 'Password must contain atleast 6 characters!', 5000),
                setRegistering(false)
            )
        }

        if (name.length < 1) {
            return (
                displayMessage('warning', 'Input your display name!', 5000),
                setRegistering(false)
            )
        }

        auth
            .createUserWithEmailAndPassword(email.trim(), password)
            .then(async (result) => {
                result.user.updateProfile({
                    displayName: name.trim()
                })
                
                if(result) {
                    const user = auth.currentUser;
                    await user.reload()
                    const actionCodeSettings = {
                        url: 'https://agrocunda.firebaseapp.com/?email=' + auth.currentUser.email,
                        handleCodeInApp: false,
                    };

                    user.sendEmailVerification(actionCodeSettings).then(() => {
                        redirectToPrev(user)
                        
                        displayMessage('success', `We are glad to have you, ${result.user.displayName}. Check your Email for verification link, to complete your registeration`, 15000)
                    }).catch(() => {
                        displayMessage('warning', 'Verify your Email in the settings option!', 10000)
                        setRegistering(false)
                        redirectToPrev(user)
                    });
                }
            })
            .catch(error => {
                displayMessage('error', error.message, 10000)
                setRegistering(false)
            })
    }

    const resetPsw = (e) => {
        e.preventDefault()
        setReset(true)

        if (!(navigator.onLine)) {
            return (
                displayMessage('error', 'No internet connection!', 5000),
                setSigning(false)
            )
        }

        if (email) {
            if (!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email))) {
                return (
                    displayMessage('error', 'Invalid Email address!', 5000),
                    setReset(false)
                )
            }
            
            const actionCodeSettings = {
                url: 'https://agrochainer.firebaseapp.com/login?email=' + email,
                handleCodeInApp: false,
            };
            auth.sendPasswordResetEmail(email.trim(), actionCodeSettings)
                .then(() => {
                    displayMessage('success', 'Check your mail for the recovery link!', 8000)
                    setReset(false)
                    history.push('/login')
                })
                .catch(e => {
                    displayMessage('error', e.message, 10000)
                    setReset(false)
                })
        } else {
            displayMessage('warning', 'Input your recovery Email!', 5000)
            setReset(false)
        }
    }
    
    return (
        <div className="login">
            <div className="login__logo" onClick={() => history.push('/')}>
                <img className="login__logoImg" src={Logo} alt="" />
                agrochainer
            </div>

            {display === "login" && <div className='login__container animated fadeIn'>
                <h2>Sign-in</h2>

                <form>
                    <h5>E-mail</h5>
                    <input type='email' value={email} onChange={e => setEmail(e.target.value)} autoFocus required />

                    <h5>Password</h5>
                    <input type='password' value={password} onChange={e => setPassword(e.target.value)} required />

                    <button className="login__button" onClick={signIn} type="submit" disabled={signing}>
                        {signing ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
                <div className="login__loading" style={{pointerEvents: signing ? 'none' : ''}}>
                    <p>
                        By signing in you agree to agrochainer's terms and condition
                    </p>
                    <p style={{ color: '#3b8238' }} onClick={() => setDisplay("register")}>
                        Don't have an account?<br/>Create One
                    </p>
                    <p style={{ color: '#3b8238' }} onClick={() => {setDisplay("retrieve")}}>
                        Forgot Password?
                    </p>
                </div>
                
            </div>}

            {display === "register" && <div className='login__container animated fadeIn'>
                <h2>Register</h2>

                <form>
                    <h5>E-mail</h5>
                    <input type='email' value={email} onChange={e => setEmail(e.target.value)} required />

                    <h5>Password</h5>
                    <input type='password' value={password} onChange={e => setPassword(e.target.value)} required />

                    <h5>Display Name</h5>
                    <input type='text' value={name} onChange={e => setName(e.target.value)} required />

                    <button className="login__button" onClick={register} disabled={registering}>
                        {registering ? 'Creating Account...' : 'Create your agrochainer Account'}
                    </button>
                </form>
                <div className="login__loading" style={{pointerEvents: registering ? 'none' : ''}}>
                    <p>
                        By creating an account you agree to agrochainer's terms and condition
                    </p>
                    <p style={{ color: '#3b8238' }} onClick={() => setDisplay("login")}>
                        Already have an account?<br/>Sign In
                    </p>
                </div>
            </div>}

            {display === "retrieve" && <div className='login__container animated fadeIn'>
                <h2>Forgot Password?</h2>

                <form>
                    <h5>Enter your email address below and we will send you details to recover your account</h5>
                    <input type='email' value={email} onChange={e => setEmail(e.target.value)} required />

                    <button className="login__button" onClick={resetPsw} disabled={reset}>
                        {!reset ? 'Reset Password' : 'Resetting...'}
                    </button>
                </form>
                <div className="login__loading" style={{pointerEvents: reset ? 'none' : ''}}>
                    <p style={{ color: '#3b8238' }} onClick={() => {setDisplay("login")}}>
                        Back to sign in
                    </p>
                </div>
            </div>}
        </div>
    )
}

export default Login
