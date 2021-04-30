import React, { useCallback, useEffect } from 'react'
import './App.css';
import Header from './Header';
import Home from './Home';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Checkout from './Checkout';
import Login from './Login';
import { auth } from './firebase';
import { useStateValue } from './StateProvider';
import Payment from './Payment';
import Alert from '@material-ui/lab/Alert';
import Fade from '@material-ui/core/Fade'
import { IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import Confirmation from './Confirmation';
import Footer from './Footer';

function App() {
  const [{ flash, showFlash }, dispatch] = useStateValue()

  const closeFlash = useCallback(() => {
    dispatch({
      type: 'SHOW_FLASH_MESSAGE',
      showFlash: false
    })
  }, [dispatch])

  const flashMessage = useCallback(() => {
    if(showFlash) {
      setTimeout(() => {
        closeFlash();
      }, flash.duration);
    }
  }, [showFlash, flash, closeFlash])

  const userAuthentication = useCallback((authUser, idTokenResult) => {
    if (authUser) {
      dispatch({
        type: 'SET_USER',
        user: {
          ...authUser, ...idTokenResult.claims
        }
      })
    } else {
      dispatch({
        type: 'SET_USER',
        user: null
      })
    }
  }, [dispatch])

  useEffect(() => {
    auth.onAuthStateChanged(authUser => {
      authUser?.getIdTokenResult().then(idTokenResult => {
        userAuthentication(authUser, idTokenResult)
      })
    })

  }, [userAuthentication]) 

  useEffect(() => {
    flashMessage()
  }, [flashMessage])

  return (
    <Router>
      <div className="App">
        {
          <Fade in={showFlash} 
            timeout={{ enter: 300, exit: 1000 }}>
            <Alert action={
              <IconButton 
                style={{ pointerEvents: 'auto' }}
                aria-label="close"
                color="inherit"
                size="small"
                onClick={closeFlash}>
                  <Close fontSize="inherit" />
                </IconButton>
            } 
            className="app__alert" 
            style={{ top: window.location.pathname === '/login' ? '5px' : '65px' }} 
            severity={flash.severity}>
              {flash.message}
            </Alert>
          </Fade>
        }
        <Switch>
          <Route path={"/confirmation"}>
            <Header />
            <Confirmation />
          </Route>

          <Route path={"/payment"}>
            <Header />
            <Payment />
          </Route>

          <Route path="/checkout">
            <Header />
            <Checkout />
          </Route>

          <Route path="/login">
            <Login />
          </Route>

          <Route path="/">
            <Header />
            <Home />
            <Footer />
          </Route>
        </Switch>
      </div>
    </Router>
    
  );
}

export default App;
