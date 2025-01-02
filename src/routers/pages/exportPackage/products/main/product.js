
import React, {useState, useEffect, useRef} from 'react';
import styles from './styles.module.css'
import * as Realm from 'realm-web';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import LoadingPage from '../../../loadingPage/loadingPage';
import uiSchema from './uiSchema';
import { useAppContext } from '../../../appContext/AppContext';

import { FaAngleDown } from "react-icons/fa";
import { IoAddOutline } from "react-icons/io5";
import { SiMicrosoftexcel } from "react-icons/si";
import { AiOutlineFileExcel } from "react-icons/ai"
import { LiaBarcodeSolid } from "react-icons/lia";
import { GoTag } from "react-icons/go";
import { GoUnlink } from "react-icons/go";
import { AiOutlineDelete } from "react-icons/ai";
import { VscSplitHorizontal } from "react-icons/vsc";
import { TbArrowBackUp } from "react-icons/tb";

const app = new Realm.App({ id: process.env.REACT_APP_REALM_ID });

const filterProductsSchema = {
  title: 'Filter',
  type: 'object',
  properties: {
    stores: { type: 'string', title: 'Cửa hàng', enum: ['']},
    id: { type: 'string', title: 'ID', minLength: 6},
    productsNameCode: { type: 'string', title: 'Tên, mã sản phẩm'},
    typeActive: {type: 'string', title: '-Loại-', enum: ['Nhập']},
    typeImport: {type: 'string', title: 'Kiểu', enum: ['Nhà cung cấp', 'Chuyển kho', 'Giao hàng', 'Bảo hành', 'Sửa chữa', 'Khác']}
  },
};

const ProductPage = () => {
  const [isOpenCreateNew, setIsOpenCreateNew] = useState(false);
  const [isOpenOperation, setIsOpenOperation] = useState(false);
  const [isOpenAddItemAgGrid, setIsOpenAddItemAgGrid] = useState(false);
  const {setAddNewItemExportPackage} = useAppContext();
  const {addNewItemExportPackage} = useAppContext();
  const {setAddPrintCode} = useAppContext();
  const {addPrintCode} = useAppContext();
  const dropdownRef = useRef(null);

  const toggleDropdownCreateNew = () => {
    setIsOpenCreateNew(!isOpenCreateNew);
    setIsOpenOperation(false);
    setIsOpenAddItemAgGrid(false);
  };
  const toggleDropdownOperation = () => {
    setIsOpenOperation(!isOpenOperation);
    setIsOpenCreateNew(false);
    setIsOpenAddItemAgGrid(false);
  };
  const toggleDropdownItemAgGrid = () => {
    setIsOpenAddItemAgGrid(!isOpenAddItemAgGrid);
    setIsOpenCreateNew(false);
    setIsOpenOperation(false);
  };

  const toggleOpenAddItemPage = () => {
    setAddNewItemExportPackage(!addNewItemExportPackage);
    setIsOpenCreateNew(false);
  };

  const toggleOpenAddPrintCode = () => {
    setAddPrintCode(!addPrintCode);
    setIsOpenOperation(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpenCreateNew(false);
      setIsOpenOperation(false);
      setIsOpenAddItemAgGrid(false);
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
    { headerName: 'ID', field: 'IDProduct', width: '200px' },
    { headerName: 'Kho hàng', field: 'kHProduct', width: '160px' },
    { headerName: 'SP', field: 'product', width: '160px' },
    { headerName: 'SL', field: 'numberProduct', width: '160px' },
    { headerName: 'Tổng tiền', field: 'totalPrice', width: '160px' },
    { headerName: 'Người tạo', field: 'authourCreated', width: '160px' },
    { headerName: 'File đính kèm', field: 'file', width: '160px' },
    { headerName: 'Ghi chú', field: 'noted', width: '160px' },
  ]);
  const [rowDataSellChanel] = useState([
    { salesChannel: 'Online', orders: 120, orderPercentage: '30%', revenue: 3000, revenuePercentage: '40%' },
  ]);

  const [checkboxes, setCheckboxes] = useState([
    { id: 'customer', label: 'Khách hàng', value: 'Customer', checked: false },
    { id: 'file', label: 'File đính kèm', value: 'File', checked: true },
  ]);

  const handleCheckboxChange = (event) => {
    const { id, checked } = event.target;
    setCheckboxes((prevCheckboxes) =>
      prevCheckboxes.map((checkbox) =>
        checkbox.id === id ? { ...checkbox, checked: checked } : checkbox
      )
    );
  };

  if (app.currentUser === null) {
    return <div><LoadingPage /></div>
  }

  return (
    <div className={styles.containerProducts}>
      <div className={styles.containerFormProducts}>
        <div className={styles.containerFormLayerProducts}>
          <Form
            className={styles.custom_formProducts}
            schema={filterProductsSchema}
            validator={validator}
            uiSchema={uiSchema}
          />
          <div className={styles.containerButtonProducts} ref={dropdownRef}>
            <div className={styles.containercreateNewBtn_operationBtnLayer}>
              <div className={styles.createNewBtn} onClick={toggleDropdownCreateNew}>
                <span>Thêm mới</span>
                <FaAngleDown />
                {isOpenCreateNew && (
                  <div className={styles.createNewBtnDropList}>
                    <div className={styles.createNewBtnDropListItems}>
                      <div className={styles.addItemsCreateNew} onClick={(e) => {e.stopPropagation(); toggleOpenAddItemPage();}}>
                        <IoAddOutline />
                        <span>Thêm mới</span>
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
                      <div className={styles.printBarcodeOperation} onClick={(e) => {e.stopPropagation(); toggleOpenAddPrintCode();}}> 
                        <LiaBarcodeSolid />
                        <span>In mã vạch</span>
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
            <div className={styles.settingItemAgGrid} onClick={toggleDropdownItemAgGrid}>
              <VscSplitHorizontal />
              <FaAngleDown />
              {isOpenAddItemAgGrid && (
                  <div className={styles.addItemAgGridBtnDropList}>
                    <div className={styles.addItemAgGridBtnDropListItems}>
                      <div className={styles.addItemAgGrid} onClick={(e) => {e.stopPropagation(); handleAddNewItem();}}>
                        <div className={styles.addItemAgGridHeader}>
                          <div className={styles.addItemAgGridHeaderName}>
                            <span>Cài đặt ẩn hiển cột:</span>
                          </div>
                          <div className={styles.addItemAgGridHeaderIcon}>
                            <TbArrowBackUp />
                            <span>Quay về mặc định</span>
                          </div>
                        </div>
                        {checkboxes.map((checkbox) => (
                          <div key={checkbox.id} className={styles.checkbox_item}>
                            <div>
                              <input
                                type="checkbox"
                                id={checkbox.id}
                                value={checkbox.value}
                                checked={checkbox.checked}
                                onChange={handleCheckboxChange}
                              />
                              <label htmlFor={checkbox.id}>{checkbox.label}</label>
                            </div>
                          </div>
                        ))}
                      </div>              
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
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

export default ProductPage;
