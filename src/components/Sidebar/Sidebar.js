import {
  BusinessOutlined,
  Email,
  EmailOutlined,
  ExitToAppOutlined,
  Forum,
  ForumOutlined,
  Help,
  HelpOutline,
  Home,
  HomeOutlined,
  MoreHoriz,
  MoreHorizOutlined,
  PaymentOutlined,
  PeopleAlt,
  PeopleAltOutlined,
  PinDrop,
  PinDropOutlined,
  Settings,
  SettingsOutlined,
} from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { auth } from "../../utils/firebase";
import "./Sidebar.css";
import { useStateValue } from "../../StateProvider";

function Sidebar({
  home,
  forum,
  requests,
  messages,
  pinned,
  members,
  transactions,
  settings,
  more,
  help,
}) {
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
          className="sidebar__navIcon sidebar__465h"
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
          className="sidebar__navIcon"
          style={forum && style}
          onClick={() => history.push("/forum")}
        >
          {forum ? <Forum /> : <ForumOutlined />}
          <span className="sidebar__toolTip">Forum</span>
        </div>

        <div
          className="sidebar__navIcon"
          style={messages && style}
          onClick={() => history.push("/messages")}
        >
          {messages ? <Email /> : <EmailOutlined />}
          <span className="sidebar__toolTip">Messages</span>
        </div>

        <div
          className="sidebar__navIcon"
          style={members && style}
          onClick={() => history.push("/members")}
        >
          {members ? <PeopleAlt /> : <PeopleAltOutlined />}
          <span className="sidebar__toolTip">Members</span>
        </div>

        <div
          className="sidebar__navIcon"
          style={pinned && style}
          onClick={() => history.push("/pinned")}
        >
          {pinned ? <PinDrop /> : <PinDropOutlined />}
          <span className="sidebar__toolTip">Pinned</span>
        </div>

        <div
          className="sidebar__navIcon"
          style={transactions && style}
          onClick={() => history.push("/transactions")}
        >
          <PaymentOutlined />
          <span className="sidebar__toolTip">Transactions</span>
        </div>

        <div
          className="sidebar__navIcon"
          style={settings && style}
          onClick={() => history.push("/settings")}
        >
          {settings ? <Settings /> : <SettingsOutlined />}
          <span className="sidebar__toolTip">Settings</span>
        </div>

        <div
          className="sidebar__navIcon sidebar__465v"
          style={help && style}
          onClick={() => {
            history.push("/help");
          }}
        >
          {help ? <Help /> : <HelpOutline />}
          <span className="sidebar__toolTip">Help</span>
        </div>

        <div
          className="sidebar__navIcon"
          style={more && style}
          onClick={() => history.push("/more")}
        >
          {more ? <MoreHoriz /> : <MoreHorizOutlined />}
          <span className="sidebar__toolTip">More</span>
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
            className="sidebar__nav"
            style={forum && style}
            onClick={() => history.push("/forum")}
          >
            {forum ? <Forum /> : <ForumOutlined />}
            <span>Forum</span>
          </div>

          <div
            className="sidebar__nav"
            style={messages && style}
            onClick={() => history.push("/messages")}
          >
            {messages ? <Email /> : <EmailOutlined />}
            <span>Messages</span>
          </div>

          <div
            className="sidebar__nav"
            style={members && style}
            onClick={() => history.push("/members")}
          >
            {members ? <PeopleAlt /> : <PeopleAltOutlined />}
            <span>Members</span>
          </div>

          <div
            className="sidebar__nav"
            style={pinned && style}
            onClick={() => history.push("/pinned")}
          >
            {pinned ? <PinDrop /> : <PinDropOutlined />}
            <span>Pinned</span>
          </div>

          <div
            className="sidebar__nav"
            style={transactions && style}
            onClick={() => history.push("/transactions")}
          >
            <PaymentOutlined />
            <span>Transactions</span>
          </div>

          <div
            className="sidebar__nav"
            style={settings && style}
            onClick={() => history.push("/settings")}
          >
            {settings ? <Settings /> : <SettingsOutlined />}
            <span>Settings</span>
          </div>

          <div
            className="sidebar__nav"
            style={more && style}
            onClick={() => history.push("/more")}
          >
            {more ? <MoreHoriz /> : <MoreHorizOutlined />}
            <span>More</span>
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
          className="sidebar__nav sidebar__465h"
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
          className="sidebar__nav"
          style={forum && style}
          onClick={() => {
            history.push("/forum");
            closeSidebar();
          }}
        >
          {forum ? <Forum /> : <ForumOutlined />}
          <span>Forum</span>
        </div>

        <div
          className="sidebar__nav"
          style={messages && style}
          onClick={() => {
            history.push("/messages");
            closeSidebar();
          }}
        >
          {messages ? <Email /> : <EmailOutlined />}
          <span>Messages</span>
        </div>

        <div
          className="sidebar__nav"
          style={members && style}
          onClick={() => {
            history.push("/members");
            closeSidebar();
          }}
        >
          {members ? <PeopleAlt /> : <PeopleAltOutlined />}
          <span>Members</span>
        </div>

        <div
          className="sidebar__nav"
          style={pinned && style}
          onClick={() => {
            history.push("/pinned");
            closeSidebar();
          }}
        >
          {pinned ? <PinDrop /> : <PinDropOutlined />}
          <span>Pinned</span>
        </div>

        <div
          className="sidebar__nav"
          style={transactions && style}
          onClick={() => {
            history.push("/transactions");
            closeSidebar();
          }}
        >
          <PaymentOutlined />
          <span>Transactions</span>
        </div>

        <div
          className="sidebar__nav"
          style={settings && style}
          onClick={() => {
            history.push("/settings");
            closeSidebar();
          }}
        >
          {settings ? <Settings /> : <SettingsOutlined />}
          <span>Settings</span>
        </div>

        <div
          className="sidebar__nav sidebar__465v"
          style={help && style}
          onClick={() => {
            history.push("/help");
            closeSidebar();
          }}
        >
          {help ? <Help /> : <HelpOutline />}
          <span>Help</span>
        </div>

        <div
          className="sidebar__nav"
          style={more && style}
          onClick={() => {
            history.push("/more");
            closeSidebar();
          }}
        >
          {more ? <MoreHoriz /> : <MoreHorizOutlined />}
          <span>More</span>
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
