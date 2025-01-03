
import React, {useEffect , useState, useMemo, useCallback, useRef} from 'react';
import styles from './styles.module.css'
import * as Realm from 'realm-web';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import { useTable } from 'react-table';
import debounce from 'lodash/debounce';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { CiMenuKebab } from "react-icons/ci";
import { IoMdPrint } from "react-icons/io";
import { FaFileExcel } from "react-icons/fa";
import { LuImport } from "react-icons/lu";
import { FaThList } from "react-icons/fa";
import { RiSave3Fill } from "react-icons/ri";
import { LuRefreshCcw } from "react-icons/lu";
import { GoPlus } from "react-icons/go";
import { RiDeleteBin6Line } from "react-icons/ri";
import { PiListDashesBold } from "react-icons/pi";
import { MdOutlineSettings } from "react-icons/md";
import { RiQrScan2Line } from "react-icons/ri";
import { FaCheckCircle } from "react-icons/fa";
import { FaBan } from "react-icons/fa";
import { IoArrowBackOutline } from "react-icons/io5";

import LoadingPage from '../../../loadingPage/loadingPage';
import ListVotePage from '../../votes/main/votePackage';
import { useAppContext } from '../../../appContext/AppContext';

const app = new Realm.App({ id: process.env.REACT_APP_REALM_ID });

const formCreatVoteInfomation = ({
  title: 'importPackageVote',
  type: 'object',
  required: ['createDay', 'authorCreated', 'numberVote', 'importer', 'reciver'],
  properties: {
    createDay: { type: 'string', format: 'date', title: 'Ngày tạo' },
    authorCreated: { type: 'string', title: 'Người tạo' },
    numberVote: {type: 'string', title: 'Số phiếu'},
    importer: { type: 'string', title: 'Người nhập'},
    adressPart: {type: 'string', title: 'Địa chỉ (Bộ phận)'},
    reciver: {type: 'string', title: 'Người nhận'},
    adress: {type: 'string', title: 'Địa chỉ'},
    description: {type: 'string', title: 'Trạng thái', readOnly: true, default: 'Chưa duyệt'},
  },
});

