
import React, {useState, useMemo, useEffect} from 'react';
import styles from './styles.module.css'
import * as Realm from 'realm-web';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import { useTable, useRowSelect } from 'react-table';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import LoadingPage from '../../../loadingPage/loadingPage';
import uiSchema from './uiSchema';
import AddNewItemImportPackagePage from '../../products/addNewItemImportPackage/AddNewItemsPage'

import { FaShare } from "react-icons/fa";
import { GiCheckMark } from "react-icons/gi";
import { IoIosPrint } from "react-icons/io";
import { ImCancelCircle } from "react-icons/im";
import { useAppContext } from '../../../appContext/AppContext';

const app = new Realm.App({ id: process.env.REACT_APP_REALM_ID });

const VotePage = () => {
  const [formDataSearch, setFormData] = useState({}); 
  const [formSearchVotes,] = useState ({
    title: 'Fill',
    type: 'object',
    properties: {
      numberVote: { type: 'string', title: 'Số phiếu' },
      descriseVote: {type: 'string', title: 'Diễn giải'},
      dateVote: { type: 'string', format: 'date', title: 'Ngày tạo' },
      totalWareHouse: {type: 'string', title: 'Tất cả kho'},
    },
  });

  const columns = useMemo(
    () => [
      { Header: 'Ngày tạo', accessor: 'createDay', width: 200 },
      { Header: 'Số phiếu', accessor: 'numberVote', width: 160 },
      { Header: 'Người xuất', accessor: 'importer', width: 160 },
      { Header: 'Người nhận', accessor: 'reciver', width: 160 },
      { Header: 'Diễn giải', accessor: 'description', width: 160 },
      { Header: 'Người tạo', accessor: 'authorCreated', width: 160 },
      { Header: 'Tổng tiền', accessor: 'totalPrice', width: 160 },
    ],
    []
  );

  const rowDataNone = useMemo (() => [
    {numberVote: 0, description: 'Không có dữ liệu', createDay: null, authorCreated: null, totalPrice: null, reciver: null, importer: null}], []
  );

  const [dataRowDefault, setRowDataDefault] = useState([]);
  const [dataFetch, setDataFetch] = useState([]);
  const [data, setData] = useState(dataRowDefault);
  const {isReloadDataImportVote} = useAppContext();
  const {setIsReloadDataImportVote} = useAppContext();

  /* Dữ liệu hàng importPackageVote */
  const {setUpdatedDataImportPage} = useAppContext();
  const {rowDataDefault} = useAppContext();

  /* MQTT */
  const { setMessageMQTTBrokerImportPage } = useAppContext();

  useEffect(() => {
    try {
      async function fectchData() {
        const functionName = 'call_importVote_INLIST_FC';
        const response = await app?.currentUser?.callFunction(functionName);
        const rowDataDefault = response.map(item => item?.voteFillInfo?.importPackageVote);
        setRowDataDefault(rowDataDefault);
        setDataFetch(response);
        return response;
      }
      fectchData();
      if (isReloadDataImportVote) {
        fectchData();
      };
    } catch (error) {
      return error.error;
    }
    finally {
      setIsReloadDataImportVote(false);
    }
  }, [isReloadDataImportVote, setIsReloadDataImportVote]);
 
  const [isOpenTotalImportVote, setIsOpenTotalImportVote] = useState(true);
  const [isOpenApprovedImportVote, setIsOpenApprovedImportVote] = useState(false);
  const [isOpenNotYetApprovedImportVote, setIsOpenNotYetApprovedImportVote] = useState(false);

  const handleSwitchOpenImportVote = (lable) => {
    switch (lable) {
      case 'Tất cả':
        setIsOpenTotalImportVote(!isOpenTotalImportVote);
        setIsOpenApprovedImportVote(false);
        setIsOpenNotYetApprovedImportVote(false);
        break;
      case 'Đã duyệt':
        setIsOpenApprovedImportVote(!isOpenApprovedImportVote);
        setIsOpenTotalImportVote(false);
        setIsOpenNotYetApprovedImportVote(false);
      break;
      case 'Chưa duyệt':
        setIsOpenNotYetApprovedImportVote(!isOpenNotYetApprovedImportVote);
        setIsOpenTotalImportVote(false);
        setIsOpenApprovedImportVote(false);
      break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (dataRowDefault.length === 0) {
      setData(rowDataNone);
    } else {
      if (isOpenTotalImportVote) setData(dataRowDefault);
      if (isOpenApprovedImportVote) setData(dataRowDefault.filter(item => item.description === 'Đã duyệt'));
      if (isOpenNotYetApprovedImportVote) setData(dataRowDefault.filter(item => item.description === 'Chưa duyệt'));
    }
  }, [dataRowDefault, rowDataNone, isOpenTotalImportVote, isOpenApprovedImportVote, isOpenNotYetApprovedImportVote]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} = useTable({
    columns,
    data,
  }, useRowSelect );

  const handleInputChangeFormSearch = (event) => {
    const checkInputNumberVotes = String(event?.formData?.numberVote || '').toLowerCase();
    const checkInputCreateDay = event?.formData?.dateVote || '';
  
    const result = dataRowDefault.filter(item => {
      const numberVotesMatch = String(item.numberVote).toLowerCase().includes(checkInputNumberVotes);
      const createDayMatch = item.createDay.includes(checkInputCreateDay);
  
      return numberVotesMatch && createDayMatch;
    });
  
    setData(result.length > 0 ? result : dataRowDefault);
  };
  
  const handleInputOnChangeFormSearch = (event) => {
    const checkInput = event?.formData?.numberVote?.toLowerCase() || '';
    if (checkInput.length === 0) setData(dataRowDefault);
  }

  const handleRefreshInputSearch = () => {
    setFormData({});
    setData(dataRowDefault);
  }

  const [expandedRowId, setExpandedRowId] = useState(null);
  const [text, setText] = useState("");
  const {setNumberVoteShowing} = useAppContext();
  const [dataClickingRow, setDataClickingRow] = useState('');
  
  const handleRowClick = (row) => {
    setExpandedRowId(expandedRowId === row.original.numberVote ? null : row.original.numberVote);
    setNumberVoteShowing(row.original.numberVote);

    setDataClickingRow({
      iD: row.original.iD || '',
      createDay: row.original.createDay|| '',
      numberVote: row.original.numberVote || '',
      description: 'Đã duyệt',
    });
  };

  const dataRowTableChildren = (row) => {
    const check = dataFetch.map(item => item?.voteFillInfo?.importPackageVote?.numberVote);
    const dataNone = [{
      productId: '',
      productName: 'Không có dữ liệu',
      quantity: '',
      unitPrice: '',
      discount: '',
      importPrice: '',
      total: ''
    }];
  
    if (check.includes(row.original.numberVote)) {
      const matchedItem = dataFetch.find(
        item => item?.voteFillInfo?.importPackageVote?.numberVote === row.original.numberVote
      );

      return matchedItem?.merchandise || dataNone;
    }
  
    return dataNone;
  };

  const fillDataDetailsSummary = (row, lableName) => {
    const check = dataFetch.map(item => item?.voteFillInfo?.importPackageVote?.numberVote);

    if (check.includes(row.original.numberVote)) {
      const matchedItem = dataFetch.find(
        item => item?.voteFillInfo?.importPackageVote?.numberVote === row.original.numberVote
      );
      switch (lableName) {
        case 'Tổng số lượng':
          return matchedItem?.merchandise?.reduce((sum, item) => {return sum + (item.quantityAdd || 0)}, 0) || 0;
        case 'Tổng số mặt hàng':
          return matchedItem?.merchandise.length || 0;
        case 'Tổng tiền hàng':
          return matchedItem?.merchandise?.reduce((sum, item) => {return sum + (item.totalPrice || 0)}, 0) || 0;
        case 'Giảm giá':
          return 0;
        case 'Tổng cộng':
          return matchedItem?.merchandise?.reduce((sum, item) => {return sum + (item.totalPrice || 0)}, 0) - 0 || 0;
        default:
          return null;
      }
    };
    return null;
  };
   
  // Cấu hình cột cho AG Grid
  const columnDefs = useMemo(
    () => [
      { headerName: 'Mã hàng', field: 'code' },
      { headerName: 'Tên hàng', field: 'productName' },
      { headerName: 'Số lượng', field: 'quantityAdd' },
      { headerName: 'Đơn giá', field: 'giaBan' },
      { headerName: 'Giảm giá', field: 'discount' },
      { headerName: 'Giá nhập', field: 'giaBan' },
      { headerName: 'Thành tiền', field: 'totalPrice' }
    ],
    []
  );

  const renderShowInfoProduct = (row) => {
    return (
      <div className={styles.voteDetailsContainer}>
        <div className={styles.voteDetailsInfoName}>
          <div className={styles.voteDetailsInfoNameLayer}>
            <h2>Thông tin</h2>
          </div>
        </div>
        <div className={styles.voteDetails}>
          {/* Thông tin đơn hàng */}
          <div className={styles.voteDetailsHeader}>
            <div className={styles.voteDetailsHeaderLeft}>
              <div className={styles.voteDetailsHeaderLeftData}>
                <div className={styles.dataShow}>
                  <span>Mã nhập hàng:</span>
                  <strong>{row.original.numberVote}</strong>
                </div>
                <div className={styles.dataShow}>
                  <span>Thời gian:</span>
                  <span>{row.original.createDay}</span>
                </div>

                <div className={styles.dataShow}>
                  <span>Nhà cung cấp:</span>
                  <span>{row.original.splyler || ''}</span>
                </div>

                <div className={styles.dataShow}>
                  <span>Người tạo:</span>
                  <span>{row.original.authorCreated}</span>
                </div>

                <div className={styles.dataShow}>
                  <span>Trạng thái:</span>
                  <span>{row.original.status || ''}</span>
                </div>

                <div className={styles.dataShow}>
                  <span>Chi nhánh:</span>
                  <span>{row.original.places || ''}</span>
                </div>

                <div className={styles.dataShow}>
                  <span>Người nhập:</span>
                  <span>{row.original.importer}</span>
                </div>
              </div>
            </div>
            <div className={styles.voteDetailsHeaderRight}>
              <div className={styles.textareaInput}>
                <textarea
                  placeholder="Ghi chú..."
                  className="note-input"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                ></textarea>
              </div>  
            </div>
          </div>
    
          {/* Bảng sản phẩm */}
          <div className={styles.voteDetailsTable}>
            <div className="ag-theme-alpine" style={{ height: '400px', width: '100%' }}>
              <AgGridReact
                rowData={dataRowTableChildren(row)}
                columnDefs={columnDefs}
                pagination={true}
                paginationPageSize={10}
                paginationPageSizeSelector={[10, 20, 50, 100]} 
              />
            </div>
          </div>
    
          {/* Thông tin tổng kết */}
          <div className={styles.voteDetailsSummary}>
            <div className={styles.voteDetailsSummaryLayer}>
              <div className={styles.dataShowSummary}>
                <span>Tổng số lượng:</span>
                <span>{fillDataDetailsSummary(row, 'Tổng số lượng') || 0 }</span>
              </div>

              <div className={styles.dataShowSummary}>
                <span>Tổng số mặt hàng:</span>
                <span>{fillDataDetailsSummary(row, 'Tổng số mặt hàng') || 0 }</span>
              </div>

              <div className={styles.dataShowSummary}>
                <span>Tổng tiền hàng:</span>
                <span>{fillDataDetailsSummary(row, 'Tổng tiền hàng') || 0 }</span>
              </div>

              <div className={styles.dataShowSummary}>
                <span>Giảm giá:</span>
                <span>{fillDataDetailsSummary(row, 'Giảm giá') || 0 }</span>
              </div>

              <div className={styles.dataShowSummary}>
                <span>Tổng cộng:</span>
                <span>{fillDataDetailsSummary(row, 'Tổng cộng') || 0 }</span>
              </div>
            </div>
          </div>
    
          {/* Các nút hành động */}
          <div className={styles.voteDetailsButton}>
            <div className={styles.voteDetailsButtonLayer}>
              <button className={styles.openVotesButton} onClick={handleOpenVotePageBySearch}>
                <FaShare size={20}/>
                <span>Mở phiếu</span>
              </button>
              <button className={`${styles.approvedVotesButton} 
                ${row.original.description === 'Đã duyệt' ? styles.active : ''} `} 
                onClick={() => handleOpenConfirmApprovedImportVote(row)}>
                <GiCheckMark size={20}/>
                <span>Duyệt phiếu</span>
              </button>
              <button className={styles.printCodeVotesButton}>
                <IoIosPrint size={20}/>          
                <span>In tem mã</span>
              </button>
              <button className={`${styles.cancelCodeVotesButton} 
                ${row.original.description === 'Đã duyệt' ? styles.active : ''} `} 
                onClick={() => handleOpenConfirmDeleteImportVote(row)}>
                <ImCancelCircle size={20}/>            
                <span> Hủy bỏ</span>
              </button>

              {/* Mở phiếu xác nhận xóa đơn */}
              {isOpenConfirmDeleteImportVote && (
                <div className={styles.confirmDeleteImportVote}>
                  <div className={styles.confirmDeleteImportVoteOverlay}>
                    <div className={styles.confirmDeleteImportVoteBody}>
                      <div className={styles.confirmDeleteImportVoteBodyHeader}>
                        <strong>Xóa phiếu nhập hàng </strong>
                        <button onClick={handleCloseConfirmDeleteImportVote}>X</button>
                      </div>
                      <div className={styles.confirmDeleteImportVoteAnnouncation}>
                        <span>Hệ thống sẽ xóa hoàn toàn phiếu <strong>{row.original.numberVote || 'Không xác định'} </strong>
                          trong dữ liệu lưu trữ nhưng vẫn giữ thông tin hàng hóa trong các giao dịch lịch sử nếu có. 
                          Bạn có chắc chắn muốn xóa?
                        </span>
                      </div>
                      <div className={styles.buttonActiveContainer}>
                        <button className={styles.confirmButton} onClick={() => handleDeleteImportVote(row)}>Xác nhận</button>
                        <button className={styles.cancelButton} onClick={handleCloseConfirmDeleteImportVote}>Hủy</button>
                      </div>
                    </div>
                  </div>
                </div>              
              )}

              {/* Mở phiếu xác nhận duyệt đơn*/}
              {isOpenConfirmApprovedImportVote && (
                <div className={styles.confirmDeleteImportVote}>
                  <div className={styles.confirmDeleteImportVoteOverlay}>
                    <div className={styles.confirmDeleteImportVoteBody}>
                      <div className={styles.confirmDeleteImportVoteBodyHeader}>
                        <strong>Duyệt phiếu nhập hàng </strong>
                        <button onClick={handleCloseConfirmApprovedImportVote}>X</button>
                      </div>
                      <div className={styles.confirmDeleteImportVoteAnnouncation}>
                        <span>Bạn có chắc chắn muốn duyệt phiếu nhập hàng <strong>{row.original.numberVote || 'Không xác định'} </strong>
                              không? Sau khi duyệt, trạng thái của phiếu sẽ được cập nhật và không thể chỉnh sửa.
                        </span>
                      </div>
                      <div className={styles.buttonActiveContainer}>
                        <button className={styles.confirmButton} onClick={() => handleApprovedImportVote(row)}>Xác nhận</button>
                        <button className={styles.cancelButton} onClick={handleCloseConfirmApprovedImportVote}>Hủy</button>
                      </div>
                    </div>
                  </div>
                </div>              
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const [isOpenAddVotesPage, setIsOpenAddVotesPage] = useState(false);
  const {isOpenAddVotesPageBySearch} = useAppContext();
  const {setIsOpenAddVotesPageBySearch} = useAppContext();
  const {setIsShowButtonBackProductVoteListPage} = useAppContext();
  const [isOpenConfirmDeleteImportVote, setIsOpenConfirmDeleteImportVote] = useState(false);
  const [isOpenConfirmApprovedImportVote, setIsOpenConfirmApprovedImportVote] = useState(false);

  const handleErrors = (errors) => {
    console.log("Validation errors:", errors);
  };

  const handleAddVotesPage = () => {
    setIsOpenAddVotesPage(!isOpenAddVotesPage);
    setMessageMQTTBrokerImportPage('');
    setUpdatedDataImportPage(rowDataDefault.map(row => ({
      ...row,
      quantityAdd: '',
      totalPrice: '',
    })));
  };

  const handleCloseAddVotesPage = () => {
    setIsOpenAddVotesPage(!isOpenAddVotesPage);
    setMessageMQTTBrokerImportPage('');
    setUpdatedDataImportPage(rowDataDefault.map(row => ({
      ...row,
      quantityAdd: '',
      totalPrice: '',
    })));
  };

  const handleOpenVotePageBySearch = () => {
    setIsOpenAddVotesPageBySearch(!isOpenAddVotesPageBySearch);
    setIsShowButtonBackProductVoteListPage(false);
  };

  const handleCloseAddVotesPageBySearch = () => {
    setIsOpenAddVotesPageBySearch(!isOpenAddVotesPageBySearch);
    setIsShowButtonBackProductVoteListPage(true);
  };

  const handleOpenConfirmApprovedImportVote = (row) => {
    if (row.original.description === 'Đã duyệt') return null;
    setIsOpenConfirmApprovedImportVote(!isOpenConfirmApprovedImportVote);
  };

  const handleCloseConfirmApprovedImportVote = () => {
    setIsOpenConfirmApprovedImportVote(!isOpenConfirmApprovedImportVote);
  };

  const updateQuanlityApprovedExportVote = async (row) => {
    const groupedStausExportVotes = () => {
      if (!dataFetch || !Array.isArray(dataFetch)) {
        console.error("Dữ liệu đầu vào không hợp lệ!");
        return {};
      };
      const typeStatusVotes = dataFetch.filter(item => item?.voteFillInfo?.importPackageVote?.numberVote === row.original.numberVote);
      const groupedStausExportVote = typeStatusVotes.reduce((acc, product) => {
        const description = product.voteFillInfo?.importPackageVote?.description;
        if (!description) return acc;
    
        if (!acc[description]) {
          acc[description] = {
            status: description,
            merchandise: [],
          }
        }; 

        acc[description].merchandise.push(product.merchandise);
        return acc;
      }, {});
      return Object.values(groupedStausExportVote);
    };

    const voteClassificationStatus = () => {
      const groupedData = groupedStausExportVotes();
      const result = groupedData.map(group => {
        const { status, merchandise } = group;
        const groupedArray = merchandise.filter(item => item !== null).flat().reduce((acc, product) => {
            const type = product.productType && product.code && product.productName
              ? `${product.productType}_${product.code}_${product.productName}`
              : null;
    
            if (!type) return acc;
    
            if (!acc[type]) {
              acc[type] = { ...product, quantityAdd: 0 };
            }
    
            acc[type].quantityAdd += product.quantityAdd;
            return acc;
          }, {});
    
        return {
          status,
          product: Object.values(groupedArray),
        };
      });
    
      return result;
    };
    
    try {
      if (voteClassificationStatus().length === 0) return null;
      const functionName = 'caculated_quanlity_importVote_INLIST_FC';
      const response = await app?.currentUser?.callFunction(functionName, voteClassificationStatus());

      const notifySuccess  = () => toast.success(response.message, {
        autoClose: 2000
      });
      const notifyError  = () => toast.error(response.message, {
        autoClose: 2000
      });

      if (response.success === true) {
        notifySuccess();
      };
      if (response.success === false) {
        notifyError();
      };
    } catch (error) {
      return error.error;
    };
  };

  const handleApprovedImportVote = async (row) => {
    try {
      if (!row.original.numberVote) return null;
      const functionName = 'approved_importVote_INLIST_FC';
      const response = await app?.currentUser?.callFunction(functionName, dataClickingRow);

      const notifySuccess  = () => toast.success(response.message, {
        autoClose: 2000
      });
      const notifyError  = () => toast.error(response.message, {
        autoClose: 2000
      });

      if (response.success === true) {
        notifySuccess();
        await updateQuanlityApprovedExportVote(row);
      };

      if (response.success === false) {
        notifyError();
      };
      return response;
    } catch (error) {
      return error.error;
    }
    finally {
      setTimeout(() => {
        setIsReloadDataImportVote(!isReloadDataImportVote);
      }, 3000);
      setIsOpenConfirmApprovedImportVote(false);
    }  
  };

  const handleOpenConfirmDeleteImportVote = (row) => {
    if (row.original.description === 'Đã duyệt') return null;
    setIsOpenConfirmDeleteImportVote(!isOpenConfirmDeleteImportVote);
  }

  const handleCloseConfirmDeleteImportVote = () => {
    setIsOpenConfirmDeleteImportVote(false);
  }

  const handleDeleteImportVote = async (row) => {
    try {
      if (!row.original.numberVote) return null;
      const functionName = 'delete_importVote_INLIST_FC';
      const response = await app?.currentUser?.callFunction(functionName, dataClickingRow);

      const notifySuccess  = () => toast.success(response.message, {
        autoClose: 2000
      });
      const notifyError  = () => toast.error(response.message, {
        autoClose: 2000
      });

      if (response.success === true) {
        notifySuccess();
      };
      if (response.success === false) {
        notifyError();
      };
      return response;
    } catch (error) {
      return error.error;
    } 
    finally {
      setTimeout(() => {
        setIsReloadDataImportVote(!isReloadDataImportVote);
      }, 3000);
      setIsOpenConfirmDeleteImportVote(false);
    }  
  }

  if (app?.currentUser === null) {
    return <div><LoadingPage /></div>
  }

  return (
    <div className={styles.container}>
      {isOpenAddVotesPageBySearch ? (
        <div>
          <div className={styles.AddNewItemPageHeader}>
            <div className={styles.AddNewItemPageHeaderName}>
              <span>Thêm sản phẩm</span>
            </div>
            <div className={styles.AddNewItemPageHeaderIconXActive} onClick={handleCloseAddVotesPageBySearch}>
              <button>X</button>
            </div>
          </div>
          <div className={styles.AddNewItemPageBody}>
            <AddNewItemImportPackagePage />
          </div>
        </div>
      ) : ( 
        <>
          <div className={styles.header}>
            <div className={styles.headerName}>
              <span>Quản lý nhập kho</span>
            </div>
            <div className={styles.headerButton}>
              <button className={styles.addVotes} onClick={handleAddVotesPage}>
                <span>Thêm phiếu</span>
              </button>
              {isOpenAddVotesPage && (
                <div className={styles.AddNewItemPage}>
                  <div className={styles.AddNewItemPageOverLay}>
                    <div className={styles.AddNewItemPageLayer}>
                      <div className={styles.AddNewItemPageHeader}>
                        <div className={styles.AddNewItemPageHeaderName}>
                          <span>Thêm sản phẩm</span>
                        </div>
                        <div className={styles.AddNewItemPageHeaderIconX} onClick={handleCloseAddVotesPage}>
                          <button>X</button>
                        </div>
                      </div>
                      <div className={styles.AddNewItemPageBody}>
                        <AddNewItemImportPackagePage />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <button className={styles.deleteVotes}>
                <span>Xóa</span>
              </button>
              <button className={styles.exportExcellVotes}>
                <span>Xuất Excel</span>
              </button>
            </div>
          </div>
          <div className={styles.body}>
            <div className={styles.fillFormSearchVotes}>
              <>
                <Form
                  className={styles.custom_formImportPackageVote}
                  schema={formSearchVotes}
                  formData={formDataSearch}
                  validator={validator}
                  uiSchema={uiSchema}
                  onError={handleErrors}
                  onChange={(e) => {handleInputOnChangeFormSearch(e); setFormData(e.formData)}}
                  onSubmit={(e) => handleInputChangeFormSearch(e)}
                />
              </>
              <div className={styles.buttonRefreshInputSearch}>
                <button className={styles.buttonRefreshInputSearchActive} onClick={handleRefreshInputSearch}>Refresh</button>
              </div>           
            </div>
            
            <div className={styles.tableContainerHeader}>
              <div className={styles.switchTotalInventoryProduct}>
                <div className={`${styles.switchTotalInventoryProductName } ${isOpenTotalImportVote === true ? styles.active : ''}`} onClick={() => handleSwitchOpenImportVote('Tất cả')} >
                  <span>Tất cả</span>
                  <div className={styles.switchTotalInventoryProductUnderbar}></div>
                </div>
              </div>

              <div className={styles.switchStillInventoryProduct}>
                <div className={`${styles.switchStillInventoryProductName } ${isOpenApprovedImportVote === true ? styles.active : ''}`} onClick={() => handleSwitchOpenImportVote('Đã duyệt')}>
                  <span>Đã duyệt</span>
                  <div className={styles.switchStillInventoryProductUnderbar}></div>
                </div>
              </div>

              <div className={styles.switchOutInventoryProduct}>
                <div className={`${styles.switchOutInventoryProductName } ${isOpenNotYetApprovedImportVote === true ? styles.active : ''}`} onClick={() => handleSwitchOpenImportVote('Chưa duyệt')}>
                  <span>Chưa duyệt</span>
                  <div className={styles.switchOutInventoryProductUnderbar}></div>
                </div>
              </div>
            </div>

            <div className={styles.tableVotes}>
              <div style={{width: '100%', height: '500px', overflowX: 'auto', overflowY: 'auto' , boxSizing: 'border-box'}}>
                <table
                  {...getTableProps()}
                  style={{
                    width: '100%',
                    border: '1px solid black',
                    borderTop: 'none',
                    borderBottom: 'none',
                    borderSpacing: '0',
                  }}
                >
                  <thead
                    style={{
                      position: 'sticky',
                      top: '0',
                      backgroundColor: '#f2f2f2',
                      zIndex: '1',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {headerGroups.map((headerGroup) => {
                      const { key, ...headerGroupProps } = headerGroup.getHeaderGroupProps();
                      return (
                        <tr key={key} {...headerGroupProps}>
                          {headerGroup.headers.map((column) => {
                            const { key, ...columnProps } = column.getHeaderProps();
                            return (
                              <th
                                key={key}
                                {...columnProps}
                                style={{
                                  fontSize: '15px',
                                  padding: '10px',
                                  borderTop: '1px solid black',
                                  borderBottom: '1px solid black',
                                  width: column.width,
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
                        <React.Fragment key={key}>
                          <tr
                            {...rowProps}
                            onClick={() => handleRowClick(row)}
                            style={{ whiteSpace: 'nowrap' }}
                            className={styles.rowTable}
                          >
                            {row.cells.map((cell, cellIndex) => {
                              const { key, ...cellProps } = cell.getCellProps();
                              return (
                                <td
                                  key={key}
                                  {...cellProps}
                                  style={{
                                    backgroundColor:
                                      expandedRowId === row.original.numberVote
                                        ? '#d9f4e2'
                                        : '',
                                    fontWeight:
                                      expandedRowId === row.original.numberVote
                                        ? 'bold'
                                        : 'normal',
                                    fontSize:
                                      expandedRowId === row.original.numberVote ? '14px' : '',
                                    borderTop:
                                      expandedRowId === row.original.numberVote
                                        ? '2px solid rgb(38, 166, 154)'
                                        : 'none',
                                    borderLeft:
                                      expandedRowId === row.original.numberVote &&
                                      cellIndex === 0
                                        ? '2px solid rgb(38, 166, 154)'
                                        : 'none',
                                    borderRight:
                                      expandedRowId === row.original.numberVote &&
                                      cellIndex === row.cells.length - 1
                                        ? '2px solid rgb(38, 166, 154)'
                                        : 'none',
                                    borderBottom:
                                      expandedRowId === row.original.numberVote
                                        ? 'none'
                                        : '0.5px solid #c0c0c0',
                                  }}
                                >
                                  {cell.render('Cell')}
                                </td>
                              );
                            })}
                          </tr>
                          {expandedRowId === row.original.numberVote && (
                            <tr>
                              <td
                                colSpan={columns.length}
                                style={{
                                  border: '2px solid rgb(38, 166, 154)',
                                  borderTop: 'none',
                                  backgroundColor: '#d9f4e2',
                                }}
                              >
                                {renderShowInfoProduct(row)}
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VotePage;
