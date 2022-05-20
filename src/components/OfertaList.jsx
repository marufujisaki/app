// React imports
import React, { useState, useRef } from "react";
import Helmet from "react-helmet";
import { DataGrid } from "@mui/x-data-grid";

// Sass modules
import styles from "../sass/Dashboard.module.scss";
import "../sass/utilities/typography.module.scss";
import table from "../sass/List.module.scss";

// Components
import Header from "./layout/Header";
import Menu from "./layout/Menu";

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Nombre de la Empresa", width: 170 },
  { field: "details", headerName: "Productos/Servicios", width: 200 },
  {
    field: "cant",
    headerName: "Cantidad",
    type: "number",
    width: 90,
  },
  {
    field: "file",
    headerName: "Archivo",
    width: 150,
  },
  // {
  //   field: "fullName",
  //   headerName: "Full name",
  //   description: "This column has a value getter and is not sortable.",
  //   sortable: false,
  //   width: 160,
  //   valueGetter: (params) =>
  //     `${params.row.name || ""} ${params.row.details || ""}`,
  // },
];

const rows = [
  {
    id: 1,
    details: "Presion/Válvulas",
    name: "Bethacorp 07 C.A",
    cant: 3,
    file: "OFERTA MAYO.pdf",
  },
  {
    id: 2,
    details: "Temperatura/Medidor",
    name: "Bethacorp 07 C.A",
    cant: 4,
    file: "OFERTA MAYO.pdf",
  },
  {
    id: 3,
    details: "Temperatura/Medidor",
    name: "Bethacorp 07 C.A",
    cant: 22,
    file: "OFERTA MAYO.pdf",
  },
  {
    id: 4,
    details: "Pesaje/Servicio",
    name: "Bethacorp 07 C.A",
    cant: 16,
    file: "OFERTA MAYO.pdf",
  },
  {
    id: 5,
    details: "Climatización/Servicio",
    name: "Bethacorp 07 C.A",
    cant: null,
    file: "OFERTA MAYO.pdf",
  },
  {
    id: 6,
    details: "Pesaje/Servicio",
    name: "Bethacorp 07 C.A",
    cant: 15,
    file: "OFERTA MAYO.pdf",
  },
  {
    id: 7,
    details: "Mantenimiento/Servicio",
    name: "Tommy Tipi",
    cant: 1,
    file: "OFERTA MAYO.pdf",
  },
  {
    id: 8,
    details: "Mantenimiento/Servicio",
    name: "Example C.A",
    cant: 6,
    file: "OFERTA MAYO.pdf",
  },
  {
    id: 9,
    details: "Mantenimiento/Servicio",
    name: "Lamigal",
    cant: 7,
    file: "OFERTA MAYO.pdf",
  },
];

export default function OfertaList() {
  let refMenu = useRef(),
    refMain = useRef();

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
      <main ref={refMain}>
        <div className={table.tableCard}>
          <button>Aprobar Oferta</button>
          <button>Eliminar Oferta</button>
          <div style={{ height: 400 }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              checkboxSelection
            />
          </div>
        </div>
      </main>
      {/* </div> */}
    </>
  );
}
