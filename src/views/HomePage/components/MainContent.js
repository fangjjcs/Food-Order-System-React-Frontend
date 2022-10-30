import { useCallback, useState } from "react";
import { Box, Button } from "@mui/material"
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import FoodIcon from '@mui/icons-material/LunchDining';
import DrinkIcon from '@mui/icons-material/LocalCafe';

import './MainContent.css';
import MenuCard from "./Card/MenuCard";
import SearchField from "./selection/SearchField";
import RandomSelect from "./selection/RandomSelect";
import { useHttpClient } from "../../../shared/hook/http-hook";
import { getOpenedMenu } from "../../../store/menu-actions";

const MainContent = () => {

    const [isRandomDialogOpen, setIsRandomDialogOpen] = useState(false);
	const food = useSelector((state) => state.menu.filteredFood);
	const drink = useSelector((state) => state.menu.filteredDrink);

	const { isLoading, error, sendRequest } = useHttpClient();
    const dispatch = useDispatch();
    const history = useHistory();

	const token = useSelector((state) => state.ui.token);
    const header = new Headers()
	header.append("Content-Type", "application/json")
	header.append("Authorization", "Bearer " + token)

    const onCloseRandomDialog = () => {
        setIsRandomDialogOpen(false);
    }

    const checkTodayMenu = useCallback((opened, updatedAt) => {
        const today = Date.now();
        const date = new Date(today);
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2)
        const day = ("0" + date.getDate()).slice(-2)
        return opened && updatedAt == year+"-"+month+"-"+day;
    },[])

    const excludeTodayMenu = (candidateOptions) => {
        return candidateOptions.filter( c => !checkTodayMenu(c.opened, c.updatedAt))
    }

    const submitRandomChoice = (choice) => {
        submitMenuHandler(choice);
    }

    const submitMenuHandler = (randomChoiceMenu) => {
        const request = {
            id: parseInt(randomChoiceMenu.id),
            name: randomChoiceMenu.name,
            closeAt: '2022-10-29 23:00:00'
        }
        updateOpen(header, history, request);
    }

    const updateOpen = (header, history, request) => {
        console.log("[UPDATE OPEN MENU REQUEST]",request)
        const fetchData = async () => {
        try {
            const responseData = await sendRequest(
                process.env.REACT_APP_API_URL+"/update-open",
                "POST",
                JSON.stringify(request),
                header
            );
            console.log("[UPDATE OPEN MENU RESPONSE] ", responseData);
            if (responseData.status === 403) {
                history.replace("/login");
            } else if (responseData.status === 200) {
                dispatch(getOpenedMenu(token, history))
                history.push('/today-menu');
            }
        } catch (err) {
            // done in http-hook.js
        }
        };
        fetchData();
    };

    return(
        <>
        <Box className="content-box">
            <div className="control-box">
                <SearchField />
                <Button variant="contained" size="small" className="random-btn" onClick={()=>setIsRandomDialogOpen(true)}>不想思考</Button>
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
        <RandomSelect options={excludeTodayMenu([...food, ...drink])} onCloseRandomDialog={onCloseRandomDialog} submitRandomChoice={submitRandomChoice} isRandomDialogOpen={isRandomDialogOpen} size={"sm"}/>
        </>
    )
}

export default MainContent;