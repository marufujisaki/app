import React, { useState, useRef, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import header from "../../sass/utilities/header.module.scss";
import "../../sass/utilities/typography.module.scss";

// Font Awesome icons
import {
  faBars,
  faGear,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { faBell, faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Header(props) {
  // Context
  const { loggedUser, handleAuth } = useContext(AuthContext);

  // State
  const [profileVisible, setProfileVisible] = useState(false);

  //Refs
  let refProfileBtn = useRef(),
    refProfileOptions = useRef();

  // Navigation
  let navigate = useNavigate();

  const handleToggleMenu = () => {
    if (props.main.current.style.marginLeft === "300px") {
      props.menu.current.style.webkitTransform = "translateX(-110%)";
      props.menu.current.style.msTransform = "translateX(-110%)";
      props.menu.current.style.transform = "translateX(-110%)";
      props.main.current.style.marginLeft = "0";
      props.main.current.style.width = "100%";
    } else {
      props.menu.current.style.webkitTransform = "translateX(0px)";
      props.menu.current.style.msTransform = "translateX(0px)";
      props.menu.current.style.transform = "translateX(0px)";
      props.main.current.style.marginLeft = "300px";
      props.main.current.style.width = "calc(100% - 300px)";
    }
  };
  const handleProfileOptions = () => {
    if (!profileVisible) {
      setProfileVisible(true);
      refProfileBtn.current.style.backgroundColor = "#2196f3";
      refProfileBtn.current.style.color = "#fff";
      refProfileOptions.current.style.display = "block";
      refProfileOptions.current.style.animation = "pulse 0.5s";
    } else {
      setProfileVisible(false);
      refProfileBtn.current.style.backgroundColor = "#e3f2fd";
      refProfileBtn.current.style.color = "#2196f3";
      refProfileOptions.current.style.display = "none";
      refProfileOptions.current.style.animation = "none";
    }
  };
  const handleLogout = () => {
    handleAuth(null);
    navigate("/login");
  };
  return (
    <>
      {/* HEADER */}
      <header>
        <div>
          <div className={header.logo}>
            BETHACORP 07
            <button className={header.menuBtn} onClick={handleToggleMenu}>
              <FontAwesomeIcon icon={faBars} />
            </button>
          </div>
          {/* <div>
            <button className={forms.searchInput}>
              <FontAwesomeIcon icon={faSearch} />
              <input type="search" name="" id="" placeholder="Search" />
            </button>
          </div> */}
        </div>
        <div>
          <div className={header.flexDiv}>
            <div className={header.notification}>
              <FontAwesomeIcon icon={faBell} />
            </div>
          </div>
          <div className={header.flexDiv}>
            <button
              ref={refProfileBtn}
              className={header.settings}
              onClick={handleProfileOptions}
            >
              <p>{loggedUser.user_name}</p>
              <FontAwesomeIcon icon={faGear} />
            </button>
          </div>
        </div>
      </header>
      <div ref={refProfileOptions} className={header.profileDropdown}>
        <p>
          <span>Hola,</span> {loggedUser.contact_name}
        </p>
        <hr />
        <div>
          <a
            href="bethacorp07.com/support"
            target="_blank"
            rel="noopener noreferrer"
            className={header.links}
          >
            <FontAwesomeIcon icon={faCircleQuestion} /> Ayuda
          </a>
          <p className={header.links} onClick={handleLogout}>
            <FontAwesomeIcon icon={faArrowRightFromBracket} /> Cerrar sesión
          </p>
        </div>
      </div>
    </>
  );
}
