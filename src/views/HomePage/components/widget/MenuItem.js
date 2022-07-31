import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";

const useStylesList = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(0),
  },
}));

const useStylesListItem = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(0),
    paddingBottom: theme.spacing(0),
    backgroundColor: "#E9D8A6",
    borderRadius: "0.25rem"
  },
}));

const MenuItem = ({name, id, handleClickOpen}) => {
  const classesList = useStylesList();
  const classesListItem = useStylesListItem();

    const onClickHandler = (e) => {
        const id = parseInt(e.target.id);
        const name =  e.target.innerText;
        handleClickOpen(id,name);
    }
    return (
        <List
          component="nav"
          aria-label={name}
          key={id}
          className={classesList.root}
        >
          <ListItem
            button
            className={classesListItem.root}
            id={id}
            onClick={onClickHandler}
          >
            <ListItemText primary={<div  id={id} >{name}</div>}/>
          </ListItem>
        </List>
      );
}

export default MenuItem;