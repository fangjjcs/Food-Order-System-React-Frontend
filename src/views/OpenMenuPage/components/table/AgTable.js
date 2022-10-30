import { useSelector } from "react-redux";
import { useEffect, useMemo, useRef, useState } from "react";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import DeleteIcon from "@material-ui/icons/Delete";

import './AgTable.css';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, Paper } from "@mui/material";
import { CloudDownload } from "@material-ui/icons";
import { useHttpClient } from "../../../../shared/hook/http-hook";
import { useHistory } from "react-router-dom";
import EditOrderDialog from "../DialogContent/EditOrderDialog";

const colDef = [
	{name: "user", label: "姓名", width: 100},
	{name: "name", label: "店家", width: 150},
	{name: "item", label: "品項", width: 150},
	{name: "sugar", label: "糖度", width: 80},
	{name: "ice", label: "冰塊", width: 80},
	{name: "memo", label: "備註", width: 120},
	{name: "count", label: "數量", width: 100},
	{name: "price", label: "價錢", width: 80},
	{name: "edit", label: "編輯", width: 80},
	{name: "delete", label: "刪除", width: 80},
]
const AgTable = ({resultData}) => {

	const [data, setData] = useState([])

	const gridRef = useRef();
	const [gridApi, setGridApi] = useState(null);
  	const [gridColumnApi, setGridColumnApi] = useState(null);
	const { isLoading, error, sendRequest } = useHttpClient();
	const history = useHistory();
	const tableHeight = window.innerHeight;

	const [editData, setEditData] = useState(null);
	const [delData, setDelData] = useState(null);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isDelDialogOpen, setIsDelDialogOpen] = useState(false);

	const token = useSelector((state) => state.ui.token);
	const header = new Headers()
	header.append("Content-Type", "application/json")
	header.append("Authorization", "Bearer " + token)

	useEffect(()=>{
		console.log(resultData)
		setData(resultData)
	},[resultData])

	const defaultColDef = useMemo(()=>{
		return{
			sortable:true,
			filter:true,
			resizable: true,
			flex: 1
		}
	},[])

	const columnDefs = colDef.map( (col) => {
		if(col.name === 'edit') {
			return{
				field: col.name,
				headerName: col.label,
				minWidth: col.width,
				cellRenderer: "cellRender"
			}
		} else if(col.name === 'delete') {
			return{
				field: col.name,
				headerName: col.label,
				minWidth: col.width,
				cellRenderer: "cellRenderDel"
			}
		} else {
			return{
				field: col.name,
				headerName: col.label,
				minWidth: col.width,
			}
		}
	})

	const onGridReady = (params) => {
		setGridApi(params.api);
		setGridColumnApi(params.columnApi);
	};
	const onBtnExport = () => {
		gridApi.exportDataAsCsv();
	};

	const cellRender = (props) => {
		const buttonClicked = () => {
			console.log(props.data)
			setEditData(props.data);
			setIsEditDialogOpen(true);
		};
		return (
			<span className="edit-box">
				<EditRoundedIcon style={{ color: "#005566", cursor: 'pointer' }} onClick={() => buttonClicked()}/>
			</span>
		);
	};
	
	const cellRenderDel = (props) => {
		const buttonClicked = () => {
			setDelData(props.data);
			setIsDelDialogOpen(true);
		};
		return (
			<span className="edit-box">
				<DeleteIcon style={{ color: "#9c3523", cursor: 'pointer' }}onClick={() => buttonClicked()}/>
			</span>
		);
	};

	const onCloseDelDialog = () => {
		setIsDelDialogOpen(false)
	}

	const onCloseEditDialog = () => {
		setIsEditDialogOpen(false);
	}

	const handleSubmitDel = () => {
		deleteOrder(delData);
	}

	const deleteOrder = (request) => {
		const deleteOrder = async () => {
			try {
				const responseData = await sendRequest(
					process.env.REACT_APP_API_URL+"/delete-order",
					"POST",
					JSON.stringify(request),
					header
				);
		
				console.log(responseData);
				if (responseData.status === 403) {
					history.replace("/login");
				} else if (responseData.status === 200) {
					// authContext.setSuccess("成功刪除餐點!")
					setIsDelDialogOpen(false);
					window.location.reload();
				}
			} catch (err) {
				// done in http-hook.js
			}
		};
		deleteOrder();
	};

    return(
		<>
		<Paper className="ag-table-box">
			<div className="table-header-box">
				<Button onClick={() => onBtnExport()}>
                	<CloudDownload style={{ color: "#005566" }}/>
             	 </Button>
			</div>
			<div className="ag-theme-material result-table" style={{height:tableHeight-200}}>
				<AgGridReact
					rowData={data}
					defaultColDef={defaultColDef}
					columnDefs={columnDefs}
					ref={gridRef}
					onGridReady={onGridReady}
					frameworkComponents={{
						cellRender: cellRender,
						cellRenderDel: cellRenderDel,
					}}
				>
              	</AgGridReact>
            </div>
          </Paper>
		  <Dialog open={isDelDialogOpen} onClose={onCloseDelDialog} maxWidth={"xs"} fullWidth={true} >
				<DialogContent>
					<DialogContentText>刪除點餐？</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleSubmitDel} variant="text" size="small" className="del-btn" autoFocus>刪除!</Button>
            	</DialogActions>	
          </Dialog>
		  {isEditDialogOpen&&<EditOrderDialog
            isOpen={isEditDialogOpen}
            data={editData}
            onClickCancel={onCloseEditDialog}
          ></EditOrderDialog>}
		  </>
    )
}

export default AgTable;