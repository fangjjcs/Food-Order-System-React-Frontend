import { useState, useContext, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom/";
import { Box, Button, Paper } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import DeleteIcon from "@material-ui/icons/Delete";

import { createTheme, ThemeProvider } from "@material-ui/core/styles";

import { AgGridColumn, AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";

import "./ResultPage.css";
import EditDialog from "./components/Dialog";
import { useHttpClient } from "../../shared/hook/http-hook";
import AuthContext from "../../shared/context/auth-context";
import SnackBar from "../HomePage/components/SnackBar";

const theme = createTheme({
  status: {
    danger: "#e53e3e",
  },
  palette: {
    primary: {
      main: "#005566",
      darker: "#005566",
    },
  },
});

const ResultPage = (props) => {
  const [rowData, setRowData] = useState([]);
  const gridRef = useRef(null);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogData, setDialogData] = useState({});
  const [openDelDialog, setOpenDelDialog] = useState(false);
  const [dialogDelData, setDialogDelData] = useState({});
  const [isSnackBarOpen, setSnackBarOpen] = useState(false);

  const { isLoading, error, sendRequest } = useHttpClient();
  const authContext = useContext(AuthContext);
  const history = useHistory();
  const header = new Headers();
  header.append("Content-Type", "application/json");
  header.append("Authorization", "Bearer " + authContext.token);

  useEffect(() => {
    fetchResult();
  }, []);

  useEffect(() => {
    checkSnackBar();
  }, [authContext.isSuccess]);

  const checkSnackBar = () => {
    if (authContext.isSuccess) {
      setSnackBarOpen(true);
    }
    setTimeout(() => {
      setSnackBarOpen(false);
      authContext.setSuccess("");
    }, 3000);
  };

  const fetchResult = () => {
    const fetchData = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_API_URL+"/get-all-order",
          "POST",
          JSON.stringify({}),
          header
        );

        console.log(responseData);
        if (responseData.status !== 200) {
          authContext.setSuccess("有地方出錯了!");
          history.replace("/");
        } else {
          setRowData([
            ...responseData.orders,
            {
              id: 100,
              menuId: 100,
              name: "--",
              type: "--",
              item: "--",
              sugar: "--",
              ice: "--",
              price: sumAllSum(responseData.orders)[0],
              memo: "--",
              count: sumAllSum(responseData.orders)[1],
              user: "總價",
              updated_at: "--",
            },
          ]);
          checkSnackBar();
        }
      } catch (err) {
        // done in http-hook.js
      }
    };
    fetchData();
  };

  const sumAllSum = (orders) => {
    let sumPrice = 0;
    let sumCount = 0;
    for (let i = 0; i < orders.length; i++) {
      sumPrice += parseInt(orders[i].price);
      sumCount += parseInt(orders[i].count);
    }
    return [sumPrice, sumCount];
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };
  const onBtnExport = () => {
    gridApi.exportDataAsCsv();
  };

  const [columnDefs, setColumnDefs] = useState([
    { field: "user", width: 120 },
    { field: "name", width: 120 },
    { field: "item", minWidth: 120, maxWidth: 150 },
    { field: "sugar", width: 120 },
    { field: "ice", width: 120 },
    { field: "memo", width: 120 },
    { field: "count", width: 120 },
    { field: "price", width: 120 },
  ]);

  const cellRender = (props) => {
    const buttonClicked = () => {
      setDialogData(props.data);
      setOpenDialog(true);
    };
    if (props.data.user === "總價") {
      return null;
    }
    return (
      <span className="edit-box">
        <Button className="edit-btn" onClick={() => buttonClicked()}>
          <EditRoundedIcon style={{ color: "#005566" }}/>
        </Button>
      </span>
    );
  };

  const cellRenderDel = (props) => {
    const buttonClicked = () => {
      setDialogDelData(props.data);
      setOpenDelDialog(true);
    };
    if (props.data.user === "總價") {
      return null;
    }
    return (
      <span className="edit-box">
        <Button className="edit-btn" onClick={() => buttonClicked()}>
          <DeleteIcon style={{ color: "#e76852" }}/>
        </Button>
      </span>
    );
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleDelClose = () => {
    setOpenDelDialog(false);
  };

  const handleSubmit = () => {
    deleteOrder(dialogDelData);
  };

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
          authContext.logout();
          history.replace("/login");
        } else if (responseData.status === 200) {
          authContext.setSuccess("成功刪除餐點!")
          setOpenDelDialog(false);
          window.location.reload()
        }
      } catch (err) {
        // done in http-hook.js
      }
    };
    deleteOrder();
  };

  const rowClass = "my-ag-row";
  const rowClassRules = {
    "ag-row-total": function (params) {
      return params.data.user === "總價";
    },
  };
  return (
    <header className="result-page-header">
      <ThemeProvider theme={theme}>
        <Box className="result-page-box">
          <Paper elevation={3} className="paper">
            <div
              className="ag-theme-material"
              style={{ height: 540, width: 1000 }}
            >
              <Button onClick={() => onBtnExport()}>
                {" "}
                <CloudDownloadIcon style={{ color: "#005566" }}/>{" "}
              </Button>
              <AgGridReact
                pagination={true}
                paginationPageSize={15}
                rowData={rowData}
                rowSelection="multiple"
                ref={gridRef}
                onGridReady={onGridReady}
                frameworkComponents={{
                  cellRender: cellRender,
                  cellRenderDel: cellRenderDel,
                }}
                rowClass={rowClass}
                rowClassRules={rowClassRules}
              >
                <AgGridColumn
                  sortable={true}
                  filter={true}
                  field="user"
                  width={100}
                ></AgGridColumn>
                <AgGridColumn
                  sortable={true}
                  filter={true}
                  field="name"
                  width={120}
                ></AgGridColumn>
                <AgGridColumn
                  sortable={true}
                  filter={true}
                  field="item"
                  minWidth={130}
                  maxWidth={150}
                ></AgGridColumn>
                <AgGridColumn
                  sortable={true}
                  filter={true}
                  field="sugar"
                  width={80}
                ></AgGridColumn>
                <AgGridColumn
                  sortable={true}
                  filter={true}
                  field="ice"
                  width={80}
                ></AgGridColumn>
                <AgGridColumn
                  sortable={true}
                  filter={true}
                  field="memo"
                  width={120}
                ></AgGridColumn>
                <AgGridColumn
                  sortable={true}
                  filter={true}
                  field="count"
                  width={100}
                ></AgGridColumn>
                <AgGridColumn
                  sortable={true}
                  filter={true}
                  field="price"
                  width={100}
                ></AgGridColumn>
                <AgGridColumn
                  field="編輯"
                  width={80}
                  cellRenderer="cellRender"
                ></AgGridColumn>
                <AgGridColumn
                  field="刪除"
                  width={80}
                  cellRenderer="cellRenderDel"
                ></AgGridColumn>
              </AgGridReact>
            </div>
          </Paper>
        </Box>
        {openDialog && dialogData && (
          <EditDialog
            isOpen={openDialog}
            data={dialogData}
            onClickCancel={handleClose}
            reloadOrder={fetchResult}
          ></EditDialog>
        )}
        {openDelDialog && dialogDelData && (
          <Dialog
            open={openDelDialog}
            onClose={handleDelClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth={"xs"}
            fullWidth={true}
          >
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                刪除點餐？
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDelClose} color="primary">
                取消
              </Button>
              <Button onClick={handleSubmit} color="primary" autoFocus>
                刪除!
              </Button>
            </DialogActions>
          </Dialog>
        )}
        <SnackBar
          isOpen={isSnackBarOpen}
          text={authContext.successText}
        ></SnackBar>
      </ThemeProvider>
    </header>
  );
};

export default ResultPage;
