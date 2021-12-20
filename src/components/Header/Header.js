import React, { useState } from "react";
import "./Header.css";
import { useHistory } from "react-router-dom";
import { useStateValue } from "../../StateProvider";
import Forms from "../Forms/Forms";
import Logo from "../../images/emesher.png";
import { IconButton } from "@material-ui/core";
import {
  ArrowDropDown,
  MenuOutlined,
  NotificationsOutlined,
} from "@material-ui/icons";

function Header() {
  const [{ user, sidebar }, dispatch] = useStateValue();
  const [formType, setFormType] = useState("");
  const [showForm, setShowForm] = useState(false);
  const history = useHistory();

  const displaySidebar = () => {
    const sidebarValue = !sidebar;
    dispatch({
      type: "DISPLAY_SIDEBAR",
      sidebar: sidebarValue,
    });
  };

  const handleClickProfile = () => {
    document.querySelector(".header__details").removeAttribute("open");
    if (!user) {
      return history.push("/login");
    }
    history.push("/profile");
  };

  const handleFormSelect = (type) => {
    setFormType(type);
    setShowForm(true);
    document.querySelector(".header__details").removeAttribute("open");
  };

  const closeForm = (value) => {
    setShowForm(value);
  };

  return (
    <>
      <header className="header__mobile">
        <div className="header__menu">
          <IconButton onClick={displaySidebar}>
            <MenuOutlined style={{ color: "#2b2b2b" }} />
          </IconButton>
        </div>

        <div className="header__logo" onClick={() => history.push("/")}>
          <img className="header__logoImg" src={Logo} alt="" />
          <span className="header__logoName">Emesher</span>
        </div>

        <nav className="header__nav">
          <details className="header__option header__details">
            <summary className="header__summary">
              <img src={user?.photoURL} alt="" />
              <ArrowDropDown fontSize="small" />
            </summary>
            <nav className="header__profile__option">
              <button onClick={handleClickProfile}>View proile</button>
              <button onClick={() => handleFormSelect("product")}>
                New Content
              </button>
              <button onClick={() => handleFormSelect("requests")}>
                New Request
              </button>
            </nav>
          </details>
        </nav>
      </header>

      <header className="header__notMobile">
        <div className="header__menu">
          <IconButton onClick={displaySidebar}>
            <MenuOutlined style={{ color: "#2b2b2b" }} />
          </IconButton>
        </div>

        <div className="header__logo" onClick={() => history.push("/")}>
          <img className="header__logoImg" src={Logo} alt="" />
          <span className="header__logoName">Emesher</span>
        </div>

        <nav className="header__nav">
          <div className="header__option">
            {/* <div className="header__countLarge"><div>0</div></div> */}
            <div className="header__summary">
              <NotificationsOutlined />
            </div>
          </div>

          <details className="header__option header__details">
            <summary className="header__summary">
              <img src={user?.photoURL} alt="" />
              <ArrowDropDown fontSize="small" />
            </summary>
            <nav className="header__profile__option">
              <button onClick={handleClickProfile}>View proile</button>
              <button onClick={() => handleFormSelect("product")}>
                New Content
              </button>
              <button onClick={() => handleFormSelect("requests")}>
                New Request
              </button>
            </nav>
          </details>
        </nav>
      </header>

      {showForm && (
        <Forms showForm={showForm} closeForm={closeForm} type={formType} />
      )}
    </>
  );
}

export default Header;
