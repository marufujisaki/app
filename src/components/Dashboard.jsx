// React imports
import React, { useRef, useContext, useEffect, useState } from "react";
import Helmet from "react-helmet";
import Chart from "react-apexcharts";
import AuthContext from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import ServicesContext from "../context/ServicesContext";

//Components
import Header from "./layout/Header";
import Menu from "./layout/Menu";

// Sass modules
import styles from "../sass/Dashboard.module.scss";
import "../sass/utilities/typography.module.scss";

// Font Awesome icons
import {
  faUserCheck,
  faArrowUp,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Data import
import chartData from "../data/chartData.js";

export default function Dashboard() {
  // Context
  const { logged, loggedUser } = useContext(AuthContext);
  const { api } = useContext(ServicesContext);

  // State
  const [modal, setModal] = useState(false);
  const [usersFlag, setUsersFlag] = useState("Cargando...");
  const [userID, setUserID] = useState(null);
  const [users, setUsers] = useState([]);

  // Refs
  let refMenu = useRef(),
    refMain = useRef(),
    refModal = useRef();

  // Navigation
  const navigate = useNavigate();

  // Event handlers

  // User list
  const handleAction = (e) => {
    e.preventDefault();
    let approveUser = async (url, params) => {
      let res = await fetch(url, params);
      let json = await res.json();
      if (json.success) {
        handleModal("none");
      }
    };
    approveUser(api + "users/?aprobar=1", {
      method: "POST",
      body: JSON.stringify({ id: userID }),
    });
    // console.log(userID);
  };
  const handleModal = (user) => {
    if (!modal) {
      setModal(true);
      refModal.current.style.display = "flex";
      setUserID(user);
    } else {
      setModal(false);
      refModal.current.style.display = "none";
      setUserID(null);
    }
  };

  useEffect(() => {
    !logged
      ? navigate("/login")
      : !loggedUser.auth && navigate("/user-not-approved");
  });
  useEffect(() => {
    let getUser = async (url) => {
      let res = await fetch(url);
      if (!res.ok) {
        const message = `An error has occured: ${res.status}`;
        throw new Error(message);
      }
      let json = await res.json();
      if (json.length > 0) {
        setUsers(json);
      } else {
        setUsersFlag("No hay usuarios pendientes");
      }
    };
    getUser(api + "users/?pendientes=1");
  }, [users, api]);

  return (
    <>
      {logged && (
        <div className={styles.dashboard}>
          <Helmet>
            <title>Dashboard</title>
          </Helmet>
          <Header menu={refMenu} main={refMain} />
          <div ref={refMenu} className={styles.menuContainer}>
            <Menu />
          </div>
          {!loggedUser.user_type ? (
            <main
              ref={refMain}
              className={styles.mainAdmin}
              style={{ marginLeft: "300px", width: "calc(100% - 300px)" }}
            >
              <div className={styles.top}></div>
              <div className={styles.container}>
                <h1 className={styles.title}>Dashboard</h1>
                <p className={styles.subtitle}>Proveedor</p>
                <div className={styles.pendingCharts}>
                  <div className={styles.chartCard}>
                    <h3>Resultados generales</h3>
                    <Chart {...chartData} />
                  </div>
                  <div className={styles.users}>
                    <h3>Usuarios por aprobar</h3>
                    {users.length > 0 ? (
                      users.map((el, index) => (
                        <div key={index}>
                          <div className={styles.user}>
                            <div>
                              <p>{el.user_name}</p>
                            </div>
                            <div
                              onClick={() => {
                                handleModal(el.unique_id);
                              }}
                              style={{ cursor: "pointer" }}
                            >
                              <FontAwesomeIcon
                                className={styles.icon}
                                icon={faUserCheck}
                              />
                            </div>
                          </div>
                          <hr />
                        </div>
                      ))
                    ) : (
                      <p>{usersFlag}</p>
                    )}
                    <div ref={refModal} className={styles.actionModal}>
                      Desea aprobar este usuario?
                      <button type="submit" onClick={handleAction}>
                        Aceptar
                      </button>
                      <i
                        onClick={() => {
                          handleModal("none");
                        }}
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </i>
                    </div>
                  </div>
                </div>
                <div className={styles.pendingCards}>
                  <div className={styles.licitaciones}>
                    <div>
                      <h4>Tienes 12 licitaciones pendientes</h4>
                      <p>
                        Respondelas antes de que pase la fecha de vencimiento!
                      </p>
                    </div>
                    <div>
                      <Link to="/licitaciones" className={styles.ofertarButton}>
                        Ofertar ahora
                      </Link>
                    </div>
                  </div>
                  <div className={styles.dailyReport}>
                    <div>
                      <p className={styles.month}>Este mes</p>
                      <h3>87%</h3>
                      <p>de las ofertas fueron cotizadas</p>
                    </div>
                    <div>
                      <FontAwesomeIcon
                        className={styles.iconUp}
                        icon={faArrowUp}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </main>
          ) : (
            <main
              ref={refMain}
              className={styles.mainUser}
              style={{ marginLeft: "300px", width: "calc(100% - 300px)" }}
            >
              <div className={styles.top}></div>
              <div className={styles.container}>
                <h1 className={styles.title}>Dashboard</h1>
                <p className={styles.subtitle}>Cliente</p>
                <div className={styles.pendingCharts}>
                  <div className={styles.chartCard}>
                    <h3>Resultados generales</h3>
                    <Chart {...chartData} />
                  </div>

                  <div className={styles.pendingCardsUser}>
                    <div className={styles.ofertas}>
                      <h4>Tienes 3 ofertas pendientes</h4>
                      <p>
                        Respondelas antes de que pase la fecha de vencimiento de
                        tu licitación!
                      </p>
                      <Link to="/ofertas" className={styles.ofertarButton}>
                        Cotizar ahora
                      </Link>
                    </div>
                    <div className={styles.dailyReport}>
                      <div>
                        <p className={styles.month}>Este mes</p>
                        <h3>87%</h3>
                        <p>de las licitaciones fueron ofertadas</p>
                      </div>
                      <div>
                        <FontAwesomeIcon
                          className={styles.iconUp}
                          icon={faArrowUp}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          )}
        </div>
      )}
    </>
  );
}
