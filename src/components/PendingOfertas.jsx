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

// Font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function PendingOfertas() {
  // Context
  const { logged, loggedUser } = useContext(AuthContext);
  const { api } = useContext(ServicesContext);

  // State
  const [licitaciones, setLicitaciones] = useState([]);
  const [users, setUsers] = useState([]);
  const [ofertas, setOfertas] = useState([]);
  const [filteredOfertas, setFilteredOfertas] = useState([]);
  const [filterFlag, setFilterFlag] = useState("Cargando...");
  const estadoArray = ["Publicada", "Rechazada", "Cotizada"];

  const [modal, setModal] = useState(false);
  const [offerID, setOfferID] = useState(null);
  const [offerState, setOfferState] = useState(null);

  // Refs
  let refMenu = useRef(),
    refMain = useRef(),
    refModal = useRef();

  // Navigation
  const navigate = useNavigate();

  // Table info
  const columns = [
    { name: "ID", selector: (row) => row.id, width: "120px", sortable: true },
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
      selector: (row) => estadoArray[row.state],
      width: "160px",
      sortable: true,
    },
    {
      name: "Achivos",
      button: true,
      cell: (row) => (
        <a
          href={api + "ofertas/files/" + row.route}
          className={table.modalButtonDownload}
          target="_blank"
          rel="noreferrer noopener"
          download
        >
          Descargar
        </a>
      ),
    },
    {
      name: "Opciones",
      button: true,
      cell: (row) => (
        <div className="table.modalMiniContainer">
          <button
            className={table.modalApprove}
            onClick={() => {
              handleModal(row.id, 3);
            }}
          >
            Cotizar
          </button>
          <button
            className={table.modalDecline}
            onClick={() => {
              handleModal(row.id, 2);
            }}
          >
            Declinar
          </button>
        </div>
      ),
      width: "220px",
      allowOverflow: true,
    },
  ];

  const paginationComponentOptions = {
    rowsPerPageText: "Filas por página",
    rangeSeparatorText: "de",
    selectAllRowsItem: true,
    selectAllRowsItemText: "Todos",
  };

  // Event handlers
  const handleAction = (e) => {
    e.preventDefault();
    let approveUser = async (url, params) => {
      let res = await fetch(url, params);
      let json = await res.json();
      if (json.success) {
        handleModal("none");
      }
    };
    approveUser(api + "ofertas/?actualizar=1", {
      method: "POST",
      body: JSON.stringify({ id: offerID, state: offerState }),
    });
  };
  const handleModal = (offer, state) => {
    if (!modal) {
      setModal(true);
      refModal.current.style.display = "flex";
      setOfferID(offer);
      setOfferState(state);
    } else {
      setModal(false);
      refModal.current.style.display = "none";
      setOfferID(null);
      setOfferState(null);
    }
  };

  // Redirect
  useEffect(() => {
    !logged
      ? navigate("/login")
      : !loggedUser.auth
      ? navigate("/user-not-approved")
      : !loggedUser.user_type && navigate("/");
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
  }, [api, ofertas]);
  useEffect(() => {
    let getUser = async (url) => {
      let res = await fetch(url);
      let json = await res.json();
      setUsers(json);
    };
    getUser(api + "users/");
  }, [api]);

  // UI rerender
  useEffect(() => {
    if (ofertas.length > 0 && licitaciones.length > 0 && users.length > 0) {
      const aux = ofertas.filter((el) => el.state === "0");
      const aux2 = aux.filter(
        // eslint-disable-next-line eqeqeq
        (el) => el.lic_id == licitaciones[el.lic_id - 1].id
      );
      const aux3 = aux2.filter(
        (el) =>
          // eslint-disable-next-line eqeqeq
          loggedUser.unique_id ==
          users[licitaciones[el.lic_id - 1].user_id - 1].unique_id
      );
      aux.length > 0
        ? aux2.length > 0 && aux3.length > 0
          ? setFilteredOfertas([...aux])
          : setFilterFlag("Vacio")
        : setFilterFlag("Vacio");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ofertas, licitaciones, users]);

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
                    data={filteredOfertas}
                    pagination
                    paginationComponentOptions={paginationComponentOptions}
                  />
                </div>
                <div ref={refModal} className={styles.actionModal}>
                  Desea cotizar esta oferta?
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
            ) : (
              <div style={{ width: "100%" }}>
                <p>{filterFlag}</p>
              </div>
            )}
          </div>
        </div>
      </main>
      {/* </div> */}
    </>
  );
}
