import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header/Header";
import Home from "./pages/Home/Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Checkout from "./pages/Checkout/Checkout";
import Login from "./pages/Login/Login";
import { auth, db } from "./utils/firebase";
import { useStateValue } from "./StateProvider";
import Payment from "./pages/Payment/Payment";
import RequestAll from "./pages/RequestAll/RequestAll";
import Loading from "./components/Loading/Loading";
import Alert from "@material-ui/lab/Alert";
import Fade from "@material-ui/core/Fade";
import { IconButton } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import RequestBid from "./pages/RequestBid/RequestBid";
import Confirmation from "./pages/Confirmation/Confirmation";
import Profile from "./pages/Profile/Profile";
import ProductDetails from "./components/ProductDetails/ProductDetails";

function App() {
  const [{ user, loading, flash, showFlash }, dispatch] = useStateValue();
  const [indicators, setIndicators] = useState();

  const displayMessage = useCallback(
    (severity, message) => {
      dispatch({
        type: "ADD_FLASH_MESSAGE",
        message: {
          severity,
          message,
          duration: 5000,
        },
      });

      dispatch({
        type: "SHOW_FLASH_MESSAGE",
        showFlash: true,
      });
    },
    [dispatch]
  );

  const closeFlash = useCallback(() => {
    dispatch({
      type: "SHOW_FLASH_MESSAGE",
      showFlash: false,
    });
  }, [dispatch]);

  const flashMessage = useCallback(() => {
    if (showFlash) {
      setTimeout(() => {
        closeFlash();
      }, flash.duration);
    }
  }, [showFlash, flash, closeFlash]);

  const userAuthentication = useCallback(
    (authUser, idTokenResult) => {
      if (authUser) {
        dispatch({
          type: "SET_USER",
          user: {
            ...authUser,
            ...idTokenResult.claims,
          },
        });
      } else {
        dispatch({
          type: "SET_USER",
          user: null,
        });
      }
      dispatch({
        type: "SET_LOADED",
        loaded: true,
      });
    },
    [dispatch]
  );

  const setLoading = useCallback(() => {
    dispatch({
      type: "ADD_LOADING",
      loading: false,
    });
  }, [dispatch]);

  useEffect(() => {
    if (!user) {
      return setIndicators();
    }
    const cleanUpSnapshotCount = db
      .collection("users")
      .doc(user?.uid)
      .collection("indicators")
      .doc("alerts")
      .onSnapshot((doc) => {
        setIndicators(doc.data());
      });

    return () => cleanUpSnapshotCount();
  }, [user]);

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      setLoading();
      authUser
        ?.getIdTokenResult()
        .then((idTokenResult) => {
          userAuthentication(authUser, idTokenResult);
        })
        .catch((e) => {
          setLoading();
          displayMessage("error", e.message);
        });
    });
  }, [setLoading, userAuthentication, displayMessage]);

  useEffect(() => {
    flashMessage();
  }, [flashMessage]);

  return (
    <Router>
      <div className="App">
        {
          <Fade in={showFlash} timeout={{ enter: 300, exit: 1000 }}>
            <Alert
              action={
                <IconButton
                  style={{ pointerEvents: "auto" }}
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={closeFlash}
                >
                  <Close fontSize="inherit" />
                </IconButton>
              }
              className="app__alert"
              style={{
                top: window.location.pathname === "/login" ? "5px" : "65px",
              }}
              severity={flash.severity}
            >
              {flash.message}
            </Alert>
          </Fade>
        }
        <Switch>
          <Route path="/profile">
            {loading ? (
              <Loading />
            ) : (
              <>
                <Header indicators={indicators} />
                <Profile />
              </>
            )}
          </Route>

          <Route path="/product">
            {loading ? (
              <Loading />
            ) : (
              <>
                <Header indicators={indicators} />
                <ProductDetails product />
              </>
            )}
          </Route>

          <Route path="/bid">
            {loading ? (
              <Loading />
            ) : (
              <>
                <Header indicators={indicators} />
                <RequestBid />
              </>
            )}
          </Route>

          <Route path="/request">
            {loading ? (
              <Loading />
            ) : (
              <>
                <Header indicators={indicators} />
                <RequestAll />
              </>
            )}
          </Route>

          <Route path={"/confirmation"}>
            {loading ? (
              <Loading />
            ) : (
              <>
                <Header indicators={indicators} />
                <Confirmation />
              </>
            )}
          </Route>

          <Route path={"/payment"}>
            {loading ? (
              <Loading />
            ) : (
              <>
                <Header indicators={indicators} />
                <Payment />
              </>
            )}
          </Route>

          <Route path="/checkout">
            {loading ? (
              <Loading />
            ) : (
              <>
                <Header indicators={indicators} />
                <Checkout />
              </>
            )}
          </Route>

          <Route path="/login">
            <Login />
          </Route>

          <Route path="/">
            {loading ? (
              <Loading />
            ) : (
              <>
                <Header indicators={indicators} />
                <Home />
              </>
            )}
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
