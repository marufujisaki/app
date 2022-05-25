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
import card from "../sass/newLicitacion.module.scss";
import forms from "../sass/utilities/forms.module.scss";

export default function PendingLicitacions() {
  // Context
  const { logged, loggedUser } = useContext(AuthContext);
  const { api } = useContext(ServicesContext);

  // State

  // State DB
  const [licitaciones, setLicitaciones] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);

  // State Filters
  const [filteredLicitaciones, setfilteredLicitaciones] = useState([]);
  const [filterFlag, setfilterFlag] = useState("Cargando...");
  const [selectedLic, setSelectedLic] = useState(null);
  const [file, setFile] = useState();
  const [id, setId] = useState();

  // State helpers
  const estadoArray = ["Sin respuesta", "En espera de respuesta", "Cotizada"];

  // Refs
  let refMenu = useRef(),
    refMain = useRef(),
    refModal = useRef(),
    refError = useRef();

  // Navigation
  const navigate = useNavigate();

  // Table info
  const columns = [
    { name: "ID", selector: (row) => row.lic_key },
    { name: "Empresa", selector: (row) => users[row.user_id - 1].user_name },
    {
      name: "Fecha de Apertura",
      selector: (row) => row.release_date,
      sortable: true,
    },
    {
      name: "Fecha de Cierre",
      selector: (row) => row.final_date,
      sortable: true,
    },
    { name: "Comentarios", selector: (row) => row.comments },
    {
      name: "Estado",
      selector: (row) => estadoArray[row.state],
      width: "160px",
      sortable: true,
    },
    {
      name: "Opciones",
      cell: (row) => (
        <button
          className={table.modalButton}
          onClick={() => handleModal(row.id)}
        >
          Ofertar
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];
  const ExpandedComponent = ({ data }) => (
    <div className={table.expandedContainer}>
      <h3>Productos</h3>
      {products.map(
        (el, index) =>
          el.lic_id === data.id && (
            <div key={index}>
              <div>
                <p>
                  <span>SKU:</span> {el.sku}
                </p>
                <p>
                  <span>Detalles:</span> {el.detalles}
                </p>
                <p>
                  <span>Categoría: </span>
                  {categories[subcategories[el.subcat_id - 1].cat_id - 1].name}
                </p>
                <p>
                  <span>Subcategoria: </span>
                  {subcategories[el.subcat_id - 1].name}
                </p>
              </div>
              <hr />
            </div>
          )
      )}
    </div>
  );

  const paginationComponentOptions = {
    rowsPerPageText: "Filas por página",
    rangeSeparatorText: "de",
    selectAllRowsItem: true,
    selectAllRowsItemText: "Todos",
  };

  // Event handlers
  const handleModal = (lic) => {
    setSelectedLic(lic);
  };
  const handleFile = (e) => {
    if (e.target && e.target.files[0]) {
      setFile(e.target.files[0]);
      setId(selectedLic);
    }
  };
  let updateLic = async (url, params) => {
    let res = await fetch(url, params);
    let json = await res.json();
    if (json.success) {
      console.log("sisepudo");
      refModal.current.style.display = "none";
      setSelectedLic(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form Data
    let formData = new FormData();
    formData.append("id", id);
    formData.append("file", file);
    let xhr = new XMLHttpRequest();
    xhr.open("POST", api + "ofertas/insertar.php", true);
    xhr.onload = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          let data = xhr.response;
          if (data === "success") {
            updateLic(api + "licitaciones/?actualizar=1", {
              method: "POST",
              body: JSON.stringify({ id: id, state: 1 }),
            });
          } else {
            refError.current.style.display = "block";
            refError.current.textContent = data;
          }
        }
      }
    };
    xhr.send(formData);
    console.log(formData.get("lic_id"));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, licitaciones]);
  useEffect(() => {
    let getSubcategories = async (url) => {
      let res = await fetch(url);
      let json = await res.json();
      setSubcategories(json);
    };
    getSubcategories(api + "subcategorias/");
  }, [api]);
  useEffect(() => {
    let getCategories = async (url) => {
      let res = await fetch(url);
      let json = await res.json();
      setCategories(json);
    };
    getCategories(api + "categorias/");
  }, [api]);
  useEffect(() => {
    let getProducts = async (url) => {
      let res = await fetch(url);
      let json = await res.json();
      setProducts(json);
    };
    getProducts(api + "productos_servicios/");
  }, [api]);
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
    if (licitaciones.length > 0) {
      const aux = licitaciones.filter((el) => el.state === "0");
      aux.length > 0
        ? setfilteredLicitaciones([...aux])
        : setfilterFlag("No hay mas registros");
    }
  }, [licitaciones]);
  useEffect(() => {
    if (selectedLic) {
      refModal.current.style.display = "block";
    }
  });

  return (
    <>
      <Helmet>
        <title>Licitaciones pendientes</title>
      </Helmet>
      {/* HEADER */}
      <Header menu={refMenu} main={refMain} />
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
          <h1 className={styles.title}>Licitaciones pendientes</h1>
          <div>
            {licitaciones.length > 0 &&
            categories.length > 0 &&
            subcategories.length > 0 &&
            products.length > 0 &&
            users.length > 0 &&
            filteredLicitaciones.length > 0 ? (
              <div>
                <div className={table.licTable}>
                  <DataTable
                    columns={columns}
                    data={filteredLicitaciones}
                    pagination
                    paginationComponentOptions={paginationComponentOptions}
                    expandableRows
                    expandableRowsComponent={ExpandedComponent}
                  />
                </div>
              </div>
            ) : (
              <div style={{ width: "100%" }}>
                <p>{filterFlag}</p>
              </div>
            )}
          </div>
        </div>
        {filteredLicitaciones.length > 0 && users.length > 0 && selectedLic && (
          <div ref={refModal} className={card.modalForm}>
            <h2>Nueva Oferta</h2>
            <div>
              <p>
                <span>ID: </span>
                {filteredLicitaciones[selectedLic - 1].lic_key}
              </p>
              <p>
                <span>Empresa: </span>
                {
                  users[filteredLicitaciones[selectedLic - 1].user_id - 1]
                    .user_name
                }
              </p>
            </div>
            <form
              onSubmit={handleSubmit}
              method="POST"
              encType="multipart/form-data"
            >
              <div
                ref={refError}
                className={forms.errorMessage}
                style={{ display: "none" }}
              ></div>
              <label htmlFor="file">Subir archivo</label>
              <input
                type="file"
                name="file"
                id="file"
                onChange={handleFile}
                required
              />
              <button type="submit">Enviar</button>
            </form>
          </div>
        )}
      </main>
    </>
  );
}
