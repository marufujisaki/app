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

export default function MyLicitaciones() {
  // Context
  const { logged, loggedUser } = useContext(AuthContext);
  const { api } = useContext(ServicesContext);

  // State
  const [licitaciones, setLicitaciones] = useState({});
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);

  const estadoArray = ["Sin respuesta", "En espera de respuesta", "Cotizada"];

  // Refs
  let refMenu = useRef(),
    refMain = useRef();

  // Navigation
  const navigate = useNavigate();

  // Table info
  const columns = [
    { name: "ID", selector: (row) => row.lic_key },
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
                  {/* {el.subcat_id - 1} */}
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

  useEffect(() => {
    !logged
      ? navigate("/login")
      : !loggedUser.auth
      ? navigate("/user-not-approved")
      : !loggedUser.user_type && navigate("/");
  });

  useEffect(() => {
    let getLicitaciones = async (url, params) => {
      let res = await fetch(url, params);
      let json = await res.json();
      setLicitaciones(json);
    };
    getLicitaciones(api + "licitaciones/?consultar=1", {
      method: "POST",
      body: JSON.stringify({ user_id: loggedUser.unique_id }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api]);

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

  return (
    <>
      {logged && loggedUser.user_type && (
        <div className={styles.bodyContainer}>
          <Helmet>
            <title>Mis Licitaciones</title>
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
              <h1 className={styles.title}>Mis licitaciones</h1>
              <div>
                {licitaciones.length > 0 &&
                categories.length > 0 &&
                subcategories.length > 0 &&
                products.length > 0 ? (
                  <div>
                    <div className={table.licTable}>
                      <DataTable
                        columns={columns}
                        data={licitaciones}
                        pagination
                        paginationComponentOptions={paginationComponentOptions}
                        expandableRows
                        expandableRowsComponent={ExpandedComponent}
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
