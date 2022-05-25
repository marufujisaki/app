// React imports
import React, { useContext, useEffect } from "react";
import { Helmet } from "react-helmet";
import AuthContext from "../context/AuthContext";

// Sass imports
import "../sass/utilities/typography.module.scss";
import styles from "../sass/NotApproved.module.scss";

export default function UserNotApproved() {
  // Context
  const { handleLogout } = useContext(AuthContext);

  useEffect(() => {
    handleLogout();
  });

  return (
    <div>
      <div className={styles.container}>
        <Helmet>
          <title>Usuario no aprobado</title>
        </Helmet>
        <div>
          <div className={styles.flexContainer}>
            <div>
              <div>
                <h1>Estamos trabajando para ti...</h1>
                <p>
                  Parece que este usuario aún no esta aprobado,
                  <span>
                    {" "}
                    después de registrarte debes esperar 2 días hábiles
                  </span>{" "}
                  para confirmar su información, lo que se notificará a través
                  de correo electrónico.
                  <br />
                  <br /> Si la situación persiste, comunicarse a través del
                  correo electrónico <span>sistemas@bethacorp07.com</span>
                </p>
              </div>
            </div>
            <div>
              <img
                src="https://bethacorp07.com/clients/images/workers.jpg"
                alt="Usuario no aprobado"
              />
            </div>
          </div>
          <div>
            <a href="https://www.bethacorp07.com">
              Volver a la pagina principal
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
