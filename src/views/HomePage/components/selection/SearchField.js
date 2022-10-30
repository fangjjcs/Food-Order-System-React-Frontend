import { useDispatch } from "react-redux";
import { TextField } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';

import { setFilter } from "../../../../store/menu-actions";

const SearchField = () => {

    const dispatch = useDispatch();
    const handleChange = (event) => {
        const text = event.target.value;
        dispatch(setFilter(text));
    }

    return(
        <TextField
            id="input-with-icon-textfield"
            InputProps={{
            startAdornment: (
                <InputAdornment position="start">
                <SearchIcon />
                </InputAdornment>
            ),
            }}
            size="small"
            onChange={handleChange}
      />
    )
}

export default SearchField;