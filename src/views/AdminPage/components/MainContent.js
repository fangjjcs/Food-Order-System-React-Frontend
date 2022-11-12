import { Box } from "@mui/material"
import { useSelector } from "react-redux";
import FoodIcon from '@mui/icons-material/LunchDining';
import DrinkIcon from '@mui/icons-material/LocalCafe';

import './MainContent.css';
import MenuCard from "./Card/MenuCard";
import SearchField from "./selection/SearchField";

const MainContent = () => {

	const food = useSelector((state) => state.menu.filteredFood);
	const drink = useSelector((state) => state.menu.filteredDrink);

    return(
        <Box className="content-box">
            <div className="control-box">
                <SearchField />
            </div>
            <div className="card-box">
                <div className="panel food-panel">
                    {food.map((item,key)=><MenuCard key={item.name+key} item={item} icon={<FoodIcon style={{fill:"#f7c548"}}/>}/>)}
                </div>
                <div className="panel drink-panel">
                    {drink.map((item,key)=><MenuCard key={item.name+key} item={item} icon={<DrinkIcon style={{fill:"#437C90"}}/>}/>)}
                </div>
            </div>
        </Box>
    )
}

export default MainContent;