import { createContext } from "react";
import { useLocalStorage } from "../components/hooks/useLocalStorage";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [logged, setLogged] = useLocalStorage("logged", null);
  const [loggedUser, setLoggedUser] = useLocalStorage("loggedUser", null);

  const handleAuth = (user) => {
    if (logged) {
      setLoggedUser(null);
      setLogged(null);
    } else {
      setLoggedUser(user);
      setLogged(true);
    }
  };

  const handleLogout = () => {
    if (logged) {
      setLoggedUser(null);
      setLogged(null);
    }
  };

  const data = { logged, loggedUser, handleAuth, handleLogout };
  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};

export { AuthProvider };
export default AuthContext;
