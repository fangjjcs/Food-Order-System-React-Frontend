
import { useDispatch, useSelector } from 'react-redux';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Rating from '@mui/material/Rating';
import { useCallback, useEffect, useRef, useState } from 'react';

import './MenuCard.css';
import { getOpenedMenu, setDisableRandomChoose } from '../../../../store/menu-actions';
import { useHistory } from 'react-router-dom';
import { useHttpClient } from '../../../../shared/hook/http-hook';
import TimeSelect from '../selection/TimeSelect';

const MenuCard = ({item, icon}) => {

    const dispatch = useDispatch();
    const history = useHistory();
	const { isLoading, error, sendRequest } = useHttpClient();
    const isLogin = useSelector((state) => state.ui.isLogin);

    const token = useSelector((state) => state.ui.token);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dueTime, setDueTime] = useState(false);

    const header = new Headers()
	header.append("Content-Type", "application/json")
	header.append("Authorization", "Bearer " + token)

    const onClickCardHandler = (isTodayMenu) => {
        if(!isLogin) {
            history.replace("/login");
        }
        if(isTodayMenu) {
            history.push("today-menu")
        } else {
            setIsDialogOpen(true);
        }
    }

    const onCloseDialog = () => {
        setIsDialogOpen(false);
    }

    const submitMenuHandler = () => {
        const request = {
            id: parseInt(item.id),
            name: item.name,
            closeAt: dueTime
        }
        updateOpen(header, history, request);
        setIsDialogOpen(false);
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

    const round = (rating) => {
        return Math.round(rating*10) / 10;
    }

    const getToday = () => {
        const today = Date.now();
        const date = new Date(today);
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2)
        const day = ("0" + date.getDate()).slice(-2)
        return year+"-"+month+"-"+day
    }
    const checkTodayMenu = useCallback((opened, updatedAt) => {
        
        return opened && updatedAt == getToday();
    },[])

    const setDueTimeHandler = (time) => {
        const hour = time.getHours();
        const minutes = time.getMinutes();
        const seconds = time.getSeconds();
        setDueTime(getToday()+" "+hour+":"+minutes+":"+seconds)
    }


    //------------------------ POLLING NEW STATE ------------------------//

    const useIntervalAsync = (fn, iskeepAsking, ms) => {
        console.log("trigger hook")
        const timeout = useRef();
        const mountedRef = useRef(false);

        const run = useCallback(async () => {
            await fn();
            if (mountedRef.current) {
                timeout.current = window.setTimeout(run, ms);
            }
        }, [fn, ms]);

        useEffect(() => {
            mountedRef.current = true;
            if(iskeepAsking){
                console.log("start timer")
                run();
            }
            return () => {
                console.log("clear timer")
                mountedRef.current = false;
                window.clearTimeout(timeout.current);
            };
        }, [run, iskeepAsking]);

    };

    const [pollingStar, setPollingStar] = useState(round(item.rating));

    const request = {
        id: item.id,
        name: item.name
    }

    const updateState = useCallback(async () => {
        console.log("fetching...")
        const response = await fetch(process.env.REACT_APP_API_URL+"/get-menu", 
        {
            method:'POST',
            body: JSON.stringify(request),
            headers: header,
        });
        const data = await response.json();
        console.log("POOLED ",data.menu[0].name, data.menu[0].rating)
        setPollingStar(data.menu[0].rating);
    },[]);

    // para : repeat function, repeat condition, repeat interval time
    const a = useIntervalAsync(updateState, pollingStar>4 && pollingStar<5, 5000);
   
    //------------------------ POLLING NEW STATE ------------------------//

    return(
        <>
        <div className='card' onClick={()=>onClickCardHandler(checkTodayMenu(item.opened, item.updatedAt))}>
            <div className='card-info card-title'>
                {checkTodayMenu(item.opened, item.updatedAt)&&<div className='opened-menu'>今日</div>}
                <div>{item.name}</div>
                {icon}
            </div>
            <div className='card-info memo'>{item.memo}</div>
            <div className='card-info rating'>
                {pollingStar}
                <Rating name="half-rating-read" value={pollingStar} precision={0.5} size="small" readOnly />
            </div>
        </div>
        <Dialog onClose={onCloseDialog} open={isDialogOpen} size="xs" >
            <DialogTitle>選擇{item.name}為今日下午茶？</DialogTitle>
            <DialogContent>
                <TimeSelect className="time-selector" setDueTimeHandler={setDueTimeHandler}/>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" size="small" className="btn" onClick={submitMenuHandler}>是！</Button>
            </DialogActions>
        </Dialog>
        </>
    )
}

export default MenuCard;