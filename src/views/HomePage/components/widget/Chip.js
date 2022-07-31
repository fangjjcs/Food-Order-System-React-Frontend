
import styles from "../styles.module.css";

const Chip = ({icon, label}) => {
    return(
        <div className={styles.chip}>
            {icon}
            {label?<div style={{marginLeft: "8px"}}>{label}</div>:null}
        </div>
    )
}

export default Chip;