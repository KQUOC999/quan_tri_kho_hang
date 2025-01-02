
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

const app = new Realm.App({ id: process.env.REACT_APP_REALM_ID });
const page = 'Hàng hóa';
const category = 'Sản phẩm';

const filterProductsSchema = {
  title: 'Filter',
  type: 'object',
  properties: {
    stores: { type: 'string', title: 'Cửa hàng', enum: ['']},
    id: { type: 'string', title: 'ID', minLength: 6},
    productsNameCode: { type: 'string', title: 'Tên, mã sản phẩm'},
    category: { type: 'string', title: 'Danh mục'},
    productsStatus: { type: 'string', title: 'Tình trạng', enum: ['-Tồn', 'Còn tồn', 'Có thể bán']}
  },
};

const ProductPage = () => {
  const [isOpenCreateNew, setIsOpenCreateNew] = useState(false);
  const [isOpenOperation, setIsOpenOperation] = useState(false);
  const [isOpenAddItemAgGrid, setIsOpenAddItemAgGrid] = useState(false);
  const {access} = useAppContext();
  const {accessPage} = useAppContext();
  const {setAddNewItem} = useAppContext();
  const {addNewItem} = useAppContext();
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

  const toggleOpenAddItemPage = (task) => {
    const checkAccess = accessPage(page, category, task, access);
    if (checkAccess !== true) return null;
    setAddNewItem(!addNewItem);
    setIsOpenCreateNew(false);
  };

  const toggleOpenAddPrintCode = (task) => {
    const checkAccess = accessPage(page, category, task, access);
    if (checkAccess !== true) return null;
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
    { headerName: 'ID', field: 'iD', width: 200 },
    { headerName: 'Ảnh', field: 'img', width: 200 },
    { headerName: 'Mã vạch', field: 'barCode', width: 160 },
    { headerName: 'Mã', field: 'code', width: 160 },
    { headerName: 'Tên', field: 'nameProduct', width: 160 },
    { headerName: 'Giá vốn', field: 'giaVon', width: 160 },
    { headerName: 'Giá bán', field: 'giaBan', width: 160 },
    { headerName: 'Tồn', field: 'ton', width: 160 },
    { headerName: 'Đang giao hàng', field: 'dangGiao', width: 160 },
    { headerName: 'Tồn trong kho', field: 'tonKho', width: 160 },
    { headerName: 'Tạm giữ', field: 'temporaryHoldProduct', width: 160 },
    { headerName: 'Có thể bán', field: 'coTheBan', width: 160 },
    { headerName: 'Bán', field: 'ban', width: 160 }
  ]);
  const [rowDataSellChanel] = useState([
    { salesChannel: 'Online', orders: 120, orderPercentage: '30%', revenue: 3000, revenuePercentage: '40%' },
  ]);

  const [checkboxes, setCheckboxes] = useState([
    { id: 'img', label: 'Ảnh', value: 'IMG', checked: true },
    { id: 'barCode', label: 'Mã vạch', value: 'BarCode', checked: false },
    { id: 'code', label: 'Mã', value: 'Code', checked: true },
    { id: 'giaNhap', label: 'Giá nhập', value: 'GiaNhap', checked: false },
    { id: 'giaVon', label: 'Giá vốn', value: 'GiaVon', checked: true },
    { id: 'giaBan', label: 'Giá bán', value: 'GiaBan', checked: true },
    { id: 'giaSi', label: 'Giá sỉ', value: 'GiaSi', checked: false },
    { id: 'ton', label: 'Tồn', value: 'Ton', checked: true },
    { id: 'tongTon', label: 'Tổng tồn', value: 'TongTon', checked: false },
    { id: 'hangLoi', label: 'Hàng lỗi', value: 'HangLoi', checked: false},
    { id: 'dangGiao', label: 'Đang giao hàng', value: 'DangGiao', checked: true},
    { id: 'tonKho', label: 'Tồn trong kho', value: 'TonKho', checked: false},
    { id: 'coTheBan', label: 'Có thể bán', value: 'CoTheBan', checked: true},
    { id: 'ban', label: 'Bán', value: 'Ban', checked: true },
    { id: 'thaoTac', label: 'Thao tác', value: 'ThaoTac', checked: true}
  ]);

  const handleCheckboxChange = (event) => {
    const { id, checked } = event.target;
    setCheckboxes((prevCheckboxes) =>
      prevCheckboxes.map((checkbox) =>
        checkbox.id === id ? { ...checkbox, checked: checked } : checkbox
      )
    );
  };

  const [columnDefsSellChanelDifferents, setColumnDefsSellChanelDifferents] = useState(columnDefsSellChanel);
  useEffect(() => {
    const handleChangeItemAgridTable = () => {
      const newArrayUpdateCheckedBoxes = [];
      const checkItemCheckboxesDifferent = checkboxes.filter(item => {
        return !columnDefsSellChanel.some(element => element.field === item.id)
      }).filter(e => e.checked === true)

      const checkItemCheckboxesSame = checkboxes.filter(item => {
        return columnDefsSellChanel.some(element => element.field === item.id)
      }).filter(e => e.checked === true)

      const columnDefsSellChanelDifferent = columnDefsSellChanel.filter(item => {
        return !checkboxes.some(element => element.id === item.field)
      })

      const changeTypecheckItemCheckboxesSame = checkItemCheckboxesSame.map(item => {
        const newObject = {
          headerName: item.label,
          field: item.id,
          width: '160px',
        };
        return newObject;
      });

      const changeTypecheckItemCheckboxesDifferent = checkItemCheckboxesDifferent.map(item => {
        const newObject = {
          headerName: item.label,
          field: item.id,
          width: 160,
        };
        return newObject;
      });
    
      newArrayUpdateCheckedBoxes.push(...columnDefsSellChanelDifferent, ...changeTypecheckItemCheckboxesSame, ...changeTypecheckItemCheckboxesDifferent);
      if (JSON.stringify(newArrayUpdateCheckedBoxes) !== JSON.stringify(checkboxes)) {
        setColumnDefsSellChanelDifferents(newArrayUpdateCheckedBoxes);
      }
    }
    handleChangeItemAgridTable();
  }, [checkboxes, columnDefsSellChanel])

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
                      <div className={styles.addItemsCreateNew} onClick={(e) => {e.stopPropagation(); toggleOpenAddItemPage('Thêm mới');}}>
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
                {isOpenOperation && access === process.env.REACT_APP_HIGH_ADMIN_ROLE ? (
                  <div className={styles.operationBtnDropList}>
                    <div className={styles.operationDropListItems}>
                      <div className={styles.exportExcellOperation} onClick={(e) => {e.stopPropagation(); handleAddNewItem();}}>
                        <AiOutlineFileExcel />
                        <span>Xuất Excell</span>
                      </div>              
                      <div className={styles.printBarcodeOperation} onClick={(e) => {e.stopPropagation(); toggleOpenAddPrintCode('In mã vạch');}}> 
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
                ): ''}   
              </div>  
            </div>
            <div className={styles.settingItemAgGrid} onClick={toggleDropdownItemAgGrid}>
              <VscSplitHorizontal />
              <FaAngleDown />
              {isOpenAddItemAgGrid && (
                  <div className={styles.addItemAgGridBtnDropList}>
                    <div className={styles.addItemAgGridBtnDropListItems}>
                      <div className={styles.addItemAgGrid} onClick={(e) => {e.stopPropagation(); handleAddNewItem();}}>
                        {checkboxes.map((checkbox) => (
                          <div key={checkbox.id} className={styles.checkbox_item}>
                            <input
                              type="checkbox"
                              id={checkbox.id}
                              value={checkbox.value}
                              checked={checkbox.checked}
                              onChange={handleCheckboxChange}
                            />
                            <label htmlFor={checkbox.id}>{checkbox.label}</label>
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
            columnDefs={columnDefsSellChanelDifferents}
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
