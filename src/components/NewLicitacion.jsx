import React, { useState, useRef, useContext, useEffect } from "react";
import Helmet from "react-helmet";
import AuthContext from "../context/AuthContext";
import ServicesContext from "../context/ServicesContext";
import { useNavigate } from "react-router-dom";

// Layout
import Header from "./layout/Header";
import Menu from "./layout/Menu";
// Sass modules
import styles from "../sass/Dashboard.module.scss";
import "../sass/utilities/typography.module.scss";
import forms from "../sass/utilities/forms.module.scss";
import card from "../sass/newLicitacion.module.scss";

// Font Awesome icons
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// const initialCategory = "Seleccione una categoría";

export default function NewLicitacion() {
  // Context
  const { logged, loggedUser } = useContext(AuthContext);
  const { api } = useContext(ServicesContext);

  // State
  const [categoryModal, setCategoryModal] = useState(false);
  // const [categoryText, setCategoryText] = useState(initialCategory);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredList, setFilteredList] = useState([]);

  // Navigation
  const navigate = useNavigate();

  // Refs
  let refMenu,
    refCategoryIcon = useRef(),
    refMain = useRef(),
    refCategories = useRef(),
    refModalButton = useRef();

  // Modal - Categories
  const handleModal = () => {
    if (!categoryModal) {
      refCategories.current.style.display = "block";
      refModalButton.current.style.outline = "3px solid #2196f3";
      refModalButton.current.style.outlineOffset = "-3px";
      refCategoryIcon.current.style.color = "#2196f3";
      setCategoryModal(true);
      console.log(subcategories);
    } else {
      refCategories.current.style.display = "none";
      refModalButton.current.style.outline = "none";
      refModalButton.current.style.outlineOffset = "0";
      refCategoryIcon.current.style.color = "#000";
      setCategoryModal(false);
    }
  };

  useEffect(() => {
    !logged
      ? navigate("/login")
      : !loggedUser.auth
      ? navigate("/user-not-approved")
      : !loggedUser.user_type && navigate("/");
  });

  useEffect(() => {
    let getCategories = async (url) => {
      let res = await fetch(url);
      if (!res.ok) {
        const message = `An error has occured: ${res.status}`;
        throw new Error(message);
      }
      let json = await res.json();
      setCategories(json);
    };
    getCategories(api + "categorias/");
  }, [api]);

  useEffect(() => {
    let getSubcategories = async (url) => {
      let res = await fetch(url);
      if (!res.ok) {
        const message = `An error has occured: ${res.status}`;
        throw new Error(message);
      }
      let json = await res.json();
      setSubcategories(json);
    };
    getSubcategories(api + "subcategorias/");
  }, [api]);

  useEffect(() => {
    const aux = subcategories.filter(
      (element) => element.cat_id === selectedCategory
    );
    setFilteredList([...aux]);
  }, [selectedCategory, subcategories]);

  return (
    <>
      {logged && loggedUser.user_type && (
        <div>
          <Helmet>
            <title>Nueva Licitación</title>
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
            className={styles.mainUser}
            style={{ marginLeft: "300px", width: "calc(100% - 300px)" }}
          >
            <div className={styles.top}></div>
            <div className={styles.container}>
              <h1 className={styles.title}>Nueva Licitación</h1>
              <div className={card.formCard}>
                <form action="">
                  <div className={card.flexForm}>
                    <div className={card.flexChild}>
                      <h3>Agregar productos o servicios</h3>
                      <div className={card.dropdown}>
                        <div
                          ref={refModalButton}
                          onClick={handleModal}
                          className={card.button}
                        >
                          <p>Seleccione una categoría</p>
                          <div ref={refCategoryIcon}>
                            <FontAwesomeIcon icon={faCaretDown} />
                          </div>
                        </div>
                        <ul ref={refCategories} className={card.options}>
                          {categories.map((el, index) => (
                            <li
                              key={index}
                              onMouseEnter={() =>
                                setSelectedCategory(index + 1)
                              }
                              onMouseLeave={() => setSelectedCategory(null)}
                            >
                              {el.name}
                              <ul className={card.suboptions}>
                                {filteredList.length > 0 &&
                                  filteredList.map((el, index) => (
                                    <li key={index}>{el.name}</li>
                                  ))}
                                {/* <li>Servicio 1</li>
                                <li>
                                  <input
                                    type="radio"
                                    name="subcategoria"
                                    value="servicio3"
                                    id="servicio3"
                                  />
                                  <label htmlFor="servicio3">Servicio 3</label>
                                </li> */}
                              </ul>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className={card.details}>
                        <div className={forms.fullInput}>
                          <label htmlFor="details">Detalles del Producto</label>
                          <input type="text" name="details" id="details" />
                        </div>
                        <p>
                          <FontAwesomeIcon icon={faSquarePlus} />{" "}
                        </p>
                      </div>
                      <div>
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
                    <div>
                      <div>
                        <label htmlFor="final_date">Fecha de cierre</label>
                        <input type="date" name="final_date" id="final_date" />
                      </div>
                      <div>
                        <label htmlFor="comments">Comentarios</label>
                        <textarea
                          name="comments"
                          id="comments"
                          cols="50"
                          rows="7"
                        ></textarea>
                      </div>

                      <button type="submit">Enviar</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </main>
        </div>
      )}
    </>
  );
}
