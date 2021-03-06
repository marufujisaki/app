// React imports
import React, { useState, useRef, useEffect, useContext } from "react";
import Helmet from "react-helmet";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import ServicesContext from "../context/ServicesContext";

// Layout
import Header from "./layout/Header";
import Menu from "./layout/Menu";

// Sass modules
import styles from "../sass/Dashboard.module.scss";
import "../sass/utilities/typography.module.scss";
import table from "../sass/List.module.scss";

export default function OfertaList() {
  // Context
  const { logged, loggedUser } = useContext(AuthContext);
  const { api } = useContext(ServicesContext);

  // State
  const [licitaciones, setLicitaciones] = useState([]);
  const [users, setUsers] = useState([]);
  const [ofertas, setOfertas] = useState([]);
  const estadoArray = ["Publicada", "Rechazada", "Cotizada"];

  // Refs
  let refMenu = useRef(),
    refMain = useRef();

  // Navigation
  const navigate = useNavigate();

  // Table info
  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true },
    {
      name: "Empresa",
      selector: (row) =>
        users[licitaciones[row.lic_id - 1].user_id - 1].user_name,
    },
    {
      name: "Licitación",
      selector: (row) => licitaciones[row.id].lic_key,
    },
    {
      name: "Estado",
      selector: (row) => estadoArray[row.state - 1],
      width: "160px",
      sortable: true,
    },
    {
      name: "Achivos",
      button: true,
      cell: (row) => (
        <a
          href={api + "ofertas/files/" + row.route}
          className={table.modalButton}
          target="_blank"
          rel="noreferrer noopener"
          download
        >
          Descargar
        </a>
      ),
    },
  ];

  const paginationComponentOptions = {
    rowsPerPageText: "Filas por página",
    rangeSeparatorText: "de",
    selectAllRowsItem: true,
    selectAllRowsItemText: "Todos",
  };

  // Redirect
  useEffect(() => {
    !logged
      ? navigate("/login")
      : !loggedUser.auth
      ? navigate("/user-not-approved")
      : loggedUser.user_type && navigate("/");
  });

  // GET requests
  useEffect(() => {
    let getList = async (url) => {
      try {
        let res = await fetch(url);
        let json = await res.json();
        setLicitaciones(json);
      } catch (error) {}
    };
    getList(api + "licitaciones/");
  }, [api]);
  useEffect(() => {
    let getOfertas = async (url) => {
      let res = await fetch(url);
      let json = await res.json();
      setOfertas(json);
    };
    getOfertas(api + "ofertas/");
  }, [api]);
  useEffect(() => {
    let getUser = async (url) => {
      let res = await fetch(url);
      let json = await res.json();
      setUsers(json);
    };
    getUser(api + "users/");
  }, [api]);

  return (
    <>
      <Helmet>
        <title>Ofertas</title>
      </Helmet>
      {/* HEADER */}
      <Header menu={refMenu} main={refMain} />
      {/* <div className={styles.layout}> */}
      {/* SIDE MENU */}
      <div ref={refMenu} className={styles.menuContainer}>
        <Menu />
      </div>
      {/* MAIN SECTION */}
      <main
        ref={refMain}
        className={styles.mainTable}
        style={{ marginLeft: "300px", width: "calc(100% - 300px)" }}
      >
        <div className={styles.top}></div>
        <div className={styles.container}>
          <h1 className={styles.title}>Todas las Ofertas</h1>
          <div>
            {licitaciones.length > 0 &&
            ofertas.length > 0 &&
            users.length > 0 ? (
              <div>
                <div className={table.licTable}>
                  <DataTable
                    columns={columns}
                    data={ofertas}
                    pagination
                    paginationComponentOptions={paginationComponentOptions}
                  />
                </div>
              </div>
            ) : (
              <div style={{ width: "100%" }}>
                <p>Cargando...</p>
              </div>
            )}
          </div>
        </div>
      </main>
      {/* </div> */}
    </>
  );
}
