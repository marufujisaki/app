import { createContext } from "react";
import { useLocalStorage } from "../components/hooks/useLocalStorage";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [logged, setLogged] = useLocalStorage("logged", null);
  const [loggedUser, setLoggedUser] = useLocalStorage("loggedUser", null);

  const handleAuth = (user) => {
    if (logged) {
      setLogged(null);
      setLoggedUser(null);
    } else {
      setLogged(true);
      setLoggedUser(user);
    }
  };

  const data = { logged, loggedUser, handleAuth };
  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};

export { AuthProvider };
export default AuthContext;
