import {
  BusinessOutlined,
  ExitToAppOutlined,
  Home,
  HomeOutlined,
} from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { auth } from "../../utils/firebase";
import "./Sidebar.css";
import { useStateValue } from "../../StateProvider";

function Sidebar({ home, requests }) {
  const [{ sidebar, user }, dispatch] = useStateValue();
  const history = useHistory();
  const [displayOverlay, setDisplayOverlay] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  let resizeWindow = () => {
    setWindowWidth(window.innerWidth);
  };

  const handleAuthentication = () => {
    if (user) {
      auth.signOut();
      dispatch({
        type: "SET_USER",
        user: null,
      });
      dispatch({
        type: "EMPTY_BASKET",
      });
    } else {
      dispatch({
        type: "SET_LASTURL",
        lastUrl: window.location.pathname,
      });

      history.push("/login");
    }
  };

  const closeSidebar = () => {
    dispatch({
      type: "DISPLAY_SIDEBAR",
      sidebar: false,
    });
  };

  useEffect(() => {
    if (sidebar) {
      return setDisplayOverlay(true);
    } else {
      return setTimeout(() => {
        setDisplayOverlay(false);
      }, 300);
    }
  }, [sidebar]);

  useEffect(() => {
    resizeWindow();
    window.addEventListener("resize", resizeWindow);
    return () => window.removeEventListener("resize", resizeWindow);
  }, []);

  const style = {
    color: "rgb(0, 172, 0)",
  };

  return (
    <>
      {displayOverlay && (
        <div className="sidebar__overlay" onClick={closeSidebar}></div>
      )}

      <div
        className="sidebarIcon"
        style={{ display: windowWidth > 959 && sidebar ? "none" : "" }}
      >
        <div
          className="sidebar__navIcon"
          style={home && style}
          onClick={() => history.push("/")}
        >
          {home ? <Home /> : <HomeOutlined />}
          <span className="sidebar__toolTip">Home</span>
        </div>

        <div
          className="sidebar__navIcon"
          style={requests && style}
          onClick={() => history.push("/request")}
        >
          <BusinessOutlined />
          <span className="sidebar__toolTip">Requests</span>
        </div>

        <div
          className="sidebar__logOut"
          onClick={handleAuthentication}
          style={{ backgroundColor: !user && "rgb(0, 172, 0)" }}
        >
          <ExitToAppOutlined
            style={{
              WebkitTransform: !user ? "scaleX(-1)" : "",
              transform: !user ? "scaleX(-1)" : "",
            }}
            fontSize="small"
          />
          <span
            className="sidebar__toolTip"
            style={{
              backgroundColor: user
                ? "rgb(255, 250, 250)"
                : "rgb(235, 255, 235)",
            }}
          >
            {user ? "Log out" : "Login"}
          </span>
        </div>
      </div>

      {sidebar && (
        <div className="sidebar">
          <div
            className="sidebar__nav"
            style={home && style}
            onClick={() => history.push("/")}
          >
            {home ? <Home /> : <HomeOutlined />}
            <span>Home</span>
          </div>

          <div
            className="sidebar__nav"
            style={requests && style}
            onClick={() => history.push("/request")}
          >
            <BusinessOutlined />
            <span>Requests</span>
          </div>

          <div
            className="sidebar__logOut"
            onClick={handleAuthentication}
            style={{ backgroundColor: !user && "rgb(0, 172, 0)" }}
          >
            <ExitToAppOutlined
              style={{
                WebkitTransform: !user ? "scaleX(-1)" : "",
                transform: !user ? "scaleX(-1)" : "",
              }}
            />{" "}
            <span>{user ? "Log out" : "Login"}</span>
          </div>
        </div>
      )}

      <div
        className="sidebarSmall"
        style={{
          left: sidebar ? "0" : "",
          opacity: sidebar ? "1" : "",
        }}
      >
        <div
          className="sidebar__nav"
          style={home && style}
          onClick={() => {
            history.push("/");
            closeSidebar();
          }}
        >
          {home ? <Home /> : <HomeOutlined />}
          <span>Home</span>
        </div>

        <div
          className="sidebar__nav"
          style={requests && style}
          onClick={() => {
            history.push("/request");
            closeSidebar();
          }}
        >
          <BusinessOutlined />
          <span>Requests</span>
        </div>

        <div
          className="sidebar__logOut"
          onClick={handleAuthentication}
          style={{ backgroundColor: !user && "rgb(0, 172, 0)" }}
        >
          <ExitToAppOutlined
            style={{
              WebkitTransform: !user ? "scaleX(-1)" : "",
              transform: !user ? "scaleX(-1)" : "",
            }}
          />{" "}
          <span>{user ? "Log out" : "Login"}</span>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
