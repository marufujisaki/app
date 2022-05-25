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
import { faCaretDown, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const initialCategory = "Seleccione una categoría";

const getDate = () => {
  let today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth() + 1;
  let day = today.getDate();
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  const current_date = `${year}-${month}-${day}`;
  return current_date;
};

export default function NewLicitacion() {
  // Context
  const { logged, loggedUser } = useContext(AuthContext);
  const { api } = useContext(ServicesContext);

  // State
  // Arrays from API
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  // All the category shit
  const [categoryModal, setCategoryModal] = useState(false);
  const [categoryText, setCategoryText] = useState(initialCategory);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredList, setFilteredList] = useState([]);

  // Products
  const [details, setDetails] = useState({});
  const [products, setProducts] = useState([]);
  const [lic_key, setLic_key] = useState(null);

  // Licitacion
  const [form, setForm] = useState({
    user_id: loggedUser.unique_id,
    release_date: getDate(),
  });
  const [productForm, setProductForm] = useState(null);
  const flagArray = ["Enviando...", "Su licitación fue registrada con éxito"];
  const [sended, setSended] = useState(flagArray[0]);
  const [formEvent, setFormEvent] = useState(null);

  // Navigation
  const navigate = useNavigate();

  // Refs
  let refMenu = useRef(),
    refCategoryIcon = useRef(),
    refMain = useRef(),
    refCategories = useRef(),
    refModalButton = useRef(),
    refError = useRef(),
    refSuccessModal = useRef();

  // Modal - Categories
  const handleModal = () => {
    if (!categoryModal) {
      refCategories.current.style.display = "block";
      refModalButton.current.style.outline = "3px solid #2196f3";
      refModalButton.current.style.outlineOffset = "-3px";
      refCategoryIcon.current.style.color = "#2196f3";
      setCategoryModal(true);
    } else {
      refCategories.current.style.display = "none";
      refModalButton.current.style.outline = "none";
      refModalButton.current.style.outlineOffset = "0";
      refCategoryIcon.current.style.color = "#000";
      setCategoryModal(false);
    }
  };
  const handleCategory = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
    setCategoryText(e.target.id);
    refCategories.current.style.display = "none";
    refModalButton.current.style.outline = "none";
    refModalButton.current.style.outlineOffset = "0";
    refCategoryIcon.current.style.color = "#000";
    setCategoryModal(false);
  };

  const handleInput = (e) => {
    setDetails({
      ...details,
      [e.target.name]: e.target.value,
    });
  };

  const productSubmit = (e) => {
    e.preventDefault();
    setProducts([...products, details]);
    setCategoryText(initialCategory);
    e.target.reset();
  };

  const deleteProduct = (product) => {
    const aux = products.filter((el, index) => index !== product);
    setProducts([...aux]);
  };

  // Principal form

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  let sendProducts = async (url, params, e) => {
    try {
      let res = await fetch(url, params);
      let json = await res.json();
      setProductForm(null);
      setLic_key(null);
      if (json.success) {
        setSended(flagArray[1]);
        setTimeout(() => {
          refSuccessModal.current.style.display = "none";
        }, 4000);
      } else {
        throw new Error(json.message);
      }
    } catch (err) {
      refError.current.style.display = "block";
      refError.current.textContent = err.message;
      setTimeout(() => {
        refError.current.style.display = "none";
      }, 6000);
    }
  };
  const formSubmit = (e) => {
    e.preventDefault();
    setFormEvent(e);
    let sendLicitacion = async (url, params) => {
      let res = await fetch(url, params);
      let json = await res.json();
      if (json.success) {
        setLic_key(json.lic_key);
        refSuccessModal.current.style.display = "block";
      } else {
        throw new Error(json.message);
      }
    };
    try {
      if (products.length <= 0)
        throw new Error("Añada productos o servicios a su licitación");
      else
        sendLicitacion(api + "licitaciones/?insertar=1", {
          method: "POST",
          body: JSON.stringify(form),
        });
    } catch (err) {
      refError.current.style.display = "block";
      refError.current.textContent = err.message;
      setTimeout(() => {
        refError.current.style.display = "none";
      }, 6000);
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
      // eslint-disable-next-line eqeqeq
      (element) => element.cat_id == selectedCategory
    );
    setFilteredList([...aux]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  useEffect(() => {
    if (lic_key) {
      setProductForm({
        lic_key,
        products,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lic_key]);

  useEffect(() => {
    if (productForm) {
      sendProducts(api + "productos_servicios/?insertar=1", {
        method: "POST",
        body: JSON.stringify(productForm),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productForm]);

  useEffect(() => {
    const resetAll = (e) => {
      if (sended === flagArray[1]) {
        setProducts({});
        e.target.reset();
      }
    };
    resetAll(formEvent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sended]);

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
                <div
                  ref={refError}
                  className={forms.errorMessage}
                  style={{ display: "none" }}
                ></div>
                <div className={card.flexForm}>
                  <div className={card.flexChild}>
                    <form action="" onSubmit={productSubmit}>
                      <h3>Agregar productos o servicios</h3>
                      <div className={card.dropdown}>
                        <div
                          ref={refModalButton}
                          onClick={handleModal}
                          className={card.button}
                        >
                          <p>{categoryText}</p>
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
                            >
                              {el.name}
                              <ul
                                className={card.suboptions}
                                style={{
                                  top:
                                    index > 4
                                      ? index > 6
                                        ? "180px"
                                        : "150px"
                                      : "0",
                                }}
                              >
                                {filteredList.length > 0 &&
                                  filteredList.map((el, index) => (
                                    <label key={index} htmlFor={el.name}>
                                      <li>
                                        <input
                                          type="radio"
                                          name="subcategoria"
                                          value={el.id}
                                          id={el.name}
                                          onChange={handleCategory}
                                        />
                                        {el.name}
                                      </li>
                                    </label>
                                  ))}
                              </ul>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className={card.details}>
                        <div className={card.fullInput}>
                          <div className={forms.fullInput}>
                            <label htmlFor="details">
                              Detalles del Producto
                            </label>
                            <input
                              type="text"
                              name="details"
                              id="details"
                              onChange={handleInput}
                              required
                            />
                          </div>
                        </div>
                        <button type="submit">
                          <FontAwesomeIcon icon={faSquarePlus} />{" "}
                        </button>
                      </div>
                    </form>
                    <div>
                      {products.length > 0 ? (
                        products.map((el, index) => (
                          <div key={index}>
                            <hr />
                            <div className={card.productItem}>
                              <p>{el.details}</p>
                              <button onClick={() => deleteProduct(index)}>
                                <FontAwesomeIcon icon={faXmark} />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p>No hay productos agregados</p>
                      )}
                    </div>
                  </div>

                  <form action="" onSubmit={formSubmit}>
                    <div className={card.manualInputs}>
                      <div>
                        <label htmlFor="final_date">Fecha de cierre</label>
                        <input
                          type="date"
                          name="final_date"
                          id="final_date"
                          min={getDate()}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="comments">Comentarios</label>
                        <textarea
                          name="comments"
                          id="comments"
                          cols="55"
                          rows="7"
                          onChange={handleChange}
                          required
                        ></textarea>
                      </div>
                      <button type="submit">Enviar</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div ref={refSuccessModal} className={card.successModal}>
              {sended}
            </div>
          </main>
        </div>
      )}
    </>
  );
}
