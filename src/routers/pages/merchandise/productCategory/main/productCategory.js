import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import * as Realm from 'realm-web';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import styles from './styles.module.css';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import { useTable, useRowSelect } from 'react-table';
import debounce from 'lodash/debounce';
import banhmiImage from '../../../../../../src/img/banhmi.jpg';
import LoadingPage from '../../../loadingPage/loadingPage';
import uiSchema from './uiSchema';
import { useAppContext } from '../../../appContext/AppContext';

import { IoAddOutline } from "react-icons/io5";
import { FaAngleDown } from "react-icons/fa";
import { FaRegImage } from "react-icons/fa6";
import { MdKeyboardBackspace } from "react-icons/md";
import { IoEye } from "react-icons/io5";
import { FaPen } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";

const app = new Realm.App({ id: process.env.REACT_APP_REALM_ID });

const filterProductsSchema = {
  title: 'Filter',
  type: 'object',
  properties: {
    searchProducts: { type: 'string', title: 'Tìm kiếm theo tên, mã sản phẩm, barcode' },
  },
};

const filterCategoryNameSchema = {
  title: 'Filter',
  type: 'object',
  required: ['categoryName'],
  properties: {
    categoryName: { type: 'string', title: 'Tên danh mục' },
  },
};

const searchProductsSchema = {
  title: 'Filter',
  type: 'object',
  properties: {
    searchProduct: { type: 'string', title: 'Tìm kiếm theo tên, mã sản phẩm, barcode' },
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

const ProductCategoryPage = () => {  
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
      Header: 'Danh mục',
      accessor: 'category',
      Cell: ({ value }) => <ProductNameCellRenderer value={value} rowDataDefault={rowData} />,
    },
    {
      Header: 'Số lượng',
      accessor: 'quantity',
    },
    {
      Header: 'Điều kiện áp dụng',
      accessor: 'condittionApply',
    },
  ], [rowData]);
 
  useEffect(() => {
    if (rowDataDefault.length === 0) {
      setRowData(rowDataNone);
    } else {
      setRowData(rowDataDefault);
    }
  }, [rowDataDefault, rowDataNone]);

  const groupedData = useMemo (() => {
    return rowDataDefault.reduce((acc, item) => {
      if (!acc[item.productType]) {
        acc[item.productType] = [];
      }
      acc[item.productType].push(item);
      return acc;
    }, {});
  }, [rowDataDefault]);

  const rowDataChangeCategory = useMemo (() => {
    if (Object.keys(groupedData).length === 0) return rowDataNone;
    const newArray = Object.keys(groupedData).map((category, index) => {
      const totalQuantity = groupedData[category].reduce((sum, item) => sum + (item.quantity || 0), 0);
      return {
        iD: index + 1,
        category,
        quantity: totalQuantity
      };
    });
    
    const totalQuantityAll = newArray.reduce((sum, item) => sum + item.quantity, 0);
    newArray.unshift({ iD: 0, category: 'Tất cả sản phẩm', quantity: totalQuantityAll });
    return newArray;
  }, [groupedData, rowDataNone]);

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
  const itemProductType = [...new Set(rowDataDefault.map(item => item.productType))];
  const newArray = itemProductType.flatMap(item => [{
    id: item.toLowerCase().replace(/\s+/g, ''),
    label: item,
    checked: false,
  }]);
 
  const [checkboxes, setCheckboxes] = useState(newArray);

  const handleInputChange = debounce((event) => {
    const checkInput = event?.formData?.searchProducts?.toLowerCase() || '';
    const result = rowDataChangeCategory.filter(item => item.category.toLowerCase().includes(checkInput));
    if (result.length === 0) return null;
    setRowData(result.length > 0 ? result : rowDataChangeCategory);
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
    const filteredData = rowDataChangeCategory.filter(item => selectedCheckboxes.includes(item.category));
    setRowData(filteredData.length > 0 ? filteredData : rowDataChangeCategory);
  };

  useEffect(() => {
    if (Object.keys(selectedRowIds).length !== 0) {
      setRowData(rowDataChangeCategory);
    }
  }, [rowDataChangeCategory, selectedRowIds]);

  const filteredCheckboxes = checkboxes.filter((checkbox) =>
    checkbox.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRowClick = (row) => {
    setExpandedRowId(expandedRowId === row.original.iD ? null : row.original.iD);
  };

  const handleCloseShowInCategory = () => {
    setExpandedRowId(!expandedRowId);
  };

  const selectedCount = checkboxes.filter((checkbox) => checkbox.checked).length;

  useEffect (() => {
    if (selectedCount === 0) {
      setRowData(rowDataChangeCategory)
    }
  }, [rowDataChangeCategory, selectedCount])

  const renderShowSelectedCount = () => {
    if (selectedCount > 0) {
      return (
        <div className={styles.searchBoxCount}>
          <span>Đã chọn</span>
          <div className={styles.count}>
            {selectedCount}
            {selectedCount > 0 && <button style={{cursor: 'pointer'}} onClick={() => setCheckboxes(checkboxes.map(item => ({...item, checked: false})))}>x</button>}
          </div>           
        </div>
      )
    }
    return null;
  };

  const printSelectedRows = useCallback (() => {
    const selectedRows = rows.filter(row => selectedRowIds[row.id]);
    //console.log("Selected Rows:", selectedRows.map(row => row.original));
    return selectedRows;
  }, [rows, selectedRowIds]);

  useEffect(() => {
    printSelectedRows();
  }, [selectedRowIds, printSelectedRows]);

  const [editorContent, setEditorContent] = useState("");
  const handleEditorChange = (content, delta, source, editor) => {
    setEditorContent(content);
  };

  const customUiSchemaCategoryName = () => ({
    'ui:submitButtonOptions': {
      submitText: "Lọc",
      norender: true,
      props: {
        disabled: true,
      },
    },
  });

  const customUiSchemaSearchProductList = () => ({
    searchProduct: {
      "ui:widget": "text",
      "ui:placeholder": "Tìm kiếm theo tên, mã sản phẩm, barcode",
      "ui:options": {
        label: false, 
      },
    },
   
    'ui:submitButtonOptions': {
      submitText: "Lọc",
      norender: true,
      props: {
        disabled: true,
      },
    },
  });

  const productsInListProductType = rowDataDefault.flatMap((item , index) => [{
    id: index,
    name: item.productType,
    image: 'link-to-image-dove',
    productName: item.productName,
    productType: item.productType,
    checked: false,
  }]);

  const [productList, setProductList] = useState(productsInListProductType);
  const handleSelect = (id) => {
    setProductList(prevList => 
      prevList.map(item => 
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleDelete = (id) => {
    setProductList(prevList => prevList.filter(item => item.id !== id));
  };

  const [images, setImages] = useState([
    banhmiImage,
    banhmiImage,
    banhmiImage,
    banhmiImage,
    banhmiImage,
  ]);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const handleDeleteImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };
  
  const renderShowInfoProduct = (row) => {
    const category = row.original?.category || '';
    const itemProductTypeList = category !== 'Tất cả sản phẩm' ? Array.isArray(productList)
      ? productList.filter(item => item.productType === category) : [] : productList;

    return (
      <div className={styles.detailContainer}>
        <div className={styles.detailContainerOverlay}>
          <div className={styles.detailContainerLayer}>
            <div className={styles.detailContainerItem}>
              <div className={styles.detailHeader}>
                <div className={styles.detailHeaderButton}>
                  <button onClick={handleCloseShowInCategory} className={styles.buttonCloseShowCatgory}>
                    <MdKeyboardBackspace size={20}/>
                  </button>
                </div>
                <div className={styles.detailHeaderName}>
                  <span>{row.original.category}</span>
                </div>
              </div>

              <div className={styles.detailBody}>
                <div className={styles.detailBodyLeftSide}>
                  <div className={styles.detailBodyLeftSideInfoCategory}>
                    <div className={styles.detailInfoName}>
                      <span>Thông tin danh mục</span>
                    </div>
                    <div className={styles.detailInfoBody}>
                      <div className={styles.detailFormCategoryName}>
                        <Form
                          className={styles.custom_formCategory}
                          schema={filterCategoryNameSchema}
                          validator={validator}
                          uiSchema={customUiSchemaCategoryName()}
                        />
                      </div>

                      <div className={styles.detailDecribse}>
                        <div className={styles.detailDecribseName}>
                          <span>Mô tả</span>
                        </div>
                        <div className={styles.detailDecribseText}>
                          <ReactQuill 
                            className={styles.custom_reactQuillText}
                            value={editorContent} 
                            onChange={handleEditorChange} 
                            theme="snow" 
                            placeholder="Nhập nội dung..."
                          />
                        </div>              
                      </div>
                    </div>
                  </div>
                  <div className={styles.detailBodyLeftSideProductList}>
                    <div className={styles.detailProductListName}>
                      <span>Danh sách sản phẩm</span>
                    </div>
                    <div className={styles.searchProductList}>
                      <Form
                        className={styles.custom_formCategory}
                        schema={searchProductsSchema}
                        validator={validator}
                        uiSchema={customUiSchemaSearchProductList()}
                      />
                    </div>

                    <div className={styles.productListEnums}>
                      {itemProductTypeList.map((product, index) => (
                        <div key={product.id} className={styles.productListItems}>
                          <div className={styles.productListItemsLeft}>
                            <div className={styles.dragHandle}>
                              ::
                            </div>

                            <div className={styles.inputCheckboxListProduct}>
                              <input
                                type="checkbox"
                                checked={product.selected}
                                onChange={() => handleSelect(product.id)}
                              />
                            </div>

                            <div className={styles.rowIdListProduct}>
                              <span>{index + 1}</span>
                            </div>

                            <div className={styles.imgListProduct}>
                              <img src={product.image} alt='...' width="50" height="50" />
                            </div>

                            <div className={styles.nameItemListProduct}>
                              <span className={styles.productListItemName}>{product.productName}</span>
                            </div>
                          </div>
                          <div className={styles.productListItemsRight}>
                            <button className={styles.productListItemsRightButton} onClick={() => handleDelete(product.id)}>X</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className={styles.detailBodyRightSide}>
                  <div className={styles.detailBodyRightSideImgCategory}>
                    <div className={styles.imgCategoryHeader}>
                      <div className={styles.imgCategoryHeaderName}>
                        <span>Ảnh sản phẩm</span>
                      </div>
                    </div>

                    <div className={styles.imgCategoryGridBody}>
                      <div className={styles.imgCategoryGridBodyItem}>
                        <div className={styles.imgCategoryGridBodyButtonAddImg} onClick={() => document.getElementById("fileInput").click()}>
                          <span><FaPlus size={20}/></span>
                        </div>
                        
                        {images.map((image, index) => (
                          <div key={index} className={styles.imgCategoryGridBodyListImg}>
                            <img src={image || ''} alt={`Product ${index + 1}`} style={{width: '80px', height: '80px'}}/>
                            <div className={styles.imgCategoryGridBodyButtonAddImgOverlay}>
                              <div className={styles.overLayButton}>
                                <button className={styles.overLayButtonWatchImg}><IoEye /></button>
                                <button className={styles.overLayButtonEditImg}><FaPen /></button>
                                <button className={styles.overLayButtonDeleteImg} onClick={() => handleDeleteImage(index)}>
                                  <MdDelete />
                                </button>
                              </div>                   
                            </div>
                          </div>
                        ))}

                        {/* Input kiểu file để chọn ảnh */}
                        <input
                          id="fileInput"
                          type="file"
                          multiple
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={handleImageUpload}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.EndPage}>
                <div className={styles.buttonEndPage}>
                  <button className={styles.buttonEndPageDelete}>
                    <span>Xóa</span>
                  </button>
                  <button className={styles.buttonEndPageSave}>
                    <span>Lưu</span>
                  </button>
                </div>
              </div>
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
            <span>Danh mục sản phẩm</span>
          </div>
          <div className={styles.headerActiveButton}>
            <button className={styles.addProduct}>
              <IoAddOutline />
              <span>Thêm danh mục</span>
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
                          />
                        </div>
                        {renderShowSelectedCount()}
                      </div>

                      <div className={styles.tagSearchBody}>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCategoryPage;
