import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import * as Realm from 'realm-web';
import styles from './styles.module.css';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import { useTable, useRowSelect } from 'react-table';
import debounce from 'lodash/debounce';
import banhmiImage from '../../../../../../src/img/banhmi.jpg';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import LoadingPage from '../../../loadingPage/loadingPage';
import uiSchema from './uiSchema';
import { useAppContext } from '../../../appContext/AppContext';

import { CiExport } from "react-icons/ci";
import { CiImport } from "react-icons/ci";
import { IoAddOutline } from "react-icons/io5";
import { FaAngleDown } from "react-icons/fa";
import { FaCheckSquare } from "react-icons/fa";
import { RiBarcodeFill } from "react-icons/ri";
import { MdOutlineContentCopy } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FaRegImage } from "react-icons/fa6";

const app = new Realm.App({ id: process.env.REACT_APP_REALM_ID });

const filterProductsSchema = {
  title: 'Filter',
  type: 'object',
  properties: {
    searchProducts: { type: 'string', title: 'Tìm kiếm theo tên, mã sản phẩm, barcode' },
  },
};

const ProductNameCellRenderer = ({ value, rowDataDefault }) => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    {rowDataDefault.length === 0 ? (
      <FaRegImage
        size={50}
        style={{
          width: 30,
          height: 30,
          marginRight: 8,
          border: '1px solid rgb(210, 210, 210)',
          padding: '5px',
          color: 'rgb(115, 115, 115)',
        }}
      />
    ) : (
      <img
        src={banhmiImage}
        alt="Product"
        style={{
          width: 30,
          height: 30,
          marginRight: 8,
          border: '1px solid rgb(210, 210, 210)',
        }}
      />
    )}
    <span>{value}</span>
  </div>
);

