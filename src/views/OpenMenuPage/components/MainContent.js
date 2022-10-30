import { Box } from "@mui/material"
import { useSelector } from "react-redux";
import TodayMenuCard from "./Card/TodayMenuCard";

import './MainContent.css';
import CashSvg from '../../../shared/style/image/cash.png';

const MainContent = () => {

    const todayMenu = useSelector((state) => state.menu.todayMenu);
    console.log(todayMenu);

    return(
        <Box className="content-box">
            <div className="control-box">
            </div>
            <div className="card-box">
                {todayMenu.map((item, key) => <TodayMenuCard key={item.name+key} item={item}/>)}
            </div>
            <img className="cover-image" src={CashSvg}></img>
        </Box>
    )
}
export default MainContent;