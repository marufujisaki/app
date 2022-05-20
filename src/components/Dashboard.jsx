// React imports
import React, { useState, useRef } from "react";
import Helmet from "react-helmet";
import Chart from "react-apexcharts";

//Components
import Header from "./layout/Header";
import Menu from "./layout/Menu";

// Sass modules
import styles from "../sass/Dashboard.module.scss";
import "../sass/utilities/typography.module.scss";

// Font Awesome icons
import { faTableList, faUserCheck } from "@fortawesome/free-solid-svg-icons";
import { faFileLines } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Data import
import chartData from "../data/chartData.js";

export default function Dashboard() {
  let refMenu = useRef(),
    refMain = useRef();

  return (
    <>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      {/* HEADER */}
      <Header menu={refMenu} main={refMain} />
      {/* <div className={styles.layout}> */}
      {/* SIDE MENU */}
      <div ref={refMenu} className={styles.menuContainer}>
        <Menu />
      </div>

      {/* MAIN SECTION */}
      <main ref={refMain}>
        <div className={styles.pendingCards}>
          <a href="/" className={styles.miniCard}>
            <FontAwesomeIcon icon={faTableList} />
            <div>
              <h2>12</h2>
              <p>Licitaciones pendientes</p>
            </div>
          </a>
          <a href="/" className={styles.miniCard}>
            <FontAwesomeIcon icon={faFileLines} />
            <div>
              <h2>3</h2>
              <p>Ofertas pendientes</p>
            </div>
          </a>
        </div>
        <div className={styles.pendingCharts}>
          <div className={styles.chartCard}>
            <Chart {...chartData} />
          </div>
          <div className={styles.users}>
            <p>Usuarios por aprobar</p>
            <p>
              Empresa Example C.A <FontAwesomeIcon icon={faUserCheck} />{" "}
            </p>
            <hr />
            <p>
              Empresa Example C.A <FontAwesomeIcon icon={faUserCheck} />{" "}
            </p>
            <hr />
            <p>
              Empresa Example C.A <FontAwesomeIcon icon={faUserCheck} />{" "}
            </p>
            <hr />
            <p>
              Empresa Example C.A <FontAwesomeIcon icon={faUserCheck} />{" "}
            </p>
          </div>
        </div>
      </main>
      {/* </div> */}
    </>
  );
}
