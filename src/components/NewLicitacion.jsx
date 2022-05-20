import React, { useState, useRef } from "react";
import Helmet from "react-helmet";

import Header from "./layout/Header";
import Menu from "./layout/Menu";
// Sass modules
import styles from "../sass/Dashboard.module.scss";
import "../sass/utilities/typography.module.scss";
import forms from "../sass/utilities/forms.module.scss";
import table from "../sass/List.module.scss";

// Font Awesome icons
import { faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function NewLicitacion() {
  let refMenu = useRef(),
    refMain = useRef();
  return (
    <>
      <Helmet>
        <title>Nueva Licitación</title>
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
          <form action="">
            <div className={forms.flexForm}>
              <div>
                <div className={forms.fullInput}>
                  <label htmlFor="category">Categoria</label>
                  <input type="text" name="category" id="category" />
                </div>
                <div>
                  <p>
                    <FontAwesomeIcon icon={faSquarePlus} />{" "}
                    <input
                      type="text"
                      placeholder="Agregar un nuevo producto o servicio"
                    />
                  </p>
                  <hr />
                  <p>
                    Medidor de flujo Endress+Hauser <span>2</span>
                  </p>
                  <hr />
                  <p>
                    Medidor de presión Endress+Hauser <span>1</span>
                  </p>
                </div>
              </div>
              <div className={forms.flexDivChild}>
                <label htmlFor="final_date">Fecha de cierre</label>
                <input type="date" name="final_date" id="final_date" />
                <label htmlFor="comments">Comentarios</label>
                <textarea
                  name="comments"
                  id="comments"
                  cols="50"
                  rows="7"
                ></textarea>
              </div>
              <div className={forms.flexDivChild}>
                <button type="submit">Enviar</button>
              </div>
            </div>
          </form>
        </div>
      </main>
      {/* </div> */}
    </>
  );
}
