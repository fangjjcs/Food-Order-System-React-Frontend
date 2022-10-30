import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { setDisableRandomChoose } from "../../../../store/menu-actions";

const RandomSelect = ({options, onCloseRandomDialog, submitRandomChoice, isRandomDialogOpen, size}) => {

    const [selection, setSelection] = useState("");
    const isLogin = useSelector((state) => state.ui.isLogin);
    const history = useHistory();
    const dispatch = useDispatch();

    var interval = null;
    const intervalDuration = 50;
    const duration = 1000;

    useEffect(()=>{
        if(options.length >0 && isRandomDialogOpen){
            start();
        }
    },[options,isRandomDialogOpen])

    const start = () => {
        clearInterval(interval);
        interval = setInterval(()=>setChoice(), intervalDuration);
        setTimeout(() => {
            stop();
        },duration);
    }

    const pickChoice = () => {
        const choice = options[Math.floor(Math.random() * options.length)];
        return choice;
      }
    const setChoice = () => {
        setSelection(pickChoice());
    }

    const stop = () => {
        clearInterval(interval);
    }

    const reset = () => {
        clearInterval(interval);
        setSelection("");
    }

    const onCloseDialogHandler = () => {
        onCloseRandomDialog();
        reset();
        dispatch(setDisableRandomChoose());
    }

    const submitChoiceHandler = () => {
        if(!isLogin) {
            history.replaceState("/login");
        }
        onCloseRandomDialog();
        submitRandomChoice(selection);
    }

    return (
        <Dialog onClose={onCloseDialogHandler} open={isRandomDialogOpen} maxWidth={size} fullWidth={true}>
            <DialogTitle>來點隨緣的下午茶</DialogTitle>
            <DialogContent>
                <span>{selection.name}</span>
            </DialogContent>
            <DialogActions>
                <Button variant="text" size="small" className="outlined-btn" onClick={start}>再試一次</Button>
                <Button variant="contained" size="small" className="btn" onClick={submitChoiceHandler}>就是你了！</Button>
            </DialogActions>
        </Dialog>
    )
}

export default RandomSelect;