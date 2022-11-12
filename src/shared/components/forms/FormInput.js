import { FormControl, InputLabel } from "@mui/material"

const FormInput = ({formClass, label, children}) => {
    return(
        <FormControl variant="standard" className={formClass}>
            <InputLabel htmlFor="input-with-icon-adornment" style={{color:"#666"}}>{label}</InputLabel>
            {children}
        </FormControl>
    )
}

export default FormInput
