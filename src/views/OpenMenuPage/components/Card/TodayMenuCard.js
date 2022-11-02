
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Rating } from '@mui/material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StarIcon from '@mui/icons-material/StarBorder';

import './TodayMenuCard.css';
import { updateMenuRating } from '../../../../store/menu-actions';
import { useHistory } from 'react-router-dom';
import { useHttpClient } from '../../../../shared/hook/http-hook';
import OrderDialogContent from '../DialogContent/OrderDialogContent';
import ResultDialogContent from '../DialogContent/ResultDialogContent';
import AgTable from '../table/AgTable';

const TodayMenuCard = ({item}) => {

    const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
    const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);
    const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);
    const [resultData, setResultData] = useState([]);

    const [ratingValue, setRatingValue] = useState(0);

    const dispatch = useDispatch();
    const history = useHistory();
	const { isLoading, error, sendRequest } = useHttpClient();

    const userName = useSelector((state) => state.ui.userName);
    const token = useSelector((state) => state.ui.token);
	const header = new Headers()
	header.append("Content-Type", "application/json")
	header.append("Authorization", "Bearer " + token)

    const onOpenOrderDialog = () => {
        setIsOrderDialogOpen(true);
    }
    const onCloseOrderDialog = () => {
        setIsOrderDialogOpen(false);
    }
    const onOpenRatingDialog = () => {
        setIsRatingDialogOpen(true);
    }
    const onCloseRatingDialog = () => {
        setIsRatingDialogOpen(false);
    }
    const onClickRateStar = (event, newValue) => {
        setRatingValue(newValue);
    }

    const submitRatingHandler = () => {
        const request = {
            id: item.id,
            score: ratingValue
        }
        updateMenuRating(request);
    }

    const updateMenuRating = (request) => {
		const fetchData = async () => {
		try {
			const responseData = await sendRequest(
			process.env.REACT_APP_API_URL+"/update-rating",
			"POST",
			JSON.stringify(request),
			header
			);
			console.log("[UPDATE RATING RESPONSE]",responseData);
			if (responseData.status === 403) {
				history.replace("/login")
			} 
            setIsRatingDialogOpen(false);
            window.location.reload();
		} catch (err) {
			// done in http-hook.js
		}
		};
		fetchData();
	};

    const onOpenResultDialog = () => {
        setIsResultDialogOpen(true);
        const request = {
            id: item.id
        }
        fetchResult(request);
    }

    const onCloseResultDialog = () => {
        setIsResultDialogOpen(false);
    }

    const fetchResult = (request) => {
        const fetchData = async () => {
        try {
            const responseData = await sendRequest(
                process.env.REACT_APP_API_URL+"/get-order",
                "POST",
                JSON.stringify(request),
                header
            );
    
            console.log(responseData);
            if (responseData.status !== 200) {
            //   authContext.setSuccess("有地方出錯了!");
            history.replace("/");
            } else {
                setResultData(responseData.orders);
            }
        } catch (err) {
            // done in http-hook.js
        }
        };
        fetchData();
    };
    return(
        <>
        <div className='card'>
            <img className='image' src={item.fileString}></img>
            <div className='linear-canvas'></div>
            <div className='rating-info'>
                <div className='star-btn'>
                    <StarIcon style={{fill:"#fff"}} onClick={onOpenRatingDialog}/>
                </div>
            </div>
            <div className='menu-info'>
                <div className='card-info card-title'>
                    {item.name}
                </div>
                <div className='card-info order'>
                    <div className='order-info'>$ {item.orderTotalPrice}</div>
                    <div className='order-info count'>{item.orderCount} 份餐點</div>
                </div>
            </div>
            <div className='button-box'>
                <Button className='btn' size="small" onClick={onOpenResultDialog}>總結</Button>
                <Button className='btn order-btn' size="small" onClick={onOpenOrderDialog}>點餐</Button>
            </div>
        </div>
        <Dialog onClose={onCloseOrderDialog} open={isOrderDialogOpen} maxWidth="xl" fullWidth={true}>
            <DialogTitle>嗨 {userName}, 請點餐</DialogTitle>
            <OrderDialogContent user={userName} item={item} onCloseDialog={onCloseOrderDialog}/>
        </Dialog>
        <Dialog onClose={onCloseRatingDialog} open={isRatingDialogOpen} maxWidth="sm">
            <DialogTitle>為{item.name}評個分</DialogTitle>
            <DialogContent>
                <Rating name="simple-controlled" value={ratingValue} onChange={onClickRateStar} precision={0.5}/>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" size="small" className="btn" onClick={submitRatingHandler}>送出！</Button>
            </DialogActions>
        </Dialog>
        <Dialog onClose={onCloseResultDialog} open={isResultDialogOpen} maxWidth="xl" fullWidth={true} scroll="paper">
            <DialogTitle>今日{item.name}點餐結果，總價 $ {item.orderTotalPrice} ({item.orderCount} 份餐點)</DialogTitle>
            {/* <DialogContent dividers={true}> */}
                {!isLoading && <AgTable resultData={resultData}/>}
            {/* </DialogContent> */}
        </Dialog>
        </>
    )
}

export default TodayMenuCard;