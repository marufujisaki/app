// React imports
import React, { useState, useRef, useEffect } from "react";
import Helmet from "react-helmet";
import DataTable from "react-data-table-component";

import Header from "./layout/Header";
import Menu from "./layout/Menu";

// Sass modules
import styles from "../sass/Dashboard.module.scss";
import "../sass/utilities/typography.module.scss";
import table from "../sass/List.module.scss";

// const columns = [
//   { field: "id", headerName: "ID", width: 70 },
//   { field: "state_name", headerName: "Nombre de la Empresa", width: 170 },
//   {
//     field: "actions",
//     headerName: "Productos/Servicios",
//     width: 400,
//   },
//   {
//     field: "cant",
//     headerName: "Cantidad",
//     type: "number",
//     width: 90,
//   },
//   {
//     field: "date",
//     headerName: "Fecha limite",
//     type: "date",
//     width: 130,
//   },
//   // {
//   //   field: "fullName",
//   //   headerName: "Full name",
//   //   description: "This column has a value getter and is not sortable.",
//   //   sortable: false,
//   //   width: 160,
//   //   valueGetter: (params) =>
//   //     `${params.row.name || ""} ${params.row.details || ""}`,
//   // },
// ];

export default function LicitacionList() {
  // State
  const [users, setUsers] = useState([]);
  // Refs
  let refMenu = useRef(),
    refMain = useRef();

  const handleAction = () => {
    console.log();
  };

  const columns = [
    { name: "ID", selector: (row) => row.id },
    { name: "Estado", selector: (row) => row.state_name },
    {
      name: "Actions",
      cell: () => (
        <button raised primary onClick={handleAction}>
          Action
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];
  const paginationComponentOptions = {
    rowsPerPageText: "Filas por página",
    rangeSeparatorText: "de",
    selectAllRowsItem: true,
    selectAllRowsItemText: "Todos",
  };

  useEffect(() => {
    let getUser = async (url) => {
      let res = await fetch(url);
      if (!res.ok) {
        const message = `An error has occured: ${res.status}`;
        throw new Error(message);
      }
      let json = await res.json();
      // for (let i = 0; i < json.length; i++) {
      //   const el = json[i];
      //   el.actions = () => (
      //     <button onClick={handleAction}>Accion para el elemento{el.id}</button>
      //   );
      //   setUsers([json]);
      // }
      setUsers(json);
    };
    getUser("http://localhost/app/estados/");
  }, []);

  return (
    <>
      <Helmet>
        <title>Licitaciones</title>
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
        <div className={table.tableCard}>
          <button>Crear Oferta</button>
          <button>Eliminar Licitación</button>
          <div>
            <DataTable
              title="Licitaciones"
              columns={columns}
              data={users}
              pagination
              paginationComponentOptions={paginationComponentOptions}
            />
          </div>
        </div>
      </main>
      {/* </div> */}
    </>
  );
}
