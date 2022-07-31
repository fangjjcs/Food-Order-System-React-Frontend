import React, { useEffect, useState,useCallback, useRef } from "react";

import { AgGridColumn, AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import { useDispatch } from "react-redux";

import { editedCell, addNewRow, deleteRow } from "../../../../store/edit-action";



const AgTable = (props) => {
  const [data, setData] = useState(props.data);

  const [editor, setEditor] = useState([]);

  const dispatch = useDispatch();
  const gridRef = useRef();

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  const columnDefs = [
    { field: "id", editable: true },
    { field: "name", editable: true },
    { field: "max_time", editable: true },
    {
      field: "is_batch",
    //   editable: (params) => {
    //       if(editor.length > 0 && editor.find( obj => obj.id === params.data.id && obj.action === 'add')){
    //         return true
    //       } else {
    //           return false
    //       }
    //   },
    //   cellStyle: (params) => {
    //       if(editor.length > 0 && editor.find( obj => obj.id === params.data.id && obj.action === 'add')){
    //         return null
    //       } else {
    //           return { backgroundColor: "#eee" }
    //       }
    //   }
    },
    {
      field: "min_time",
      editable: true,
    //   cellStyle: (params) => {
    //     if ( editor.length > 0 && editor.find( obj => obj.id === params.data.id && obj.column === "min_time" && obj.action === 'edited') ) {
    //         return { backgroundColor: "lightgreen" };
    //     }
    //     return null;
    //   },
    },
  ];

  const onCellValueChanged = (event) => {
    dispatch(editedCell("unit", event.rowIndex, event.colDef.field, event.newValue));
    setEditor([...editor, { action : 'edited', key: event.data.id, column: event.colDef.field}])
  };

  useEffect(()=>{
      console.log(editor)
  },[editor])

  const addRowHandler = () => {
    dispatch(addNewRow("unit", {}));
    setEditor([...editor, { action : 'add', key: 'undefined-undefined'}])
  };


  const deleteRowHandler = useCallback(() => {
    const selectedData = gridRef.current.api.getSelectedRows();
    dispatch(deleteRow("unit",selectedData[0]))
  }, []);

  return (
    <div className="ag-theme-material" style={{ height: 400, width: 900 }}>
      <button onClick={addRowHandler}>Add New Row</button>
      <button onClick={deleteRowHandler}>Remove Selected</button>
      <AgGridReact
        ref={gridRef}
        rowData={data}
        columnDefs={columnDefs}
        rowSelection={'single'}
        onCellValueChanged={onCellValueChanged}
      ></AgGridReact>
    </div>
  );
};

export default AgTable;