const AddNewItemImportPackagePage = () => {
  const [statusSetEnumContries, setStatusSetEnumContries] = useState({});
  const [isOpenCreateNewProduct, setIsOpenCreateNewProduct] = useState(false);
  const [isOpenListFillProduct, setIsOpenListFillProduct] = useState(false);
  const [isOpenTaskFormEnumsList, setIsOpenTaskFormEnumsList] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const [formCreatVoteInfomationData, setFormCreatVoteInfomationData] = useState(null);
  const formCreatVoteInfomationDataRef = useRef(null);
  const [selectedOptionFillDataScannerDevicesImportPage, setSelectedOptionFillDataScannerDevicesImportPage] = useState("default");
  
  // Dữ liệu hàng
  const [data, setData] = useState([]);
  const [formDataCreatVoteInfomation, setFormDataCreatVoteInfomation] = useState({});
  const [dataFetch, setDataFetch] = useState([]);

  const {updatedDataImportPage} = useAppContext();
  const {setUpdatedDataImportPage} = useAppContext();
  const {isOpenAddVotesPageBySearch} = useAppContext();
  const {rowDataDefault} = useAppContext();
  const {numberVoteShowing} = useAppContext();
  const {setIsReloadDataImportVote} = useAppContext();

  const options = ["---Lựa chọn---", ...new Set (rowDataDefault.map(item => item.productType))];

  //Dữ liêu MQTT
  const { isConnectedRefImportPages } = useAppContext();
  const { isconnectedMQTTBrokerImportPage } = useAppContext();
  const { messageMQTTBrokerImportPage } = useAppContext();
  const { setMessageMQTTBrokerImportPage } = useAppContext();
  const { handleConnectingMQTTBrokerImportPage } = useAppContext();

  //Dữ liệu máy scan
  const { isConnectedScanFromDevicesRef } = useAppContext();

  useEffect(() => {
    try {
      async function fectchData() {
        const functionName = 'call_importVote_INLIST_FC';
        const response = await app?.currentUser?.callFunction(functionName);
        setDataFetch(response);
        return response;
      }
      fectchData();
    } catch (error) {
      return error.error;
    }
  }, []);

  const switchSelectedOptionFillDataScannerDevices = useCallback (() => {
      switch (selectedOptionFillDataScannerDevicesImportPage) {
        case 'default':
          setUpdatedDataImportPage((pre) => {
            const previousData = Array.isArray(pre) ? pre : [];
            let updatedData = [...previousData]; 
            const matchedItemInDefaultList = updatedData.find(
              (item) => item?.code === messageMQTTBrokerImportPage?.message
            );
        
            if (matchedItemInDefaultList) {
              const existingItemIndex = updatedData.findIndex(item => item.code === messageMQTTBrokerImportPage?.message);
  
              if (existingItemIndex !== -1) {
                updatedData[existingItemIndex] = {
                  ...updatedData[existingItemIndex],
                  quantityAdd: +updatedData[existingItemIndex].quantityAdd + 1,
                };
              } else {
                updatedData.push(matchedItemInDefaultList);
              }
            } else {
              const newItem = {
                iD: updatedData.length,
                productName: 'nameProduct',
                productType: 'nameProductDad',
                typeCodeProduct: 'typeCodeProduct',
                code: messageMQTTBrokerImportPage?.message,
                dateCreated: 'dateCreated',
                giaVon: 'giaNhap',
                giaBan: 'giaBan',
                quantity: 120,
                DvTinh: 'unitCaculation',
                quantityAdd: 1,
                totalPrice: '',
              };
        
              updatedData.unshift(newItem);
            }
        
            return updatedData;
          });
          break;
  
        case 'refresh':
          setUpdatedDataImportPage((pre) => {
            const previousData = Array.isArray(pre) ? pre : [];
            let updatedData = [...previousData]; 
            const matchedItemInDefaultList = rowDataDefault.find(
              (item) => item?.code === messageMQTTBrokerImportPage?.message
            );
            const matchedItemInUpdateList = updatedData.find(
              (item) => item?.code === messageMQTTBrokerImportPage?.message
            );
  
            if (matchedItemInDefaultList && !matchedItemInUpdateList) { 
              const updatedItem = { 
                ...matchedItemInDefaultList, 
                quantityAdd: 1,
                totalPrice: (+matchedItemInDefaultList?.giaBan || 0) * 1,
              };
              updatedData.push(updatedItem);
              return updatedData;
            }
        
            if (matchedItemInUpdateList) {
              const existingItemIndex = updatedData.findIndex(item => item.code === messageMQTTBrokerImportPage?.message);
      
              if (existingItemIndex !== -1) {
                updatedData[existingItemIndex] = {
                  ...updatedData[existingItemIndex],
                  quantityAdd: +updatedData[existingItemIndex].quantityAdd + 1,
                  totalPrice: (+updatedData[existingItemIndex].quantityAdd + 1 || 0) * (+updatedData[existingItemIndex].giaBan || 0),
                };
              } else { 
                updatedData.push(matchedItemInUpdateList);
              }
            } else {
              const newItem = {
                iD: updatedData.length,
                productName: 'nameProduct',
                productType: 'nameProductDad',
                typeCodeProduct: 'typeCodeProduct',
                code: messageMQTTBrokerImportPage?.message,
                dateCreated: 'dateCreated',
                giaVon: 'giaNhap',
                giaBan: '',
                quantity: 120,
                DvTinh: 'unitCaculation',
                quantityAdd: 1,
                totalPrice: '',
              };
        
              updatedData.unshift(newItem);
            };
        
            return updatedData;
          });
          break;   
  
        case 'append':
          setUpdatedDataImportPage((pre) => {
            const previousData = Array.isArray(pre) ? pre : [];
            let updatedData = [...previousData]; 
            const matchedItemInDefaultList = updatedData.find(
              (item) => item?.code === messageMQTTBrokerImportPage?.message
            );
        
            if (matchedItemInDefaultList) {
              const existingItemIndex = updatedData.findIndex(item => item.code === messageMQTTBrokerImportPage?.message);
        
              if (existingItemIndex !== -1) {
                updatedData[existingItemIndex] = {
                  ...updatedData[existingItemIndex],
                  quantityAdd: +updatedData[existingItemIndex].quantityAdd + 1
                };
              } else {
                updatedData.push(matchedItemInDefaultList);
              }
            } else {
              const newItem = {
                iD: updatedData.length,
                productName: 'nameProduct',
                productType: 'nameProductDad',
                typeCodeProduct: 'typeCodeProduct',
                code: messageMQTTBrokerImportPage?.message,
                dateCreated: 'dateCreated',
                giaVon: 'giaNhap',
                giaBan: 'giaBan',
                quantity: 120,
                DvTinh: 'unitCaculation',
                quantityAdd: 1,
                totalPrice: '',
              };
        
              updatedData.unshift(newItem);
            }
        
            return updatedData;
          });
          break;
  
        default:
          break;
      }
    }, [messageMQTTBrokerImportPage, selectedOptionFillDataScannerDevicesImportPage, rowDataDefault, setUpdatedDataImportPage]);

  const checkOpenDataBySearchFromVotePageButton = useCallback(() => {
    if (isOpenAddVotesPageBySearch === false) {
      if (isconnectedMQTTBrokerImportPage) {
        if (messageMQTTBrokerImportPage.length === 0) return null;
        switchSelectedOptionFillDataScannerDevices(); 
      } else {
        setUpdatedDataImportPage(rowDataDefault.map(row => ({
          ...row,
          quantityAdd: '',
          totalPrice: '',
        })));
      };

      return null;
    };
  
    const check = dataFetch.map(item => item?.voteFillInfo?.importPackageVote?.numberVote);
    if (check.includes(numberVoteShowing)) {
      const matchedItem = dataFetch.find(
        item => item?.voteFillInfo?.importPackageVote?.numberVote === numberVoteShowing
      );
  
      const dataToUpdate = matchedItem?.merchandise || [];
      const dataFillFormCreatVoteInfomation = matchedItem?.voteFillInfo?.importPackageVote || [];
      
      setUpdatedDataImportPage(dataToUpdate.length > 0 ? dataToUpdate : rowDataDefault.map(row => ({
        ...row,
        quantityAdd: '',
        totalPrice: '',
      })));

      setFormDataCreatVoteInfomation(dataFillFormCreatVoteInfomation);
      setSelectAll(true);
      setSelectedRows(dataToUpdate.map(row => row.code));
    }
    
  }, [dataFetch, isOpenAddVotesPageBySearch, numberVoteShowing, 
      rowDataDefault, isconnectedMQTTBrokerImportPage, setUpdatedDataImportPage,
      messageMQTTBrokerImportPage, switchSelectedOptionFillDataScannerDevices]);
  
  useEffect (() => {
    checkOpenDataBySearchFromVotePageButton();
  }, [checkOpenDataBySearchFromVotePageButton]);

  useEffect (() => {
    setData(updatedDataImportPage);
  }, [updatedDataImportPage]);

  const [, setFilterInventoryProducts] = useState ({
    title: 'Fill',
    type: 'object',
    properties: {
      originProduct: { type: 'string', title: 'Xuất xứ', enum: []},
      adressInventoryProduct: {type: 'string', title: 'Địa chỉ bảo hành'},
      phoneNumber: { type: 'number', title: 'Số điện thoại'},
      timeLimitInventory: {type: 'string', title: 'Số tháng bảo hành'},
      titleInventory: {type: 'string', title: 'Nội dung bảo hành'}
    },
  });

  const [searchForm, ] = useState ({
    title: 'Fill',
    type: 'object',
    properties: {
      search: { type: 'string', title: 'Tìm kiếm'},
    },
  });

  const [uiSchemaFormSearch, ] = useState({
    search: {
      "ui:widget": "text",
      "ui:placeholder": "Tìm kiếm theo tên, mã sản phẩm, barcode",
      "ui:options": {
        label: false, 
      },
    },
    "ui:submitButtonOptions": {
      norender: true,
    },
  });

  const handleInputChange = debounce((event) => {
    const checkInput = event?.formData?.search?.toLowerCase() || '';
    if (checkInput.length === 0) {
      if (updatedDataImportPage.length > 0) {
        setData(updatedDataImportPage);
      }
      else return '';
    }
    const result =  updatedDataImportPage.filter(item => 
                                                  item.code.toLowerCase().includes(checkInput) ||
                                                  item.productName.toLowerCase().includes(checkInput));
    setData(result.length > 0 ? result : updatedDataImportPage);
  }, 300);

  const [isOpenListVotePage, setIsOpenListVotePage] = useState(false);
  const {isShowButtonBackProductImportPage} = useAppContext();
  const {setIsShowButtonBackProductImportPage} = useAppContext();
  const {isShowButtonBackVoteListPage} = useAppContext();

  const handleOpenListVotePage = () => {
    setIsOpenListVotePage(!isOpenListVotePage);
    setIsShowButtonBackProductImportPage(false);
  }

  const handleCloseListVotePage = () => {
    setIsOpenListVotePage(!isOpenListVotePage);
    setIsShowButtonBackProductImportPage(!isShowButtonBackProductImportPage);
  }

  const [, setLoading] = useState(true);
  const [, setError] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://countriesnow.space/api/v0.1/countries');
        const data = await response.json();
  
        if (data.error === false) {
          const countryEnum = data.data.map((country) => country.country);
  
          setFilterInventoryProducts((prevSchema) => ({
            ...prevSchema,
            properties: {
              ...prevSchema.properties,
              originProduct: {
                ...prevSchema.properties.originProduct,
                enum: countryEnum,
              },
            },
          }));
  
          setStatusSetEnumContries(countryEnum);
        } else {
          setError('Không thể lấy danh sách quốc gia');
        }
      } catch (err) {
        setError('Có lỗi xảy ra khi lấy dữ liệu');
      } finally {
        setLoading(false);
      }
    };
  
    fetchCountries();
  }, []);
  

  const [uiSchema, ] = useState({
    "ui:submitButtonOptions": {
      norender: true,
    },
    description: {
      'ui:widget': 'hidden',
    },
  });

  // Trạng thái chọn tất cả và trạng thái hàng được chọn
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  // Hàm xử lý checkbox tổng
  const handleSelectAll = useCallback (() => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    if (newSelectAll) {
      setSelectedRows(data.map(row => row.code));
    } else {
      setSelectedRows([]);
    }
  }, [data, selectAll]);

  // Hàm xử lý checkbox từng hàng
  const handleSelectRow = (codeProduct) => {
    setSelectedRows(prevSelectedRows =>
      prevSelectedRows.includes(codeProduct)
        ? prevSelectedRows.filter(row => row !== codeProduct)
        : [...prevSelectedRows, codeProduct]
    );
  };

  // Chỉnh sửa dữ liệu trong ô
  const handleEditCell = (rowIndex, columnId, value) => {
    setData((oldData) =>
      oldData.map((row, index) => {
        if (index === rowIndex) {
          const updatedRow = {
            ...row,
            [columnId]: value || row[columnId],
          };
  
          if (columnId === 'quantityAdd' || columnId === 'giaBan') {
            updatedRow.totalPrice = 
              (updatedRow.quantityAdd || 0) * (updatedRow.giaBan || 0);
          }
  
          return updatedRow;
        }
        return row;
      })
    );
  };
  
  // Xóa sản phẩm
  const handleDelete = useCallback((code) => {
    setData(prevData => prevData.filter((row) => row.code !== code));
    setSelectedRows(prevSelectedRows => prevSelectedRows.filter(row => row !== code));
  }, []);
  
  //Đếm số lượng hàng đã Chọn
  const handleCountSelectedRows = () => {
    let count = selectedRows.length;
    return count;
  }

  const handleResetSelectedRows = () => {
    setSelectedRows('');
    setSelectAll('');
  }

  // Dữ liệu cột trong react-table
  const columns = useMemo(
    () => [
      {
        Header: (
          <input
            type="checkbox"
            id="selectAllCheckbox" 
            name="checkAll"
            checked={selectAll}
            onChange={handleSelectAll}
            style={{ width: '18px', height: '18px', cursor: 'pointer'}}
          />
        ),
        accessor: 'selection',
        Cell: ({ row }) => (
          <input
            type="checkbox"
            id={`selectedRowCheckbox-${row.index}`} 
            name={`checkRow-${row.index}`}  
            checked={selectedRows.includes(row.original.code)}
            onChange={() => handleSelectRow(row.original.code)}
            style={{ width: '15px', height: '15px', cursor: 'pointer'}}
          />
        ),
        disableSortBy: true,
      },
      {
        Header: 'Mã sản phẩm',
        accessor: 'code',
      },
      {
        Header: 'Tên sản phẩm',
        accessor: 'productName',
      },
      {
        Header: 'SL',
        accessor: 'quantityAdd',
        Cell: ({ value, row }) => {
          const [tempValue, setTempValue] = useState(value);
          return (
            <input
              type="number"
              id={`quantityAdd-${row.index}`}
              name={`quantityAdd-${row.index}`}
              value={tempValue === null ? "" : tempValue}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (inputValue === "" || (Number(inputValue) > 0)) {
                  setTempValue(inputValue === "" ? null : Number(inputValue));
                }
              }}
              onBlur={() => {
                if (tempValue !== null && tempValue > 0) {
                  handleEditCell(row.index, 'quantityAdd', tempValue);
                } else if (tempValue === null) {
                  setTempValue(value);
                }
              }}
              className="inputCell"
              style={{ display: 'flex', border: 'none', height: '30px', width: '80px'}}
            />
          );
        }
      },
      {
        Header: 'Đơn vị',
        accessor: 'DvTinh',
        Cell: ({ value, row }) => {
          const [tempValue, setTempValue] = useState(value);
          return (
            <input
              type="text"
              id={`DvTinh-${row.index}`}
              name={`DvTinh-${row.index}`}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onBlur={() => {
                handleEditCell(row.index, 'DvTinh', tempValue || value);
                if (!tempValue) setTempValue(value);
              }}
              className="inputCell"
              style={{ display: 'flex', border: 'none', height: '30px', width: '80px' }}
            />
          );
        },
      },
      {
        Header: 'Giá(VNĐ)',
        accessor: 'giaBan',
        Cell: ({ value, row }) => {
          const [tempValue, setTempValue] = useState(value);
  
          const formatCurrency = (value) => {
            return value
              ? value.toLocaleString('vi-VN', { style: 'decimal' })
              : '';
          };
  
          const handleChange = (e) => {
            const value = e.target.value.replace(/[^0-9]/g, '');
            setTempValue(value);
          };
  
          return (
            <input
              type="text"
              id={`giaBan-${row.index}`}
              name={`giaBan-${row.index}`}
              value={tempValue ? formatCurrency(Number(tempValue)) : ''}
              onChange={handleChange}
              onBlur={() => {
                handleEditCell(row.index, 'giaBan', tempValue ? Number(tempValue) : value);
                if (!tempValue) setTempValue(value);
              }}
              className="inputCell"
              style={{ display: 'flex', border: 'none', height: '30px' }}
            />
          );
        },
      },
      {
        Header: 'Tổng tiền',
        accessor: 'totalPrice',
        Cell: ({ value }) => {
          const formatCurrency = (value) => {
            return value
              ? value.toLocaleString('vi-VN', { style: 'decimal' })
              : '';
          };
  
          return <span>{formatCurrency(value)}</span>;
        },
      },
      {
        Header: 'Kho',
        accessor: 'package',
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ row }) => (
          <button
            id={`deleteButton-${row.index}`}
            name={`deleteButton-${row.index}`}
            onClick={() => handleDelete(row.original.code)}
            className={styles.buttonDeleteRowTable}
          >
            <RiDeleteBin6Line />
          </button>
        ),
      },
    ],
    [selectAll, selectedRows, handleDelete, handleSelectAll]
  );
  
  // Thiết lập bảng react-table
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });
  
  const [printDataImport, setPrintDataImport] = useState({});
  const [shouldPrintImport, setShouldPrintImport] = useState(false);

  const calculateTotals = () => {
    const totalQuantity = rows.reduce((sum, row) => sum + row.original.quantity, 0);
    const totalPrices = rows.reduce((sum, row) => sum + row.original.totalPrice, 0);

    const getCurrentDateTime = () => {
      const currentDate = new Date();
      const day = String(currentDate.getDate()).padStart(2, '0');
      const month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
      const year = currentDate.getFullYear();
      const hours = String(currentDate.getHours()).padStart(2, '0');
      const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    setPrintDataImport({
      maPhieu: formDataCreatVoteInfomation.numberVote,
      ngay: getCurrentDateTime(),
      chiNhanh: 'Chi nhánh trung tâm',
      nhaCungCap: 'Viet Nam',
      diaChi: formDataCreatVoteInfomation.adress,
      tongSoLuong: totalQuantity,
      tongTienHang: totalPrices.toLocaleString('vi-VN', { style: 'decimal' }) || '',
    });
  };

  const handlePrintTable = () => {
    calculateTotals();
    setShouldPrintImport(true);
  };

  useEffect(() => {
    if (shouldPrintImport && printDataImport.maPhieu) {
      const tableElement = document.querySelector('.printable-table').cloneNode(true);

      tableElement.querySelectorAll('th:nth-child(1), th:last-child').forEach(el => el.remove());
      tableElement.querySelectorAll('td:nth-child(1), td:last-child').forEach(el => el.remove());

      const tableContent = tableElement.innerHTML;

      const printWindow = window.open('', '_blank');

      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <style>
              /* Reset margin and padding */
              * { margin: 0; padding: 0; box-sizing: border-box; }

              body {
                font-family: Arial, sans-serif;
                font-size: 14px;
                line-height: 1.6;
                color: #000;
              }

              h1, h2 {
                text-align: center;
                margin: 10px 0;
              }

              table {
                width: 100%;
                border-collapse: collapse;
                margin: 10px 0;
              }

              th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: center;
              }

              th {
                background-color: #f2f2f2;
                font-weight: bold;
              }

              .info {
                margin: 10px 0;
                font-size: 14px;
              }

              .totals {
                float: right;
                margin: 10px 0;
                text-align: right;
              }

              .footer {
                display: flex;
                justify-content: space-between;
                margin-top: 40px;
                font-weight: bold;
              }

              .footer div {
                text-align: center;
              }
            </style>
          </head>
          <body onload="window.print(); window.close();">
            <h1>PHIẾU NHẬP HÀNG</h1>
            <h2>Mã phiếu: ${printDataImport.maPhieu}</h2>
            <p style="text-align: center; font-style: italic;">${printDataImport.ngay}</p>

            <!-- Thông tin chung -->
            <div class="info">
              <p><b>Chi nhánh nhập:</b> ${printDataImport.chiNhanh}</p>
              <p><b>Nhà cung cấp:</b> ${printDataImport.nhaCungCap}</p>
              <p><b>Địa chỉ:</b> ${printDataImport.diaChi}</p>
            </div>

            <!-- Bảng chi tiết hàng hóa -->
            <div>${tableContent}</div>

            <!-- Tổng hợp thông tin thanh toán -->
            <div class="totals">
              <p><b>Tổng số lượng hàng:</b> ${printDataImport.tongSoLuong}</p>
              <p><b>Tổng tiền hàng:</b> ${printDataImport.tongTienHang}</p>
            </div>

            <!-- Ghi chú và chữ ký -->
            <p><b>Ghi chú:</b> ghi chú 1</p>

            <div class="footer">
              <div>Nhà cung cấp</div>
              <div>Người lập</div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();

      setShouldPrintImport(false);
    }
  }, [shouldPrintImport, printDataImport]);

  const handleScanningDataModeImportPage = () => {
      if (!isOpenAddVotesPageBySearch) {
        if (isConnectedRefImportPages.current && isConnectedScanFromDevicesRef.current) {
          toast.success("Máy scan sẵn sàng!", { autoClose: 2000 });
        } else {
          toast.info("Đang kết nối đến máy scan...", { autoClose: 2000 });
  
          handleConnectingMQTTBrokerImportPage();
  
          setTimeout(() => {
            if (isConnectedRefImportPages.current && isConnectedScanFromDevicesRef.current) {
              toast.success("Kết nối thành công đến MQTT Broker! Dữ liệu sẵn sàng...", { autoClose: 2000 });
            } else {
              toast.error("Kết nối thất bại đến máy scan!", { autoClose: 2000 });
            }
          }, 5000);
        }
      }
    };

  const handleOpenScanDataMode = () => {
    if (!isOpenAddVotesPageBySearch) {
      setIsOpenCreateNewProduct(!isOpenCreateNewProduct);
    }
  };
  
  const handleOpenCreatNewProduct = () => {
    setIsOpenCreateNewProduct(!isOpenCreateNewProduct);
  }

  const handleCloseCreatNewProduct = () => {
    setIsOpenCreateNewProduct(!isOpenCreateNewProduct);
  }

  const handleOpenListFillProduct = () => {
    setIsOpenListFillProduct(!isOpenListFillProduct);
  }

  const handleCloseListFillProduct = () => {
    setIsOpenListFillProduct(!isOpenListFillProduct);
    setIsOpenTaskFormEnumsList(false);
  }

  const handleRefreshListTable = () => {
    setData(updatedDataImportPage);
  }

  const handleOpenTaskFormEnumsList = () => {
    setIsOpenTaskFormEnumsList(!isOpenTaskFormEnumsList);
  };

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectSearchFormEnums = (value) => {
    setSelectedValue(value);
    setIsOpenTaskFormEnumsList(!isOpenTaskFormEnumsList);
  };

  const handleSearchTypeProductTask = () => {
    setData(updatedDataImportPage.filter(item => item.productType.toLowerCase().includes(selectedValue.toLowerCase())));
  };

  const handleDismissButton = () => {
    setSelectedValue('');
    setIsOpenListFillProduct(!isOpenListFillProduct);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpenTaskFormEnumsList(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChangeFormCreatVoteInfomationData = (data) => {
    setFormCreatVoteInfomationData(data.formData);
  };

  const handleSubmitFormCreatVoteInfomationData = (data) => {
    const result = data?.formData;
    setFormCreatVoteInfomationData(result);
  };

  const handleSaveDataAllForm = async () => {
    await formCreatVoteInfomationDataRef.current.submit();

    const result = {
      [formCreatVoteInfomation?.title]: formCreatVoteInfomationData || {},
    };

    const requiredFieldsFormCreatVoteInfomation = formCreatVoteInfomation?.required || [];

    const isFormComplete = (formData, requiredFields) => {
      return requiredFields.every(field => formData[field] !== undefined && formData[field] !== "");
    };

    const isSPFormComplete = isFormComplete(result[formCreatVoteInfomation?.title], requiredFieldsFormCreatVoteInfomation);

    if (!isSPFormComplete) {
      const notifyError = () => toast.error("Vui lòng điền đầy đủ thông tin bắt buộc", {
        autoClose: 2000
      });
      notifyError();
      return null;
    };

    const isSelectedRowComplete = selectedRows.length > 0;

    if (!isSelectedRowComplete) {
      const notifyError = () => toast.error("Bạn chưa chọn sản phẩm nào!", {
        autoClose: 2000
      });
      notifyError();
      return null;
    }

    const rowDataSelected = data.filter(item => selectedRows.some(selected => selected === item.code));
    try {
      const dataSend = {
        voteFillInfo: result,
        merchandise: rowDataSelected
      };
      const functionName = 'add_voteImportPackage_INLIST_FC';
      const response = await app?.currentUser?.callFunction(functionName, dataSend);
      
      const notifySuccess  = () => toast.success(response.message, {
        autoClose: 2000
      });
      const notifyError  = () => toast.error(response.message, {
        autoClose: 2000
      });

      if (response.success === true) {
        notifySuccess();
        setTimeout(() => {
          setIsReloadDataImportVote(true);
        }, 3000);
      };
      if (response.success === false) {
        notifyError();
      }
      
      return response;
    } catch (error) {
      console.log(error.error);
    }
  };

  const handleChangeFillDataScannerDevices = (event) => {
    setSelectedOptionFillDataScannerDevicesImportPage(event.target.value);
    if (isconnectedMQTTBrokerImportPage) {
      switch (event.target.value) {
        case 'default':
          setMessageMQTTBrokerImportPage('');
          setUpdatedDataImportPage(rowDataDefault.map(row => ({
            ...row,
            quantityAdd: '',
            totalPrice: '',
          })));
          break;
        case 'refresh':
          setMessageMQTTBrokerImportPage('');
          setUpdatedDataImportPage([]);
          break;
        case 'append':
          setMessageMQTTBrokerImportPage('');
          setUpdatedDataImportPage(rowDataDefault.map(row => ({
            ...row,
            quantityAdd: '',
            totalPrice: '',
          })));
          break;
        default:
          break;
      }
    }
  };

  if (app.currentUser === null || statusSetEnumContries.length === 0) {
    return <div><LoadingPage /></div>
  };

  return (
    <div className={styles.containerProducts}>
      {isOpenListVotePage ? (
        <div className={styles.newShowListVotePageContainer}>
          {isShowButtonBackVoteListPage && (
            <div className={styles.closeButtonListVotePage} onClick={handleCloseListVotePage}>
              <button><IoArrowBackOutline size={20}/></button>
            </div>
          )}
          <div className={styles.showListVotePage}>
            <ListVotePage />
          </div>
        </div>
        ) : (
        <>
          <div className={styles.header}>
            <div className={styles.headerName}>
              <span>Nhập kho</span>
            </div>
            {selectedRows.length > 0 && (
              <div className={styles.showCountSelectedRows} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', fontSize: '13px', gap: '5px', whiteSpace: 'nowrap'}}>
                <span>Đã chọn</span>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                  {handleCountSelectedRows()}
                  <button className={styles.buttonCloseSelectedRow} onClick={handleResetSelectedRows}>X</button>
                </div>
              </div>
            )}
            <div className={styles.headerButton}>
              {selectedRows.length > 0 && (
                <button className={styles.headerButtonOperation}>
                  <CiMenuKebab />
                  <span>Thao tác</span>

                  <div className={styles.droplistOperationActive}>
                    <div className={styles.buttonPrinteOperation} onClick={handlePrintTable}>
                      <IoMdPrint size={20}/>
                      <span>In</span>
                    </div>
                    <div className={styles.buttonExportExcelOperation}>
                      <FaFileExcel size={18}/>
                      <span>Xuất file Excel</span>
                    </div>
                  </div>
                </button>
              )}
              <button className={styles.headerButtonImport}>
                <LuImport />
                <span>Import Excel</span>
              </button>
              <button className={styles.headerButtonList} onClick={handleOpenListVotePage}>
                <FaThList />
                <span>Danh sách phiếu</span>
              </button>
              <button className={styles.headerButtonSave} onClick={handleSaveDataAllForm}>
                <RiSave3Fill />
                <span>Lưu</span>
              </button>
            </div>
          </div>

          <div className={styles.importProductBody}>
            <div className={styles.addProduct}>
              <div className={styles.searchProductLayerHeader}>
                <div className={styles.searchProductName}>
                  <span>Sản phẩm</span>
                </div>
                <div className={styles.searchProductForm}>
                  <Form
                    className={styles.custom_formSearch}
                    schema={searchForm}
                    validator={validator}
                    uiSchema={uiSchemaFormSearch}
                    onChange={(e) => handleInputChange(e)}
                  />
                </div>
                <div className={styles.activeProductIcon}>
                  <div className={styles.methodSetupScannerDevices} onClick={handleOpenScanDataMode}>
                    <MdOutlineSettings size={20}/>
                    <div className={styles.methodSetupScannerDevicesDescription}>
                      <span>Chế độ cài đặt máy quét</span>
                    </div>
                  </div>
                  <div className={styles.methodFillProductIcon} onClick={handleScanningDataModeImportPage}>
                    <RiQrScan2Line size={20}/>
                    <div className={styles.methodFillProductDescription}>
                      <span>Chế độ nhập</span>
                    </div>
                  </div>
                  <div className={styles.listFillProductIcon} onClick={handleOpenListFillProduct}>
                    <PiListDashesBold size={20} />
                    <div className={styles.listFillProductDescription}>
                      <span>Chọn nhóm hàng</span>
                    </div>
                  </div>
                  {isOpenListFillProduct && (
                    <div className={styles.listFillProductTaskOverlay}>
                      <div className={styles.listFillProductTaskLayer}>
                        <div className={styles.listFillProductTaskHeader}>
                          <div className={styles.listFillProductTaskHeaderName}>
                            <span>Thêm hàng hóa từ nhóm hàng</span>
                          </div>
                          <button className={styles.listFillProductTaskHeaderActive} onClick={handleCloseListFillProduct}>
                            <span>X</span>
                          </button>
                        </div>
                        <div className={styles.listFillProductTaskBody}>
                          <div className={styles.listFillProductTaskBodySearchForm}>
                            <div className={styles.listFillProductTaskBodySearchFormName}>
                              <label htmlFor="product-type">Nhóm hàng:</label>
                              <div className={styles.selectBoxByPressActive}>
                                <div className={styles.selectBoxOutput} onClick={handleOpenTaskFormEnumsList}> 
                                  {selectedValue || "---Lựa chọn---"}
                                </div>
                                {isOpenTaskFormEnumsList && (
                                  <div className={styles.listFillProductTaskBodySearchFormEnums} ref={dropdownRef}>     
                                    <div className={styles.optionsContainer}>
                                      <input
                                        type="text"
                                        placeholder="Tìm kiếm"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className={styles.searchBoxInputLayer}
                                      />
                                      <div className={styles.optionListContainer}>
                                        <div className={styles.optionsList}>
                                          {filteredOptions.map(option => (
                                            <li
                                              key={option}
                                              onClick={() => handleSelectSearchFormEnums(option)}
                                              className={styles.optionItem}
                                            >
                                              {option}
                                            </li>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}                      
                              </div>                                                   
                            </div>                
                          </div>

                          <div className={styles.listFillProductTaskBodyButton}>
                            <button className={styles.saveButtonTaskBody} onClick={handleSearchTypeProductTask}>
                              <FaCheckCircle />
                              <span>Xong</span>
                            </button>
                            <button className={styles.dismissButtonTaskBody} onClick={handleDismissButton}>
                              <FaBan />
                              <span>Bỏ qua</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className={styles.addNewProductIcon} onClick={handleOpenCreatNewProduct}>
                    <GoPlus size={20} />
                    <div className={styles.addNewProductDescription}>
                      <span>Thêm hàng hóa mới</span>
                    </div>
                  </div>
                  
                  <div className={styles.refreshListIcon} onClick={handleRefreshListTable}>
                    <LuRefreshCcw size={20} />
                    <div className={styles.refreshListTable}>
                      <span>Làm mới danh sách</span>
                    </div>
                  </div>
                </div>  

                {isOpenCreateNewProduct && (
                  <div className={styles.AddNewItemPage}>
                    <div className={styles.AddNewItemPageOverLay}>
                      <div className={styles.AddNewItemPageLayer}>
                        <div className={styles.AddNewItemPageHeader}>
                          <div className={styles.AddNewItemPageHeaderName}>
                            <span>Cài đặt máy quét và dữ liệu</span> 
                          </div>
                          <div className={styles.AddNewItemPageHeaderIconX} onClick={handleCloseCreatNewProduct}>
                            <button>X</button>
                          </div>
                        </div>
                        <div className={styles.AddNewItemPageBody}>
                          <div className={styles.AddNewItemPageBodyLayer}>
                            <div className={styles.AddNewItemPageBodyList}>                      
                              <div className={styles.overallDevices}>
                                <div className={styles.overallDevicesHeader}>
                                  <strong>Thiết bị</strong>
                                </div>

                                <div className={styles.overallDevicesDetails}>
                                  <span><strong>Tên thiết bị:</strong> Image Scan Code Devices</span>
                                  <span><strong>Số seris:</strong> 123456789</span>
                                  <span><strong>Loại kết nối:</strong> WIFI</span>
                                  <span><strong>Trạng thái kết nối:</strong> ON/OFF</span>
                                </div>

                                <div className={styles.overallDevicesControl}>
                                  <button>Cấu hình</button>
                                </div>
                              </div>
                            </div>

                            <div className={styles.AddNewItemPageBodyList}>
                              <div className={styles.setupDataShowFromScannerDevices}>
                                <div className={styles.setupDataShowFromScannerDevicesHeader}>
                                  <strong>Nhập dữ liệu</strong>
                                </div>
                          
                                <div className={styles.setupDataShowFromScannerDevicesChoose}>
                                  <label htmlFor="dataTypeSelector" style={{ marginRight: "10px" }}>
                                    Chọn kiểu nhập:
                                  </label>
                                  <select
                                    id="dataTypeSelector"
                                    value={selectedOptionFillDataScannerDevicesImportPage}
                                    onChange={handleChangeFillDataScannerDevices}
                                    style={{height: '30px'}}
                                  >
                                    <option value="default">Mặc định</option>
                                    <option value="refresh">Làm mới dữ liệu</option>
                                    <option value="append">Chèn vào dữ liệu cũ</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className={styles.saveconfigDataScannerDevicesButton}>
                            <button>Lưu thay đổi</button>
                          </div>                       
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.fillInputTable}>
                <div style={{width: '100%', height: '500px', overflowX: 'auto'}} className="printable-table">
                  <table
                    {...getTableProps()}
                    style={{ width: '100%', borderCollapse: 'collapse' }}
                  >
                    <thead>
                      {headerGroups.map((headerGroup) => {
                        const { key, ...headerGroupProps } = headerGroup.getHeaderGroupProps();
                        return (
                          <tr
                            key={key}
                            {...headerGroupProps}
                            style={{
                              position: 'sticky',
                              top: '0',
                              backgroundColor: '#f2f2f2',
                              zIndex: '1',
                              whiteSpace: 'nowrap',
                              color: 'black',
                              borderBottom: '1px solid black',
                            }}
                          >
                            {headerGroup.headers.map((column) => {
                              const { key, ...columnProps } = column.getHeaderProps();
                              return (
                                <th
                                  key={key}
                                  {...columnProps}
                                  style={{
                                    padding: '10px',
                                    textAlign: 'left',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {column.render('Header')}
                                </th>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                      {rows.map((row) => {
                        prepareRow(row);

                        const { key, ...rowProps } = row.getRowProps();
                        return (
                          <tr
                            key={key}
                            {...rowProps}
                            style={{ borderBottom: '1px solid lightgray' }}
                          >
                            {row.cells.map((cell) => {
                              const { key, ...cellProps } = cell.getCellProps();
                              return (
                                <td
                                  key={key}
                                  {...cellProps}
                                  style={{ padding: '10px' }}
                                >
                                  {cell.render('Cell')}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className={styles.detailCreateImportPakage}>
              <Form
                ref={formCreatVoteInfomationDataRef} 
                className={styles.custom_formImportPackage}
                schema={formCreatVoteInfomation}
                formData={formDataCreatVoteInfomation}
                validator={validator}
                uiSchema={uiSchema}
                showErrorList={false}
                onChange={handleChangeFormCreatVoteInfomationData}  
                onSubmit={handleSubmitFormCreatVoteInfomationData}
                onError={() => {}}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AddNewItemImportPackagePage;
