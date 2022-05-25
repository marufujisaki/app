// React imports
import React, { useState, useRef, useContext, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import ServicesContext from "../context/ServicesContext";

// Sass modules
import styles from "../sass/Login.module.scss";
import "../sass/utilities/typography.module.scss";
import forms from "../sass/utilities/forms.module.scss";

// Font Awesome icons
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Login() {
  // Context
  const { logged, loggedUser, handleAuth } = useContext(AuthContext);
  const { api } = useContext(ServicesContext);

  // State
  const [passwordEye, setPasswordEye] = useState(false);
  const [form, setForm] = useState({});

  // Refs
  let refPasswordInput = useRef(),
    refError = useRef();

  // Router
  const navigate = useNavigate();

  // Event handlers
  const passwordVisible = (e) => {
    if (!passwordEye) {
      setPasswordEye(true);
      refPasswordInput.current.type = "text";
    } else {
      setPasswordEye(false);
      refPasswordInput.current.type = "password";
    }
  };
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    let validUser = async (url, params) => {
      let res = await fetch(url, params);
      let json = await res.json();
      if (json.success) {
        const user = JSON.parse(
          `{"unique_id":${json.unique_id},"user_name":"${json.user_name}","contact_name":"${json.contact_name}","auth":${json.auth},"user_type":${json.user_type}}`
        );
        if (json.auth === "1") {
          handleAuth(user);
          navigate("/");
        } else {
          navigate("/user-not-approved");
        }
      } else {
        refError.current.style.display = "block";
        refError.current.textContent = json.message;
        setTimeout(() => {
          refError.current.style.display = "none";
        }, 6000);
      }
    };
    validUser(api + "users/?login=1", {
      method: "POST",
      body: JSON.stringify(form),
    });
  };

  useEffect(() => {
    logged &&
      (loggedUser.auth ? navigate("/") : navigate("/user-not-approved"));
  });

  return (
    <>
      {!logged && (
        <div className={styles.container}>
          <div className={styles.login}>
            <Helmet>
              <title>Login</title>
            </Helmet>
            <form action="" onSubmit={handleSubmit}>
              <h1>Bienvenido</h1>
              <p className={styles.credentials}>
                Ingresa tus credenciales para continuar
              </p>
              <div
                ref={refError}
                className={forms.errorMessage}
                style={{ display: "none" }}
              ></div>
              <div className={forms.fullInput}>
                <label htmlFor="email">Correo electrónico</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  onChange={handleChange}
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
              <button type="submit">INICIAR SESION</button>
              <p>
                Aun no tienes una cuenta?{" "}
                <Link to="/signup">Registrate aqui</Link>
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
