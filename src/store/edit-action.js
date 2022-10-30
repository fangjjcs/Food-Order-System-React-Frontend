import { editActions } from "./edit-slice";

export const editedCell = (table,index,column,newValue) => {
	return async (dispatch) => {
		dispatch(editActions.setEditedCell({table:table,index:index,column:column,newValue:newValue}));
	}
}

export const addNewRow = (table,newObject) => {
	return async (dispatch) => {
		dispatch(editActions.setNewRow({table:table,newObject:newObject}));
	}
}

export const deleteRow = (table,object) => {
	return async (dispatch) => {
		dispatch(editActions.setDeleteRow({table:table,object:object}));
	}
}