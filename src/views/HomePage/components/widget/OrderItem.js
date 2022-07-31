import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import styles from "../styles.module.css";

const useStylesList = makeStyles((theme) => ({
	root: {
	  paddingTop: theme.spacing(0),
	  paddingBottom: theme.spacing(0),
	  paddingLeft: theme.spacing(2),
	  paddingRight: theme.spacing(1),
	  marginLeft: theme.spacing(1),
	  width: "100%",
	  backgroundColor: "#E9D8A6",
	  borderRadius: "0.25rem"
	},
  }));

const MenuItem = ({ item }) => {
	const classesList = useStylesList();

	return (
		<List
			component="nav"
			aria-label={item.name}
			key={item.name+item.id}
			className={classesList.root}
		>
			<Link
				className={styles.orderLink}
				id={item.id}
				to={{
					pathname: "/order/" + item.id,
					item: item,
				}}
			>
				<ListItemText primary={<div id={item.id}>{item.name}</div>} />
			</Link>
		</List>
  );
};

export default MenuItem;
