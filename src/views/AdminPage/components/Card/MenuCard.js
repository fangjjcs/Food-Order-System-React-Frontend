
import { useSelector } from 'react-redux';
import { Button} from '@mui/material';
import { useCallback, useState } from 'react';

import './MenuCard.css';
import { useHistory } from 'react-router-dom';
import { useHttpClient } from '../../../../shared/hook/http-hook';
import EditDialog from '../Dialog/EditDialog';

const MenuCard = ({item, icon}) => {

    const history = useHistory();
	const { isLoading, error, sendRequest } = useHttpClient();

    const token = useSelector((state) => state.ui.token);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const header = new Headers()
	header.append("Content-Type", "application/json")
	header.append("Authorization", "Bearer " + token)

    const editMenuHandler = (item) => {
        setIsEditDialogOpen(true);
    }

    const onEditDialogClose = () => {
        setIsEditDialogOpen(false);
    }

    const checkTodayMenu = useCallback((opened, updatedAt) => {
        const today = Date.now();
        const date = new Date(today);
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2)
        const day = ("0" + date.getDate()).slice(-2)
        return opened && updatedAt == year+"-"+month+"-"+day;
    },[])

    const deleteTodayMenu = () => {
		const request = {
			id: parseInt(item.id),
			name: item.name,
		  };
		deleteOpenMenu(request);
	}

	const deleteOpenMenu = (request) => {
		console.log("[DELETE TODAY MENU]",request);
		const deleteOpenMenu = async () => {
		try {
			const responseData = await sendRequest(
                process.env.REACT_APP_API_URL+"/delete-open-menu",
                "POST",
                JSON.stringify(request),
                header
			);
	
			if (responseData.status === 403) {
			    history.replace("/login");
			} else if (responseData.status === 200) {
                window.location.reload();
			}
		} catch (err) {
			// done in http-hook.js
		}
		};
		deleteOpenMenu();
	};

    return(
        <>
        <div className='card'>
            <div className='card-info card-title'>
                {checkTodayMenu(item.opened, item.updatedAt)&&<div className='opened-menu'>今日</div>}
                <div>{item.name}</div>
                {icon}
            </div>
            <div className='card-info memo'>{item.memo}</div>
            <div className='card-info admin-btn-box'>
                {checkTodayMenu(item.opened,item.updatedAt) && <Button variant="text" size="small" className="del-btn" onClick={deleteTodayMenu}>取消今日下午茶</Button>}
                <Button variant="contained" size="small" className="edit-btn" onClick={editMenuHandler}>編輯菜單</Button>
            </div>
        </div>
        {isEditDialogOpen&&<EditDialog isOpen={isEditDialogOpen} onEditDialogClose={onEditDialogClose} item={item}></EditDialog>}
        </>
    )
}

export default MenuCard;