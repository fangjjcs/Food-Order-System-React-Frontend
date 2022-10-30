import { useEffect } from "react";
import { useHistory } from "react-router-dom";

import "./OpenMenuPage.css";
import MainContent from "./components/MainContent";
import { useDispatch, useSelector } from "react-redux";
import { getOpenedMenu } from "../../store/menu-actions";

const OpenMenuPage = (props) => {
  
    const history = useHistory();
    const dispatch = useDispatch();
    const isLogin = useSelector((state) => state.ui.isLogin);
	const token = useSelector((state) => state.ui.token);

    useEffect(() => {
        if(!isLogin) {
            history.replace("/login")
        } else {
            dispatch(getOpenedMenu(token, history));
        }
    }, [])

    return (
        <div className="common-page">
            <header className="open-menu-header">
                <MainContent></MainContent>
            </header>
        </div>
    );
};

export default OpenMenuPage;