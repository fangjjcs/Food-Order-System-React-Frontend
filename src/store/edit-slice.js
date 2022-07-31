import { createSlice } from "@reduxjs/toolkit";

const removeRowByKeys = (units, object) => {
    return units.filter(unit => unit["id"] !== object["id"])
}

const editSlice = createSlice({
  name: "edit",
  initialState: {
    data:{
        UNITS:{
            unit: [
                {
                    id: '123',
                    name: "AAA",
                    max_time: "223",
                    min_time: "900"
                },
                {
                    id:'234',
                    name: "BBB",
                    max_time: "600",
                    is_batch: "Y"
                },
                {
                    id:'456',
                    name: "CCC",
                    max_time: "300"
                }
            ]
        }
    }
  },
  reducers: {
    setEditedCell(state, action) {
        const {table,index, column, newValue} = action.payload;
        switch(table){
            case "unit":
                state.data.UNITS.unit[index][column] = newValue ;
                break;
        }
    },
    setNewRow(state, action) {
        const {table, newObject} = action.payload;
        switch(table){
            case "unit":
                state.data.UNITS.unit.unshift(newObject);
                break;
        }
    },
    setDeleteRow(state, action) {
        const {table, object} = action.payload;
        switch(table){
            case "unit":
                state.data.UNITS.unit = removeRowByKeys(state.data.UNITS.unit, object);
                break;
        }
    },
  },
});

export const editActions = editSlice.actions;

export default editSlice;
