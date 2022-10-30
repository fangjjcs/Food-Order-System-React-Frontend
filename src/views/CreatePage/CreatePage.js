import { useEffect } from "react";
import { useHistory } from "react-router-dom";

import "./CreatePage.css";
import MainContent from "./components/MainContent";
import { useSelector } from "react-redux";

const CreatePage = (props) => {
  
  const history = useHistory();
  const isLogin = useSelector((state) => state.ui.isLogin);

  useEffect(() => {
    if(!isLogin) {
        history.replace("/login")
    }
  }, [])

  return (
    <div className="common-page">
      <header className="create-header">
        <MainContent></MainContent>
      </header>
    </div>
  );
};

export default CreatePage;