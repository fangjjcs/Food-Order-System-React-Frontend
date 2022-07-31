import React, {useContext} from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";

import "./App.css";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import AdminPage from "./views/AdminPage/AdminPage";

import OrderPage from "./views/OrderPage/OrderPage";
import HomePage from "./views/HomePage/HomePage";
import LoginPage from "./views/LoginPage/LoginPage";
import CreatePage from "./views/CreatePage/CreatePage";
import ResultPage from "./views/ResultPage/ResultPage";
import EditPage from "./views/EditPage/EditPage";

const APP_CONFIG = {
  headerName: "Afternoon Tea Time",
};

const App = () => {

  return (
    <Router>
      <MainNavigation config={APP_CONFIG} />
      <main>
        <Switch>
          {/* <Route exact path="/" render={(props) => <Home {...props} title={`hello`}/>} /> */}
          <Route exact path="/">
            <HomePage title={`Home`} />
          </Route>
          <Route exact path="/edit">
            <EditPage title={`Edit`} />
          </Route>
          <Route exact path="/order/:id">
            <OrderPage title={`Order`} />
          </Route>
          <Route exact path="/create">
            <CreatePage title={`Create`} />
          </Route>
          <Route exact path="/result">
            <ResultPage title={`Result`} />
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
