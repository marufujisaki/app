import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

import "../../sass/utilities/menu.module.scss";

// Font Awesome icons
import {
  faUserCheck,
  faChartLine,
  faTableList,
  faUsers,
  faListCheck,
} from "@fortawesome/free-solid-svg-icons";
import { faSquarePlus, faFileLines } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Menu() {
  // Context
  const { loggedUser } = useContext(AuthContext);
  return (
    <>
      {/* SIDE MENU */}
      <nav>
        <p>Dashboard</p>
        <div>
          <Link to="/">
            <FontAwesomeIcon icon={faChartLine} />
            Dashboard
          </Link>
        </div>
        <hr />
        <p>Licitaciones</p>
        {!loggedUser.user_type ? (
          <div>
            <div>
              <Link to="/pending-licitaciones">
                <FontAwesomeIcon icon={faListCheck} />
                Pendientes
              </Link>
            </div>
            <div>
              <Link to="/licitaciones">
                <FontAwesomeIcon icon={faTableList} />
                Todas las licitaciones
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div>
              <Link to="/nueva-licitacion">
                <FontAwesomeIcon icon={faSquarePlus} />
                Nueva Licitación
              </Link>
            </div>
            <div>
              <Link to="/mis-licitaciones">
                <FontAwesomeIcon icon={faTableList} />
                Mis licitaciones
              </Link>
            </div>
          </div>
        )}
        <hr />
        <p>Ofertas</p>
        {!loggedUser.user_type ? (
          <div>
            <Link to="/ofertas">
              <FontAwesomeIcon icon={faFileLines} />
              Mis ofertas
            </Link>
          </div>
        ) : (
          <div>
            <Link to="/pending-ofertas">
              <FontAwesomeIcon icon={faFileLines} />
              Ofertas pendientes
            </Link>
          </div>
        )}

        <hr />
        {!loggedUser.user_type ? (
          <div>
            <p>Usuarios</p>
            <div>
              <Link to="/pending-users">
                <FontAwesomeIcon icon={faUserCheck} />
                Usuarios pendientes
              </Link>
            </div>
            <div>
              <Link to="/user-list">
                <FontAwesomeIcon icon={faUsers} />
                Lista de Usuarios
              </Link>
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </nav>
    </>
  );
}
