import React, { useState, useRef } from "react";

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
  // State
  const [profileVisible, setProfileVisible] = useState(false);

  let refProfileBtn = useRef(),
    refProfileOptions = useRef();

  const handleToggleMenu = (e) => {
    if (
      props.menu.current.style.webkitTransform === "translateX(0px)" ||
      props.menu.current.style.transform === "translateX(0px)" ||
      props.menu.current.style.msTransform === "translateX(0px)"
    ) {
      props.menu.current.style.webkitTransform = "translateX(-110%)";
      props.menu.current.style.msTransform = "translateX(-110%)";
      props.menu.current.style.transform = "translateX(-110%)";
      props.main.current.style.marginLeft = "1rem";
      props.main.current.style.width = "95%";
    } else {
      props.menu.current.style.webkitTransform = "translateX(0px)";
      props.menu.current.style.msTransform = "translateX(0px)";
      props.menu.current.style.transform = "translateX(0px)";
      props.main.current.style.marginLeft = "300px";
      props.main.current.style.width = "calc(100% - 350px)";
    }
  };
  const handleProfileOptions = (e) => {
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
              <p>Cliente Nuevo 01 C.A</p>
              <FontAwesomeIcon icon={faGear} />
            </button>
          </div>
        </div>
      </header>
      <div ref={refProfileOptions} className={header.profileDropdown}>
        <p>
          <span>Hola,</span> Nombre Contacto!
        </p>
        <hr />
        <div>
          <a href="bethacorp07.com/support">
            <FontAwesomeIcon icon={faCircleQuestion} /> Help
          </a>
          <a href="/logout">
            <FontAwesomeIcon icon={faArrowRightFromBracket} /> Logout
          </a>
        </div>
      </div>
    </>
  );
}
