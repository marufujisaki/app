import { createContext } from "react";

const ServicesContext = createContext();

const ServicesProvider = ({ children }) => {
  const api = "http://172.16.0.55/app/";
  const data = { api };
  return (
    <ServicesContext.Provider value={data}>{children}</ServicesContext.Provider>
  );
};

export { ServicesProvider };
export default ServicesContext;
