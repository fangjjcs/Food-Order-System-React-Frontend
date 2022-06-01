import { createContext, useState } from "react";

const AuthContext = createContext({
  token: "",
  isLogin: false,
  login: (token) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
 
  const initToken = localStorage.getItem("token")
  const initUser = localStorage.getItem("user")
  const [token, setToken] = useState(initToken);
  const [user, setUser] = useState(initUser);
  const [successText, setSuccessText] = useState("");
  const [errorText, setErrorText] = useState("");

  const saveUserHandler = (user) => {
    setUser(user);
    localStorage.setItem("user", user)
  };

  const setSuccessHandler = (text) => {
    setSuccessText(text)
  }

  const setErrorHandler = (text) => {
    setErrorText(text)
  }

  const loginHandler = (token) => {
    setToken(token);
    localStorage.setItem("token", token)
  };

  const logoutHandler = () => {
    setToken("");
    localStorage.removeItem("token")
    setUser("");
    localStorage.removeItem("user")
  };

  const contextValue = {
    user: user,
    token: token,
    isLogin: !!token,
    successText: successText,
    errorText: errorText,
    isSuccess: !!successText,
    isError: !!errorText,
    login: loginHandler,
    logout: logoutHandler,
    saveUser: saveUserHandler,
    setSuccess: setSuccessHandler,
    setError: setErrorHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
