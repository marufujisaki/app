import React from "react";
import { Link } from "react-router-dom";

import "../../sass/utilities/menu.module.scss";

// Font Awesome icons
import {
  faChartLine,
  faTableList,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { faSquarePlus, faFileLines } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Menu() {
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
        <div>
          <Link to="/nueva-licitacion">
            <FontAwesomeIcon icon={faSquarePlus} />
            Nueva Licitación
          </Link>
        </div>
        <div>
          <Link to="/licitaciones">
            <FontAwesomeIcon icon={faTableList} />
            Licitaciones
          </Link>
        </div>
        <hr />
        <p>Ofertas</p>
        <div>
          <Link to="/ofertas">
            <FontAwesomeIcon icon={faFileLines} />
            Ofertas pendientes
          </Link>
        </div>
        <hr />
        <p>Usuarios</p>
        <div>
          <Link to="/">
            <FontAwesomeIcon icon={faUsers} />
            Lista de Usuarios
          </Link>
        </div>
      </nav>
    </>
  );
}
