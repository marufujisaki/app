import { createContext, useState } from "react";
import { useLocalStorage } from "../components/hooks/useLocalStorage";

const AuthContext = createContext();

const initialAuth = null;

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(initialAuth);
  const [logged, setLogged] = useLocalStorage("logged", null);
  const [loggedUser, setLoggedUser] = useLocalStorage("loggedUser", null);

  const handleAuth = (user) => {
    if (auth) {
      setAuth(null);
      setLogged(null);
      setLoggedUser(user);
    } else {
      setAuth(true);
      setLogged(true);
      setLoggedUser(user);
    }
  };
  const data = { logged, loggedUser, handleAuth };
  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};

export { AuthProvider };
export default AuthContext;
