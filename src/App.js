import React, {useContext} from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";

import "./App.css";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import AdminPage from "./views/AdminPage/AdminPage";
import HomePage from "./views/HomePage/HomePage";
import LoginPage from "./views/LoginPage/LoginPage";
import CreatePage from "./views/CreatePage/CreatePage";
import OpenMenuPage from "./views/OpenMenuPage/OpenMenuPage";

const APP_CONFIG = {
  headerName: "下午茶",
};

const App = () => {

  return (
    <Router>
      <MainNavigation config={APP_CONFIG} />
      <main>
        <Switch>
          <Route exact path="/">
            <HomePage title={`Home`} />
          </Route>
          <Route exact path="/create">
            <CreatePage title={`Create`} />
          </Route>
          <Route exact path="/today-menu">
            <OpenMenuPage title={`Create`} />
          </Route>
          <Route exact path="/admin">
            <AdminPage title={`Admin`} />
          </Route>
          <Route exact path="/login">
            <LoginPage />
          </Route>
        </Switch>
      </main>
    </Router>
  );
};

export default App;
