import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import * as Realm from 'realm-web';
import styles from './styles.module.css';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import { useTable, useRowSelect } from 'react-table';
import debounce from 'lodash/debounce';
import banhmiImage from '../../../../../../src/img/banhmi.jpg';
import * as XLSX from 'xlsx';

import { useAppContext } from '../../../appContext/AppContext';
import LoadingPage from '../../../loadingPage/loadingPage';
import uiSchema from './uiSchema';

import { CiExport } from "react-icons/ci";
import { CiImport } from "react-icons/ci";
import { IoEye } from "react-icons/io5";
import { FaAngleDown } from "react-icons/fa";
import { FaCheckSquare } from "react-icons/fa";
import { RiBarcodeFill } from "react-icons/ri";
import { MdOutlineContentCopy } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FaRegImage } from "react-icons/fa6";

const app = new Realm.App({ id: process.env.REACT_APP_REALM_ID });
const pages = 'Hàng hóa';
const category = 'Tồn kho';

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

const InventoryPage = () => {
  const {handleNavigation} = useAppContext();
  const {access} = useAppContext();
  const {accessPage} = useAppContext();

  const [isOpenTotalTableProductInventory, setIsOpenTotalTableProductInventory] = useState(true);
  const [isOpenStillTableProductInventory, setIsOpenStillTableProductInventory] = useState(false);
  const [isOpenOutTableProductInventory, setIsOpenOutTableProductInventory] = useState(false);

  const handleIsOpenTotalTableProductInventory = () => {
    setIsOpenTotalTableProductInventory(!isOpenTotalTableProductInventory);
    if (isOpenStillTableProductInventory === true) setIsOpenStillTableProductInventory(!isOpenStillTableProductInventory);
    if (isOpenOutTableProductInventory === true) setIsOpenOutTableProductInventory(!isOpenOutTableProductInventory);
  }

  const handleIsOpenStillTableProductInventory = () => {
    setIsOpenStillTableProductInventory(!isOpenStillTableProductInventory);
    if (isOpenTotalTableProductInventory === true) setIsOpenTotalTableProductInventory(!isOpenTotalTableProductInventory);
    if (isOpenOutTableProductInventory === true) setIsOpenOutTableProductInventory(!isOpenOutTableProductInventory);
  }

  const handleIsOpenOutTableProductInventory = () => {
    setIsOpenOutTableProductInventory(!isOpenOutTableProductInventory);
    if (isOpenTotalTableProductInventory === true) setIsOpenTotalTableProductInventory(!isOpenTotalTableProductInventory);
    if (isOpenStillTableProductInventory === true) setIsOpenStillTableProductInventory(!isOpenStillTableProductInventory);
  }

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
  const [rowData, setRowData] = useState(rowDataDefault);
  const [expandedRowId, setExpandedRowId] = useState(null);

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
      Header: 'Mã',
      accessor: 'code',
    },
    {
      Header: 'Đơn vị tính',
      accessor: 'DvTinh',
    },
    {
      Header: 'Tồn kho',
      accessor: 'quantity',
    },
    {
      Header: 'Có thể bán',
      accessor: 'coTheBan',
    },
    {
      Header: 'Đang giao dịch',
      accessor: 'dangGiaoDich',
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

  const exportToExcel = (task) => {
    const checkAccess = accessPage(pages, category, task, access);
    if (checkAccess !== true) return null;
    const dataForExport = rows.map((row) => {
      prepareRow(row);
      const rowData = {};
      row.cells.forEach((cell) => {
        rowData[cell.column.Header] = cell.value;
      });
      return rowData;
    });

    const worksheet = XLSX.utils.json_to_sheet(dataForExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    XLSX.writeFile(workbook, 'table-data.xlsx');
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [checkboxes, setCheckboxes] = useState([
    { id: 'shampoo', label: 'Dầu gội', checked: false },
    { id: 'skincare', label: 'Kem dưỡng da', checked: false },
    { id: 'son', label: 'Son phấn', checked: false },
    { id: 'fillmay', label: 'Kẻ lông mày', checked: false },
  ]);

  const handleInputChange = debounce((event) => {
    const checkInput = event?.formData?.searchProducts?.toLowerCase() || '';
    const result = rowDataDefault.filter(item => item.productName.toLowerCase().includes(checkInput));
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

  // Cập nhật trạng thái mở rộng hàng
  const handleRowClick = (row) => {
    setExpandedRowId(expandedRowId === row.original.iD ? null : row.original.iD);
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
    return selectedRows;
  }, [rows, selectedRowIds]);

  useEffect(() => {
    printSelectedRows();
  }, [selectedRowIds, printSelectedRows]);

  const renderShowInfoProduct = (row) => {
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
              <span><strong>ID:</strong> {row.original.iD}</span>
              <span><strong>Tên sản phẩm:</strong> {row.original.productName}</span>
              <span><strong>Giá vốn:</strong> {row.original.giaVon}</span>
              <span><strong>Giá bán:</strong> {row.original.giaBan}</span>
              <span><strong>Có thể bán:</strong> {row.original.coTheBan ? 'Có' : 'Không'}</span>
              <span><strong>Loại:</strong> {row.original.productType}</span>
              <span><strong>Ngày khởi tạo:</strong> {row.original.dateCreated}</span>
            </div>
            <div className={styles.buttonActive}>
              <button className={styles.updateButton}>
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
              <button className={styles.deleteButton}>
                <MdDelete size={20} />
                <span>Xóa</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

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
            <span>Quản lý kho</span>
          </div>
          <div className={styles.headerActiveButton}>
            <button className={styles.addProduct} onClick={() => handleNavigation('product_list', 'productListPage')}>
              <IoEye />
              <span>Xem danh sách sản phẩm</span>
            </button>
            <button className={styles.exportFile} onClick={() => {exportToExcel('Xuất file')}}>
              <CiExport />
              <span>Xuất file</span>
            </button>
            <button className={styles.importFile}>
              <CiImport />
              <span>Nhập file</span>
            </button>
          </div>
        </div>

        <div className={styles.body}>
          <div className={styles.tableContainer}>
            <div className={styles.tableContainerHeader}>
              <div className={styles.switchTotalInventoryProduct}>
                <div className={`${styles.switchTotalInventoryProductName } ${isOpenTotalTableProductInventory === true ? styles.active : ''}`} onClick={handleIsOpenTotalTableProductInventory}>
                  <span>Tất cả</span>
                  <div className={styles.switchTotalInventoryProductUnderbar}></div>
                </div>
              </div>

              <div className={styles.switchStillInventoryProduct}>
                <div className={`${styles.switchStillInventoryProductName } ${isOpenStillTableProductInventory === true ? styles.active : ''}`} onClick={handleIsOpenStillTableProductInventory}>
                  <span>Còn hàng</span>
                  <div className={styles.switchStillInventoryProductUnderbar}></div>
                </div>
              </div>

              <div className={styles.switchOutInventoryProduct}>
                <div className={`${styles.switchOutInventoryProductName } ${isOpenOutTableProductInventory === true ? styles.active : ''}`} onClick={handleIsOpenOutTableProductInventory}>
                  <span>Hết hàng</span>
                  <div className={styles.switchOutInventoryProductUnderbar}></div>
                </div>
              </div>
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
                          />
                        </div>
                        {renderShowSelectedCount()}
                      </div>
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
                      <div className={styles.filterButtonLayer}>
                        <button onClick={handleFilter} className={styles.filterButton}>Lọc</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {isOpenTotalTableProductInventory && (
              <div className={styles.tableContainerReactTable}>
                <div className={styles.tableContainerReactTableLayer}>
                  <table {...getTableProps()} style={{ width: '100%', padding: '10px' }}>
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
                                  style={{ border: '1px solid rgb(38, 166, 154)' }}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
