// React imports
import React, { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";

// Sass modules
import styles from "../sass/Signup.module.scss";
import "../sass/utilities/typography.module.scss";
import forms from "../sass/utilities/forms.module.scss";

// Font Awesome icons
import {
  faFish,
  faBurger,
  faPersonDigging,
  faWheatAwn,
  faTruck,
  faEyeSlash,
  faEye,
  faIndustry,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Signup() {
  // State
  const [form, setForm] = useState({});
  const [passwordEye, setPasswordEye] = useState(false);
  const [estados, setEstados] = useState([]);

  // Label Refs
  let refPasswordInput = useRef(),
    industryFish = useRef(),
    industryBurger = useRef(),
    industryMining = useRef(),
    industryWheat = useRef(),
    industryTruck = useRef(),
    industryDefault = useRef(),
    refError = useRef();

  let refArray = [
    industryFish,
    industryBurger,
    industryMining,
    industryWheat,
    industryTruck,
    industryDefault,
  ];

  // Router
  const navigate = useNavigate();

  // Event Handlers
  const handleIndustry = (ref) => {
    refArray.forEach((el) => {
      if (el === ref) {
        ref.current.style.display = "block";
      } else {
        el.current.style.display = "none";
      }
    });
  };

  const passwordVisible = () => {
    if (!passwordEye) {
      setPasswordEye(true);
      refPasswordInput.current.type = "text";
    } else {
      setPasswordEye(false);
      refPasswordInput.current.type = "password";
    }
  };
  const handleChange = (e, ref) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    if (e.target.name === "industria") {
      handleIndustry(ref);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let submitUser = async (url, params) => {
      let res = await fetch(url, params);
      let json = await res.json();
      if (json.success) {
        navigate("/user-not-approved");
      } else {
        refError.current.style.display = "block";
        refError.current.textContent = json.message;
        setTimeout(() => {
          refError.current.style.display = "none";
        }, 5000);
      }
    };
    submitUser("http://localhost/app/users/?insertar=1", {
      method: "POST",
      body: JSON.stringify(form),
    });
  };

  // useEffect
  useEffect(() => {
    let getUser = async (url) => {
      let res = await fetch(url);
      if (!res.ok) {
        const message = `An error has occured: ${res.status}`;
        throw new Error(message);
      }
      let json = await res.json();
      setEstados(json);
    };
    getUser("http://localhost/app/estados/");
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.signup}>
        <Helmet>
          <title>Registraste</title>
        </Helmet>
        <form action="" onSubmit={handleSubmit}>
          <h1>Bienvenido</h1>
          <p className={styles.credentials}>Ingresa tus datos para continuar</p>
          <div
            ref={refError}
            className={forms.errorMessage}
            style={{ display: "none" }}
          ></div>
          <div className={styles.flexForm}>
            <section>
              <div className={forms.fullInput}>
                <label htmlFor="name">Razon social</label>
                <input
                  type="text"
                  id="name"
                  name="user_name"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={forms.fullInput}>
                <label htmlFor="rif">Rif</label>
                <input
                  type="text"
                  id="rif"
                  name="rif"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={forms.fullInput}>
                <label htmlFor="address">Dirección</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.stateSelect}>
                <label className={styles.stateTitle} htmlFor="state">
                  Estado
                </label>
                <select
                  id="state"
                  name="estado"
                  onChange={handleChange}
                  defaultValue=""
                  required
                >
                  <option value="" disabled>
                    Selecciona un estado
                  </option>
                  {estados.map((estado) => (
                    <option key={estado.id} value={estado.id}>
                      {estado.state_name}
                    </option>
                  ))}
                  <option value="1">Distrito Capital</option>
                  <option value="2">Valencia</option>
                  <option value="3">Maracaibo</option>
                </select>
              </div>
              <div className={forms.scrollingSelectContainer}>
                <p className={styles.industryTitle}>Industria</p>
                <div className={forms.scrollingSelect}>
                  <div className={forms.card}>
                    <label htmlFor="industryFish">
                      <FontAwesomeIcon className={forms.icon} icon={faFish} />
                    </label>
                    <input
                      type="radio"
                      name="industria"
                      id="industryFish"
                      value="1"
                      onChange={(e) => {
                        handleChange(e, industryFish);
                      }}
                    />
                    <p ref={industryFish}>Pesca</p>
                  </div>
                  <div className={forms.card}>
                    <label htmlFor="industryMining">
                      <FontAwesomeIcon
                        className={forms.icon}
                        icon={faPersonDigging}
                      />
                    </label>
                    <input
                      type="radio"
                      name="industria"
                      id="industryMining"
                      value="2"
                      onChange={(e) => {
                        handleChange(e, industryMining);
                      }}
                    />
                    <p ref={industryMining}>Minería</p>
                  </div>

                  <div className={forms.card}>
                    <label htmlFor="industryBurger">
                      <FontAwesomeIcon className={forms.icon} icon={faBurger} />
                    </label>
                    <input
                      type="radio"
                      name="industria"
                      id="industryBurger"
                      value="4"
                      onChange={(e) => {
                        handleChange(e, industryBurger);
                      }}
                    />
                    <p ref={industryBurger}>Producción de alimentos</p>
                  </div>
                  <div className={forms.card}>
                    <label htmlFor="industryWheat">
                      <FontAwesomeIcon
                        className={forms.icon}
                        icon={faWheatAwn}
                      />
                    </label>
                    <input
                      type="radio"
                      name="industria"
                      id="industryWheat"
                      value="5"
                      onChange={(e) => {
                        handleChange(e, industryWheat);
                      }}
                    />
                    <p ref={industryWheat}>Agricultura</p>
                  </div>
                  <div className={forms.card}>
                    <label htmlFor="industryTruck">
                      <FontAwesomeIcon className={forms.icon} icon={faTruck} />
                    </label>
                    <input
                      type="radio"
                      name="industria"
                      id="industryTruck"
                      value="6"
                      onChange={(e) => {
                        handleChange(e, industryTruck);
                      }}
                    />
                    <p ref={industryTruck}>Carga pesada</p>
                  </div>
                  <div className={forms.card}>
                    <label htmlFor="industryDefault">
                      <FontAwesomeIcon
                        className={forms.icon}
                        icon={faIndustry}
                      />
                    </label>
                    <input
                      type="radio"
                      name="industria"
                      id="industryDefault"
                      value="3"
                      onChange={(e) => {
                        handleChange(e, industryDefault);
                      }}
                      defaultChecked
                    />
                    <p ref={industryDefault}>Otro</p>
                  </div>
                </div>
              </div>
            </section>
            <section>
              <div className={forms.fullInput}>
                <label htmlFor="contact">Nombre de Contacto</label>
                <input
                  type="text"
                  id="contact"
                  name="contact_name"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={forms.fullInput}>
                <label htmlFor="phone">Telefono</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={forms.fullInput}>
                <label htmlFor="email">Correo electrónico</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={forms.fullInput}>
                <label htmlFor="password">Contraseña</label>
                <input
                  ref={refPasswordInput}
                  className={styles.password}
                  type="password"
                  name="password"
                  id="password"
                  onChange={handleChange}
                  required
                />
                {!passwordEye ? (
                  <FontAwesomeIcon
                    className={forms.eyeIcon}
                    icon={faEyeSlash}
                    onClick={passwordVisible}
                  />
                ) : (
                  <FontAwesomeIcon
                    className={forms.eyeIcon}
                    icon={faEye}
                    onClick={passwordVisible}
                  />
                )}
              </div>
              <div className={forms.fullInput}>
                <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="password_confirm"
                  onChange={handleChange}
                  required
                />
              </div>
            </section>
          </div>
          <button type="submit">REGISTRARSE</button>
          <p>
            Ya tienes una cuenta? <Link to="/login">Ingresa aqui</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
