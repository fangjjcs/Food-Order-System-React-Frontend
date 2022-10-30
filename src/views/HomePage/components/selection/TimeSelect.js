import { MuiPickersUtilsProvider, TimePicker } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import { useState } from "react";

function TimeSelect({setDueTimeHandler}) {
    const [selectedDate, handleDateChange] = useState(new Date());
  
    const handleDateChangeHandler = (time) => {
		handleDateChange(time);
		setDueTimeHandler(time);
    }

    return (
		<MuiPickersUtilsProvider utils={DateFnsUtils}>
			<TimePicker placeholder="11:30 AM" mask="__:__ _M" label="結單時間" value={selectedDate} onChange={handleDateChangeHandler} />
		</MuiPickersUtilsProvider>
    );
  }
  
  export default TimeSelect;