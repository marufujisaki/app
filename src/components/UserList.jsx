// React imports
import React, { useState, useRef, useEffect, useContext } from "react";
import Helmet from "react-helmet";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import ServicesContext from "../context/ServicesContext";

// layout components
import Header from "./layout/Header";
import Menu from "./layout/Menu";

// Sass modules
import styles from "../sass/Dashboard.module.scss";
import "../sass/utilities/typography.module.scss";
import table from "../sass/List.module.scss";

export default function UserList() {
  // Context
  const { logged, loggedUser } = useContext(AuthContext);
  const { api } = useContext(ServicesContext);

  // State
  const [users, setUsers] = useState([]);
  const [estados, setEstados] = useState([]);
  const [industrias, setIndustrias] = useState([]);

  const approved = ["No Aprobado", "Aprobado"];

  // Refs
  let refMenu = useRef(),
    refMain = useRef();

  // Navigation
  const navigate = useNavigate();

  const columns = [
    { name: "ID", selector: (row) => row.unique_id, width: "120px" },
    { name: "Razón Social", selector: (row) => row.user_name, width: "190px" },
    {
      name: "Industria",
      selector: (row) => industrias[row.ind_id - 1].ind_name,
      width: "150px",
    },
    { name: "Correo", selector: (row) => row.email, width: "190px" },
    { name: "Nombre de Contacto", selector: (row) => row.contact_name },
    { name: "Teléfono", selector: (row) => row.phone, width: "120px" },
    { name: "Dirección", selector: (row) => row.address },
    {
      name: "Estado",
      selector: (row) => estados[row.state_id - 1].state_name,
      width: "120px",
    },
    {
      name: "Autenticación",
      selector: (row) => approved[row.auth],
      width: "120px",
    },
  ];
  const paginationComponentOptions = {
    rowsPerPageText: "Filas por página",
    rangeSeparatorText: "de",
    selectAllRowsItem: true,
    selectAllRowsItemText: "Todos",
  };

  useEffect(() => {
    !logged
      ? navigate("/login")
      : !loggedUser.auth
      ? navigate("/user-not-approved")
      : loggedUser.user_type && navigate("/");
  });

  useEffect(() => {
    let getUser = async (url) => {
      let res = await fetch(url);
      if (!res.ok) {
        const message = `An error has occured: ${res.status}`;
        throw new Error(message);
      }
      let json = await res.json();
      setUsers(json);
    };
    getUser(api + "users/");
  }, [api]);

  useEffect(() => {
    let getState = async (url) => {
      let res = await fetch(url);
      if (!res.ok) {
        const message = `An error has occured: ${res.status}`;
        throw new Error(message);
      }
      let json = await res.json();
      setEstados(json);
    };
    getState(api + "estados/");
  }, [api]);

  useEffect(() => {
    let getIndustrias = async (url) => {
      let res = await fetch(url);
      if (!res.ok) {
        const message = `An error has occured: ${res.status}`;
        throw new Error(message);
      }
      let json = await res.json();
      setIndustrias(json);
    };
    getIndustrias(api + "industrias/");
  }, [api]);

  return (
    <>
      {logged && !loggedUser.user_type && (
        <div className={styles.bodyContainer}>
          <Helmet>
            <title>Usuarios</title>
          </Helmet>
          <Header menu={refMenu} main={refMain} />
          <div ref={refMenu} className={styles.menuContainer}>
            <Menu />
          </div>
          <main
            ref={refMain}
            className={styles.mainTable}
            style={{ marginLeft: "300px", width: "calc(100% - 300px)" }}
          >
            <div className={styles.top}></div>
            <div className={styles.container}>
              <h1 className={styles.title}>Lista de Usuarios</h1>
              <div>
                {users.length > 0 &&
                estados.length > 0 &&
                industrias.length > 0 ? (
                  <div>
                    <div className={table.tableCard}>
                      <DataTable
                        title="Usuarios"
                        columns={columns}
                        data={users}
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
        </div>
      )}
    </>
  );
}
