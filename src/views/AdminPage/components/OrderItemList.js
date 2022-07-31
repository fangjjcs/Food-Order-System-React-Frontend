import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import styles from "./styles.module.css";
import OrderItem from "./widget/OrderItem";

const useStyles = makeStyles((theme) => ({
	root: {
		width: "100%",
		paddingLeft: theme.spacing(0),
		paddingRight: theme.spacing(0),
		backgroundColor: theme.palette.background.paper,
	},
}));

export default function OrderItemList(props) {
  	const classes = useStyles();
  

	return (
		<div className={classes.root}>
			{props.list.map((item, key) => {
				return (
					<div className={styles.ListContent} key={key}>
						<WhatshotIcon style={{ color: "#9c3523" }} />
						<OrderItem item={item}></OrderItem>
					</div>
				);
			})}
		</div>
	);
}
