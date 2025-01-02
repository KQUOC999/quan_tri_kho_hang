import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import styles from './styles.module.css';

import { useAppContext } from '../../appContext/AppContext';

const RolePermissionGrid = () => {
  const {rowData} = useAppContext();
  const {setRowData} = useAppContext();

  const columnDefs = [
    {
      headerName: 'Trang',
      field: 'page',
      editable: false,
      width: window.innerWidth * 0.1,
      cellRenderer: (params) => {
        if (params.node.rowIndex > 0 && params.value === params.api.getDisplayedRowAtIndex(params.node.rowIndex - 1).data.page) {
          return <div className="gap"></div>; // Thêm class gap
        }
        return params.value;
      }
    },
    {
      headerName: 'Danh mục',
      field: 'category',
      editable: false,
      width: window.innerWidth * 0.2,
      cellRenderer: (params) => {
        if (params.node.rowIndex > 0 && params.value === params.api.getDisplayedRowAtIndex(params.node.rowIndex - 1).data.category) {
          return <div className="gap"></div>; // Thêm class gap
        }
        return params.value;
      }
    },
    { headerName: 'Chức năng', field: 'feature', editable: false, width: window.innerWidth * 0.35 },
    {
      headerName: 'highAdminRole', field: 'highAdminRole', editable: true, width: 150,
      cellEditor: 'agCheckboxCellEditor',
      cellRendererFramework: (params) => (
        <input
          type="checkbox"
          checked={params.value}
          onChange={() => {
            params.setValue(!params.value);
          }}
        />
      ),
    },
    {
      headerName: 'mediumAdminRole', field: 'mediumAdminRole', editable: true, width: 150,
      cellEditor: 'agCheckboxCellEditor',
      cellRendererFramework: (params) => (
        <input
          type="checkbox"
          checked={params.value}
          onChange={() => {
            params.setValue(!params.value);
          }}
        />
      ),
    },
    {
      headerName: 'lowAdminRole', field: 'lowAdminRole', editable: true, width: 150,
      cellEditor: 'agCheckboxCellEditor',
      cellRendererFramework: (params) => (
        <input
          type="checkbox"
          checked={params.value}
          onChange={() => {
            params.setValue(!params.value);
          }}
        />
      ),
    },
  ];

  const onCellValueChanged = (params) => {
    const updatedRowData = [...rowData];
    const rowIndex = params.node.rowIndex;

    updatedRowData[rowIndex] = {
      ...updatedRowData[rowIndex],
      [params.colDef.field]: params.newValue,
    };
    setRowData(updatedRowData);
  };

  return (
    <div className={styles.container}>
      <div className={styles.containerLayer}>
        <div className="ag-theme-alpine" style={{width: '100%' }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            domLayout='autoHeight'
            defaultColDef={{
              resizable: true,
              editable: true,
            }}
            onCellValueChanged={onCellValueChanged}
          />
        </div>
      </div>
    </div>
  );
};

export default RolePermissionGrid;