const ProductListPage = () => {  
  const dropdownRef = useRef(null);
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpenTagSearch(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const [isOpenTagSearch, setIsOpenTagSearch] = useState(false);
  const handleIsOpenTagSearch = () => {
    setIsOpenTagSearch(!isOpenTagSearch);
  };

  const rowDataNone = useMemo (() => [{iD: 0, productName: 'Không có dữ liệu', productType: null, dateCreated: null, giaVon: null, giaBan: null}], []);
  const {rowDataDefault} = useAppContext();
  const {loadingDataFetch} = useAppContext();
  const {setIsReloadDataProductList} = useAppContext();
  const [rowData, setRowData] = useState(rowDataDefault);
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [isOpenConfirmDelete, setIsOpenConfirmDelete] = useState(false);

  const columns = useMemo(() => [
    {
      id: 'selection',
      Header: ({ getToggleAllRowsSelectedProps }) => (
        <div>
          <input type="checkbox" {...getToggleAllRowsSelectedProps()} />
        </div>
      ),
      Cell: ({ row }) => (
        <div>
          <input type="checkbox" 
            {...row.getToggleRowSelectedProps()} 
            onClick={e => e.stopPropagation()}
          />
        </div>
      ),
    },
    {
      Header: 'ID',
      accessor: 'iD',
    },
    {
      Header: 'Sản phẩm',
      accessor: 'productName',
      Cell: ({ value }) => <ProductNameCellRenderer value={value} rowDataDefault={rowData} />,
    },
    {
      Header: 'Mã sản phẩm',
      accessor: 'code',
    },
    {
      Header: 'Loại mã',
      accessor: 'typeCodeProduct',
    },
    {
      Header: 'Giá vốn',
      accessor: 'giaVon',
    },
    {
      Header: 'Giá bán',
      accessor: 'giaBan',
    },
    {
      Header: 'Loại',
      accessor: 'productType',
    },
    {
      Header: 'Ngày khởi tạo',
      accessor: 'dateCreated',
    },
  ], [rowData]);

  useEffect(() => {
    if (rowDataDefault.length === 0) {
      setRowData(rowDataNone);
    } else {
      setRowData(rowDataDefault);
    }
  }, [rowDataDefault, rowDataNone]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { selectedRowIds },
  } = useTable(
    {
      columns,
      data: rowData,
    },
    useRowSelect
  );

  const [searchTerm, setSearchTerm] = useState('');

  const getPushTypeProductInList = useCallback (() => {
    const typeProduct = [...new Set(rowDataDefault.map(item => item.productType))];
    
    return typeProduct.map(item => ({
      id: item.toLowerCase().replace(/\s+/g, '') || 'none',
      label: item,
      checked: false,
    }));
  }, [rowDataDefault]);
  
  const [checkboxes, setCheckboxes] = useState(() => getPushTypeProductInList());

  useEffect(() => {
    setCheckboxes(getPushTypeProductInList());
  }, [rowDataDefault, getPushTypeProductInList]);

  const handleInputChange = debounce((event) => {
    const checkInput = event?.formData?.searchProducts?.toLowerCase() || '';
    const result = rowDataDefault.filter(item => item.productName.toLowerCase().includes(checkInput));
    if (result.length === 0) return null;
    setRowData(result.length > 0 ? result : rowDataDefault);
  }, 300);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCheckboxChange = (id) => {
    setCheckboxes((prevCheckboxes) =>
      prevCheckboxes.map((checkbox) =>
        checkbox.id === id ? { ...checkbox, checked: !checkbox.checked } : checkbox
      )
    );
  };

  const handleFilter = () => {
    const selectedCheckboxes = checkboxes.filter(checkbox => checkbox.checked).map(checkbox => checkbox.label);
    const filteredData = rowDataDefault.filter(item => selectedCheckboxes.includes(item.productType));
    setRowData(filteredData.length > 0 ? filteredData : rowDataDefault);
  };

  useEffect(() => {
    if (Object.keys(selectedRowIds).length !== 0) {
      setRowData(rowDataDefault);
    }
  }, [rowDataDefault, selectedRowIds]);

  const filteredCheckboxes = checkboxes.filter((checkbox) =>
    checkbox.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [formDatadetailProduct, setFormDatadetailProduct] = useState([]);

  const handleRowClick = (row) => {
    setExpandedRowId(expandedRowId === row.original.iD ? null : row.original.iD);
    setFormDatadetailProduct({
      iD: row.original.iD || '',
      productName: row.original.productName || '',
      code: row.original.code || '', 
      typeCodeProduct: row.original.typeCodeProduct || '',
      giaVon: row.original.giaVon || 0,
      giaBan: row.original.giaBan || 0,
      coTheBan: row.original.coTheBan || false,
      productType: row.original.productType || '',
      dateCreated: row.original.dateCreated || '',
    });
  };

  const selectedCount = checkboxes.filter((checkbox) => checkbox.checked).length;

  useEffect (() => {
    if (selectedCount === 0 || rowDataDefault.length !== 0) {
      setRowData(rowDataDefault)
    }
  }, [rowDataDefault, selectedCount])

  const renderShowSelectedCount = () => {
    if (selectedCount > 0) {
      return (
        <div className={styles.searchBoxCount}>
          <span>Đã chọn</span>
          <div className={styles.count}>
            {selectedCount}
            {selectedCount > 0 && <button onClick={() => setCheckboxes(checkboxes.map(item => ({...item, checked: false})))}>x</button>}
          </div>           
        </div>
      )
    }
    return null;
  }

  const printSelectedRows = useCallback (() => {
    const selectedRows = rows.filter(row => selectedRowIds[row.id]);
    //console.log("Selected Rows:", selectedRows.map(row => row.original));
    return selectedRows.map(row => row.original)
  }, [rows, selectedRowIds]);

  useEffect(() => {
    printSelectedRows();
  }, [selectedRowIds, printSelectedRows]);

  const renderShowInfoProduct = (row) => {
    const formFields = [
      { name: 'iD', label: 'ID', type: 'text', readOnly: true },
      { name: 'productName', label: 'Tên sản phẩm', type: 'text' },
      { name: 'code', label: 'Mã sản phẩm', type: 'text', readOnly: true },
      { name: 'giaVon', label: 'Giá vốn', type: 'number' },
      { name: 'giaBan', label: 'Giá bán', type: 'number' },
      { name: 'coTheBan', label: 'Có thể bán', type: 'checkbox' },
      { name: 'productType', label: 'Loại', type: 'text' },
      { name: 'dateCreated', label: 'Ngày khởi tạo', type: 'date' },
    ];
  
    const handleInputChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormDatadetailProduct((prevState) => ({
        ...prevState,
        [name]: type === 'checkbox' ? checked : value,
      }));
    };
  
    const renderField = ({ name, label, type, readOnly }) => (
      <div key={name} className={styles.detailLayerChildrenField}>
        <label htmlFor={name} style={{whiteSpace: 'nowrap'}}>
          <strong>{label}:</strong>
        </label>
        <input
          id={name}
          type={type}
          name={name}
          value={type === 'checkbox' ? undefined : formDatadetailProduct[name] || ''}
          checked={type === 'checkbox' ? formDatadetailProduct[name] : undefined}
          onChange={handleInputChange}
          readOnly={readOnly || false}
          style={{ height: '25px', border: 'none', borderBottom: '1px solid green'}}
        />
      </div>
    );

    const handleUpdateDetailProduct = async () => {
      try {
        if (!row.original.code) return null;
        const functionName = 'update_detailProduct_INLIST_FC';
        const response = await app?.currentUser?.callFunction(functionName, formDatadetailProduct);

        const notifySuccess  = () => toast.success(response.message, {
          autoClose: 2000
        });
        const notifyError  = () => toast.error(response.message, {
          autoClose: 2000
        });
  
        if (response.success === true) {
          notifySuccess();
          setIsReloadDataProductList(true);
        };
        if (response.success === false) {
          notifyError();
        };
        return response;
      } catch (error) {
        return error.error;
      }  
    };

    const handleOpenConfirmDelete = () => {
      setIsOpenConfirmDelete(!isOpenConfirmDelete);
    }
    const handleCloseConfirmDeleteProduct = () => {
      setIsOpenConfirmDelete(false);
    }

    const handleDeleteProduct = async () => {
      try {
        if (!row.original.code) return null;
        const functionName = 'delete_product_INLIST_FC';
        const response = await app?.currentUser?.callFunction(functionName, formDatadetailProduct);

        const notifySuccess  = () => toast.success(response.message, {
          autoClose: 2000
        });
        const notifyError  = () => toast.error(response.message, {
          autoClose: 2000
        });
  
        if (response.success === true) {
          notifySuccess();
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        };
        if (response.success === false) {
          notifyError();
        };
        return response;
      } catch (error) {
        return error.error;
      }  
    };

    return (
      <div className={styles.detailContainer}>
        <div className={styles.detailContainerLayer}>
          <div className={styles.imgProduct}>
            {rowDataDefault.length === 0 ? (
              <FaRegImage style={{ width: 200, height: 200, marginRight: 8, border: '1px solid rgb(210, 210, 210)', padding: '5px', color: 'rgb(115, 115, 115)'}}/>
            ) : (
              <img
                src={banhmiImage}
                alt="Product"
                style={{ width: 200, height: 200, marginRight: 8, border: '1px solid rgb(210, 210, 210)'}}
              />
            )}
          </div>
          <div className={styles.detailProduct}>
            <div className={styles.detail}>
              <h3>Chi tiết sản phẩm</h3>
              <div className={styles.detailLayer}>
                <div className={styles.detailLayerChildren}>
                  {formFields.map(renderField)}
                </div>
              </div>
            </div>
            <div className={styles.buttonActive}>
              <button className={styles.updateButton} onClick={handleUpdateDetailProduct}>
                <FaCheckSquare size={20} />
                <span>Cập nhật</span>
              </button>
              <button className={styles.printCodeButton}>
                <RiBarcodeFill size={20} />
                <span>In mã</span>
              </button>
              <button className={styles.copyButton}>
                <MdOutlineContentCopy size={20} />
                <span>Sao chép</span>
              </button>
              <button className={styles.deleteButton} onClick={handleOpenConfirmDelete}>
                <MdDelete size={20} />
                <span>Xóa</span>
              </button>
              {isOpenConfirmDelete && (
                <div className={styles.confirmDeleteProduct}>
                  <div className={styles.confirmDeleteProductOverlay}>
                    <div className={styles.confirmDeleteProductBody}>
                      <div className={styles.confirmDeleteProductBodyHeader}>
                        <strong>Xóa {formDatadetailProduct?.productType.toLowerCase() || 'Không xác định'} </strong>
                        <button onClick={handleCloseConfirmDeleteProduct}>X</button>
                      </div>
                      <div className={styles.confirmDeleteProductAnnouncation}>
                        <span>Hệ thống sẽ xóa hoàn toàn hàng hóa <strong>{formDatadetailProduct.code || 'Không xác định'} </strong>
                          trong dữ liệu lưu trữ nhưng vẫn giữ thông tin hàng hóa trong các giao dịch lịch sử nếu có. 
                          Bạn có chắc chắn muốn xóa?
                        </span>
                      </div>
                      <div className={styles.buttonActiveContainer}>
                        <button className={styles.confirmButton} onClick={handleDeleteProduct}>Xác nhận</button>
                        <button className={styles.cancelButton} onClick={handleCloseConfirmDeleteProduct}>Hủy</button>
                      </div>
                    </div>
                  </div>
                </div>              
              )}
            </div>
          </div>
        </div>
      </div>
    )
  };

  const [page, setPage] = useState(0);
  const rowsPerPage = 10; 
  const totalPages = Math.ceil(rows.length / rowsPerPage);
  const currentRows = rows.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  if (app.currentUser === null || loadingDataFetch) {
    return <div><LoadingPage /></div>
  }

  return (
    <div className={styles.container}>
      <div className={styles.containerLayer}>
        <div className={styles.header}>
          <div className={styles.headerName}>
            <span>Danh sách sản phẩm</span>
          </div>
          <div className={styles.headerActiveButton}>
            <button className={styles.exportFile}>
              <CiExport />
              <span>Xuất file</span>
            </button>
            <button className={styles.importFile}>
              <CiImport />
              <span>Nhập file</span>
            </button>
            <button className={styles.addProduct}>
              <IoAddOutline />
              <span>Thêm sản phẩm</span>
            </button>
          </div>
        </div>

        <div className={styles.body}>
          <div className={styles.tableContainer}>
            <div className={styles.tableContainerHeader}>
              <span>Tất cả</span>
            </div>

            <div className={styles.tableContainerFormFilter}>
              <div className={styles.formFilter}>
                <div className={styles.form}>
                  <Form
                    className={styles.custom_formProducts}
                    schema={filterProductsSchema}
                    validator={validator}
                    uiSchema={uiSchema}
                    onChange={(e) => handleInputChange(e)}
                  />
                </div>
                <div className={styles.searchTag} ref={dropdownRef}>
                  <button className={styles.searchTagButton} onClick={handleIsOpenTagSearch}>
                    <span>Tag</span>
                    <FaAngleDown />
                  </button>

                  {isOpenTagSearch && (
                    <div className={styles.tagSearchContainer}>
                      <div className={styles.searchBox}>
                        <div className={styles.searchBoxLayer}>
                          <input
                            type="text"
                            placeholder="Tìm kiếm"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className={styles.input}
                            style={{outline: 'none'}}
                          />
                        </div>
                        {renderShowSelectedCount()}
                      </div>
                      <div style={{height: '250px', overflowY: 'auto'}}>
                        {filteredCheckboxes.map((checkbox) => (
                          <div key={checkbox.id} className={styles.filterItem}>
                            <input
                              type="checkbox"
                              id={checkbox.id}
                              checked={checkbox.checked}
                              onChange={() => handleCheckboxChange(checkbox.id)}
                            />
                            <label htmlFor={checkbox.id} className={styles.label}>{checkbox.label}</label>
                          </div>
                        ))}
                      </div>
                      <div className={styles.filterButtonLayer}>
                        <button onClick={handleFilter} className={styles.filterButton}>Lọc</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.tableContainerReactTable}>
              <div className={styles.tableContainerReactTableLayer}>
                <table
                  {...getTableProps()}
                  style={{ width: '100%', padding: '10px' }}
                >
                  <thead>
                    {headerGroups.map((headerGroup) => {
                      const { key, ...headerGroupProps } = headerGroup.getHeaderGroupProps();
                      return (
                        <tr key={key} {...headerGroupProps} style={{ whiteSpace: 'nowrap' }}>
                          {headerGroup.headers.map((column) => {
                            const { key, ...columnProps } = column.getHeaderProps();
                            return (
                              <th key={key} {...columnProps}>
                                {column.render('Header')}
                              </th>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </thead>
                  <tbody {...getTableBodyProps()}>
                    {currentRows.map((row) => {
                      prepareRow(row);

                      const { key, ...rowProps } = row.getRowProps();
                      return (
                        <React.Fragment key={key}>
                          <tr
                            {...rowProps}
                            onClick={() => handleRowClick(row)}
                            style={{ whiteSpace: 'nowrap', cursor: 'pointer' }}
                          >
                            {row.cells.map((cell) => {
                              const { key, ...cellProps } = cell.getCellProps();
                              return (
                                <td key={key} {...cellProps}>
                                  {cell.render('Cell')}
                                </td>
                              );
                            })}
                          </tr>
                          {expandedRowId === row.original.iD && (
                            <tr>
                              <td
                                colSpan={columns.length}
                                style={{
                                  border: '1px solid rgb(38, 166, 154)',
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

                {/* Phần pagination */}
                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
                  <button
                    onClick={() => setPage(prev => Math.max(prev - 1, 0))}
                    disabled={page === 0}
                  >
                    Previous
                  </button>
                  <span style={{ margin: '0 10px' }}>
                    Page {page + 1} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(prev => Math.min(prev + 1, totalPages - 1))}
                    disabled={page >= totalPages - 1}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
