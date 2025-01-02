
import React, {useState, useEffect, useRef} from 'react';
import styles from './styles.module.css'
import * as Realm from 'realm-web';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import LoadingPage from '../../loadingPage/loadingPage';
import uiSchema from './uiSchema';
import AddNewEmployeePage from '../addNewEmployee/newEmployeePage';

import { FaAngleDown } from "react-icons/fa";
import { IoAddOutline } from "react-icons/io5";
import { SiMicrosoftexcel } from "react-icons/si";
import { AiOutlineFileExcel } from "react-icons/ai"
import { GoTag } from "react-icons/go";
import { GoUnlink } from "react-icons/go";
import { AiOutlineDelete } from "react-icons/ai";

const app = new Realm.App({ id: process.env.REACT_APP_REALM_ID });

const filterProductsSchema = {
  title: 'Filter',
  type: 'object',
  properties: {
    stores: { type: 'string', title: 'Cửa hàng', enum: ['']},
    id: { type: 'string', title: 'ID', minLength: 6},
    employeeInfo: { type: 'string', title: 'Thông tin nhân viên'},
    access: { type: 'string', title: 'Quyền', enum: ['highAdmin', 'mediumAdmin', 'lowAdmin']}
  },
};

const Employee = () => {
  const [isOpenCreateNew, setIsOpenCreateNew] = useState(false);
  const [isOpenOperation, setIsOpenOperation] = useState(false);
  const [isOpenAddEmployee, setIsOpenAddEmployee] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdownCreateNew = () => {
    setIsOpenCreateNew(!isOpenCreateNew);
    setIsOpenOperation(false);
  };
  const toggleDropdownOperation = () => {
    setIsOpenOperation(!isOpenOperation);
    setIsOpenCreateNew(false);
  };

  const toggleOpenAddEmployeesPage = () => {
    setIsOpenCreateNew(false);
    setIsOpenAddEmployee(!isOpenAddEmployee);
  };

  const toggleCloseAddEmployeesPage = () => {
    setIsOpenAddEmployee(!isOpenAddEmployee);
  };
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpenCreateNew(false);
      setIsOpenOperation(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAddNewItem = () => {
    console.log('Đang click');
    return 0;
  }

  
  const [columnDefsSellChanel] = useState([
    { headerName: 'Nhân viên', field: 'employee', width: '250px' },
    { headerName: 'Tên đăng nhập', field: 'userNameLogin', width: '250px' },
    { headerName: 'Điện thoại', field: 'phoneNumber', width: '200px' },
    { headerName: 'Email', field: 'emailAdress', width: '200px' },
    { headerName: 'Nhóm quyền', field: 'decentralizationGroup', width: '200px' },
    { headerName: 'Cửa hàng', field: 'store', width: '200px' },
    { headerName: 'Trạng thái', field: 'status', width: '200px' }
  ]);
  const [rowDataSellChanel] = useState([
    { salesChannel: 'Online', orders: 120, orderPercentage: '30%', revenue: 3000, revenuePercentage: '40%' },
  ]);

  if (app.currentUser === null) {
    return <div><LoadingPage /></div>
  }

  return (
    <div className={styles.containerEmployee}>
      <div className={styles.containerFormEmployee}>
        <div className={styles.containerFormLayerEmployee}>
          <Form
            className={styles.custom_formEmployee}
            schema={filterProductsSchema}
            validator={validator}
            uiSchema={uiSchema}
          />
          <div className={styles.containerButtonEmployee} ref={dropdownRef}>
            <div className={styles.containercreateNewBtn_operationBtnLayer}>
              <div className={styles.createNewBtn} onClick={toggleDropdownCreateNew}>
                <span>Thêm mới</span>
                <FaAngleDown />
                {isOpenCreateNew && (
                  <div className={styles.createNewBtnDropList}>
                    <div className={styles.createNewBtnDropListItems}>
                      <div className={styles.addItemsCreateNew} onClick={(e) => {e.stopPropagation(); toggleOpenAddEmployeesPage();}}>
                        <IoAddOutline />
                        <span>Thêm nhân viên</span>
                      </div>
                      <div className={styles.addFormExcelItemsCreateNew} onClick={(e) => {e.stopPropagation(); handleAddNewItem();}}>
                        <SiMicrosoftexcel />
                        <span>Thêm từ Excell</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
          
              <div className={styles.operationBtn}  onClick={toggleDropdownOperation}>
                <span>Thao tác</span>
                <FaAngleDown />
                {isOpenOperation && (
                  <div className={styles.operationBtnDropList}>
                    <div className={styles.operationDropListItems}>
                      <div className={styles.exportExcellOperation} onClick={(e) => {e.stopPropagation(); handleAddNewItem();}}>
                        <AiOutlineFileExcel />
                        <span>Xuất Excell</span>
                      </div>              
                      <div className={styles.stickyLabelOperation} onClick={(e) => {e.stopPropagation(); handleAddNewItem();}}>
                        <GoTag />
                        <span>Gán nhãn</span>
                      </div>
                      <div className={styles.unStickyLabelOperation} onClick={(e) => {e.stopPropagation(); handleAddNewItem();}}>
                        <GoUnlink />
                        <span>Gỡ nhãn</span>
                      </div>
                      <div className={styles.deleteLineOperation} onClick={(e) => {e.stopPropagation(); handleAddNewItem();}}>
                        <AiOutlineDelete /> 
                        <span>Xóa các dòng đã chọn</span>
                      </div>
                    </div>
                  </div>
                )}   
              </div>  
            </div>
          </div>
        </div>
        {isOpenAddEmployee && (
          <div className={styles.AddNewItemPage}>
            <div className={styles.AddNewItemPageOverLay}>
              <div className={styles.AddNewItemPageLayer}>
                <div className={styles.AddNewItemPageHeader}>
                  <div className={styles.AddNewItemPageHeaderName}>
                    <span>Thêm sản phẩm</span>
                  </div>
                  <div className={styles.AddNewItemPageHeaderIconX} onClick={toggleCloseAddEmployeesPage}>
                    <button>X</button>
                  </div>
                </div>
                <div className={styles.AddNewItemPageBody}>
                  <AddNewEmployeePage />
                </div>
              </div>
            </div>
          </div>
        )}    
      </div>
      
      <div className={styles.agGridTable}>
        <div style={{width: '100%', padding: '10px' }} className="ag-theme-alpine">
          <AgGridReact
            columnDefs={columnDefsSellChanel}
            rowData={rowDataSellChanel}
            pagination={false}
            domLayout="autoHeight" 
          />
        </div>
      </div>
    </div>
  );
};

export default Employee;
