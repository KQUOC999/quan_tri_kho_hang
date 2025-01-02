
import React, {useEffect , useState, useRef} from 'react';
import styles from './styles.module.css'
import * as Realm from 'realm-web';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { FaAngleUp } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import { FaBan } from "react-icons/fa";

import { useAppContext } from '../../../appContext/AppContext';
import LoadingPage from '../../../loadingPage/loadingPage';

const app = new Realm.App({ id: process.env.REACT_APP_REALM_ID });

const AddNewItemPage = () => {
  const [isOpenGuarantee, setIsOpenGuarantee] = useState(false);
  const [isOpenInventory, setIsOpenInventory] = useState(false);
  const [statusSetEnumContries, setStatusSetEnumContries] = useState({});
  const [isRotatedGuaranteeIcon, setIsRotatedGuaranteeIcon] = useState(false);
  const [isRotatedInventoryIcon, setIsRotatedInventoryIcon] = useState(false);
  const [formDataSP, setFormDataSP] = useState(null);
  const [formDataDM, setFormDataDM] = useState(null);
  const [formDataBH, setFormDataBH] = useState(null);
  const [formDataTK, setFormDataTK] = useState(null);

  const formSPRef = useRef(null);
  const formDMRef = useRef(null);
  const formBHRef = useRef(null);
  const formTKRef = useRef(null);

  const {filterProductsSchemaFormSP} = useAppContext();
  const {filterProductsSchemaDM} = useAppContext();
  const {filterInventoryProductTK} = useAppContext();
  const {setAddProductTypesEnumsSP} = useAppContext();
  const {setAddUnitcalculateEnumsDM} = useAppContext();

  const CustomWidgetSp = ({ value, onChange, schema }) => {
    const [isOpenAddTypeProductNew, setIsOpenAddTypeProductNew] = useState(false);
    const [valueNewNameTypeProduct, setValueNewNameTypeProduct] = useState('');
    const [selectedValueTypeProduct, setSelectedValueTypeProduct] = useState("");
    const [isOpenTypeProductTaskFormEnumsList, setIsOpenTypeProductTaskFormEnumsList] = useState(false);
    const [searchTermTypeProduct, setSearchTermTypeProduct] = useState("");
    const options = [...filterProductsSchemaFormSP?.properties?.nameProductDad?.enum.filter(item => item !== "")];
    const [optionUpdate, setOptionUpdate] = useState(options);
    const dropdownRef = useRef(null);

    const handleIsOpenAddTypeProductNew = () => {
      setIsOpenAddTypeProductNew(!isOpenAddTypeProductNew);     
    }

    const handleIsCloseAddTypeProductNew = () => {
      setIsOpenAddTypeProductNew(false);     
    }

    const handleChangeNewName = (e) => {
      setValueNewNameTypeProduct(e.target.value);
    }

    const handleOpenTypeProductTaskFormEnumsList = () => {
      setIsOpenTypeProductTaskFormEnumsList(!isOpenTypeProductTaskFormEnumsList);
    };

    const filteredOptions = optionUpdate.filter(option =>
      option.toLowerCase().includes(searchTermTypeProduct.toLowerCase())
    );

    const handleSelectTypeProductSearchFormEnums = (value) => {
      setSelectedValueTypeProduct(value);
      setIsOpenTypeProductTaskFormEnumsList(!isOpenTypeProductTaskFormEnumsList);
    };

    const handleDismissButtonTypeProduct = () => {
      setSelectedValueTypeProduct('');
      setIsOpenAddTypeProductNew(false); 
      setValueNewNameTypeProduct(''); 
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpenTypeProductTaskFormEnumsList(false);
      }
    };
  
    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);
   
    const handleChange = (e) => {
      onChange(e.target.value);
    };

    const handleSaveTypeProductEnums = () => {
      const notifySuccessSP = () => toast.success("Lưu thành công!", {
        autoClose: 2000,
        pauseOnHover: true,
        onClose: () => {
        },
      });

      const notifyErrorSP = () => toast.error("Trùng tên!", {
        autoClose: 2000,
        pauseOnHover: true,
        onClose: () => {
        },
      });

      if (valueNewNameTypeProduct === '') return null;

      if (optionUpdate.some(item => item.toLowerCase().replace(/\s+/g, '') === valueNewNameTypeProduct.toLowerCase().replace(/\s+/g, ''))) return notifyErrorSP();

      setOptionUpdate(pre => [valueNewNameTypeProduct, ...pre]);
      setAddProductTypesEnumsSP(valueNewNameTypeProduct);
      notifySuccessSP();
    };
  
    const RenderButtons = () => {
      switch (schema.title) {
        case 'Loại SP':
          return (
          <div className={styles.creatNewTypeProduct}>
            <button className={styles.creatNewTypeProductButton} onClick={handleIsOpenAddTypeProductNew}><FaPlus size={15}/></button>
            {isOpenAddTypeProductNew && (
              <div className={styles.creatNewTypeProductContainer}>
                <div className={styles.creatNewTypeProductLayer}>
                    <div className={styles.creatNewTypeProductHeader}>
                        <span>Thêm loại sản phẩm</span>
                        <div className={styles.creatNewTypeProductHeaderButton}>
                          <button onClick={handleIsCloseAddTypeProductNew}>X</button>
                        </div>
                    </div>
                    <div className={styles.creatNewTypeProductBody}>
                      <div className={styles.creatNewTypeProductBodyNewName}>
                        <label htmlFor="inputField">Tên loại:</label>
                        <input
                          type="text"
                          id="inputField"         
                          value={valueNewNameTypeProduct || ''}      
                          onChange={handleChangeNewName}   
                          style={{ padding: '5px', width: '100%' }}  
                        />
                      </div>
                      <div className={styles.creatNewTypeProductBodyEnums}>
                        <div className={styles.listTypeProductTaskBodySearchFormName}>
                          <label htmlFor="product-type">Nhóm loại:</label>
                          <div className={styles.selectBoxTypeProductByPressActive}>
                            <div className={styles.selectBoxTypeProductOutput} onClick={handleOpenTypeProductTaskFormEnumsList}> 
                              {selectedValueTypeProduct || "---Lựa chọn---"}
                            </div>
                            {isOpenTypeProductTaskFormEnumsList && (
                              <div className={styles.listTypeProductTaskBodySearchFormEnums} ref={dropdownRef}>     
                                <div className={styles.optionsTypeProductContainer}>
                                  <input
                                    type="text"
                                    placeholder="Tìm kiếm"
                                    value={searchTermTypeProduct}
                                    onChange={(e) => setSearchTermTypeProduct(e.target.value)}
                                    className={styles.searchBoxInputLayer}
                                  />
                                  <div className={styles.optionlistTypeProductContainer}>
                                    <div className={styles.optionsListTypeProduct}>
                                      {filteredOptions.map(option => (
                                        <li
                                          key={option}
                                          onClick={() => handleSelectTypeProductSearchFormEnums(option)}
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
                    </div>

                    <div className={styles.listTypeProductTaskBodyButton}>
                      <button className={styles.saveButtonlistTypeProductTaskBody} onClick={handleSaveTypeProductEnums}>
                        <FaCheckCircle />
                        <span>Xong</span>
                      </button>
                      <button className={styles.dismissButtonlistTypeProductTaskBody} onClick={handleDismissButtonTypeProduct}>
                        <FaBan />
                        <span>Bỏ qua</span>
                      </button>
                    </div>
                </div>
              </div>
            )}
          </div>
        );
        default:
          return null;
      }
    };
  
    const renderInput = () => {
      if (schema.type === 'string' && schema.enum) {
        return (
          <select value={value || ''} onChange={handleChange} style={{ padding: '5px', flex: 1 }}>
            {schema.enum.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      };
  
      switch (schema.type) {
        case 'string':
          if (schema.format === 'date') {
            return (
              <input
                type="date"
                value={value || ''}
                onChange={handleChange}
                style={{ padding: '5px', flex: 1 }}
              />
            );
          }
          return (
            <input
              type="text"
              value={value || ''}
              onChange={handleChange}
              style={{ padding: '5px', flex: 1 }}
            />
          );
        case 'number':
          return (
            <input
              type="number"
              value={value || ''}
              onChange={handleChange}
              style={{ padding: '5px', flex: 1 }}
            />
          );
        default:
          return null;
      }
    };
  
    return (
      <div style={{ display: 'flex',}} className={styles.newStylesFormSP}>
        {renderInput()}
        <>
        {RenderButtons()}
        </>
      </div>
      
    );
  };
  const CustomFieldTemplateSP = ({ id, classNames, label, required, description, errors, children }) => {
    return (
      <div className={classNames}>
        <label htmlFor={id}>{label}{required ? '*' : null}</label>
        {description && <p>{description}</p>}
        {children}
        {errors.length > 0 && <div style={{ display: 'none' }}>{errors}</div>}
      </div>
    );
  };

  const CustomWidgetDM = ({ value, onChange, schema }) => {
    const [isOpenAddTypeProductNew, setIsOpenAddTypeProductNew] = useState(false);
    const [valueNewNameTypeProduct, setValueNewNameTypeProduct] = useState('');
    const [selectedValueTypeProduct, setSelectedValueTypeProduct] = useState("");
    const [isOpenTypeProductTaskFormEnumsList, setIsOpenTypeProductTaskFormEnumsList] = useState(false);
    const [searchTermTypeProduct, setSearchTermTypeProduct] = useState("");
    const options =[...filterProductsSchemaDM?.properties?.unitCaculation?.enum.filter(item => item !== "")];
    const [optionUpdate, setOptionUpdate] = useState(options);
    const dropdownRef = useRef(null);

    const handleIsOpenAddTypeProductNew = () => {
      setIsOpenAddTypeProductNew(!isOpenAddTypeProductNew);     
    }

    const handleIsCloseAddTypeProductNew = () => {
      setIsOpenAddTypeProductNew(false);     
    }

    const handleChangeNewName = (e) => {
      setValueNewNameTypeProduct(e.target.value);
    }

    const handleOpenTypeProductTaskFormEnumsList = () => {
      setIsOpenTypeProductTaskFormEnumsList(!isOpenTypeProductTaskFormEnumsList);
    };

    const filteredOptions = optionUpdate.filter(option =>
      option.toLowerCase().includes(searchTermTypeProduct.toLowerCase())
    );

    const handleSelectTypeProductSearchFormEnums = (value) => {
      setSelectedValueTypeProduct(value);
      setIsOpenTypeProductTaskFormEnumsList(!isOpenTypeProductTaskFormEnumsList);
    };

    const handleDismissButtonTypeProduct = () => {
      setSelectedValueTypeProduct('');
      setIsOpenAddTypeProductNew(false);  
      setValueNewNameTypeProduct('');
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpenTypeProductTaskFormEnumsList(false);
      }
    };
  
    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);
   
    const handleChange = (e) => {
      onChange(e.target.value);
    };

    const handleSaveTypeProductEnums = () => {
      const notifySuccess = () => toast.success("Lưu thành công!", {
        autoClose: 2000,
        pauseOnHover: true,
        onClose: () => {
        },
      });

      const notifyError = () => toast.error("Trùng tên!", {
        autoClose: 2000,
        pauseOnHover: true,
        onClose: () => {
        },
      });

      if (valueNewNameTypeProduct === '') return null;

      if (optionUpdate.some(item => item.toLowerCase().replace(/\s+/g, '') === valueNewNameTypeProduct.toLowerCase().replace(/\s+/g, ''))) return notifyError();

      setOptionUpdate(pre => [valueNewNameTypeProduct, ...pre]);
      setAddUnitcalculateEnumsDM(valueNewNameTypeProduct);
      notifySuccess();
    }
  
    const RenderButtons = () => {
      switch (schema.title) {
        case 'Đơn vị tính':
          return (
          <div className={styles.creatNewTypeProduct}>
            <button className={styles.creatNewTypeProductButton} onClick={handleIsOpenAddTypeProductNew}><FaPlus size={15}/></button>
            {isOpenAddTypeProductNew && (
              <div className={styles.creatNewTypeProductContainer}>
                <div className={styles.creatNewTypeProductLayer}>
                    <div className={styles.creatNewTypeProductHeader}>
                        <span>Thêm đơn vị tính</span>
                        <div className={styles.creatNewTypeProductHeaderButton}>
                          <button onClick={handleIsCloseAddTypeProductNew}>X</button>
                        </div>
                    </div>
                    <div className={styles.creatNewTypeProductBody}>
                      <div className={styles.creatNewTypeProductBodyNewName}>
                        <label htmlFor="inputField">Đơn vị:</label>
                        <input
                          type="text"
                          id="inputField"         
                          value={valueNewNameTypeProduct || ''}      
                          onChange={handleChangeNewName}   
                          style={{ padding: '5px', width: '100%' }}  
                        />
                      </div>
                      <div className={styles.creatNewTypeProductBodyEnums}>
                        <div className={styles.listTypeProductTaskBodySearchFormName}>
                          <label htmlFor="product-type">Nhóm loại:</label>
                          <div className={styles.selectBoxTypeProductByPressActive}>
                            <div className={styles.selectBoxTypeProductOutput} onClick={handleOpenTypeProductTaskFormEnumsList}> 
                              {selectedValueTypeProduct || "---Lựa chọn---"}
                            </div>
                            {isOpenTypeProductTaskFormEnumsList && (
                              <div className={styles.listTypeProductTaskBodySearchFormEnums} ref={dropdownRef}>     
                                <div className={styles.optionsTypeProductContainer}>
                                  <input
                                    type="text"
                                    placeholder="Tìm kiếm"
                                    value={searchTermTypeProduct}
                                    onChange={(e) => setSearchTermTypeProduct(e.target.value)}
                                    className={styles.searchBoxInputLayer}
                                  />
                                  <div className={styles.optionlistTypeProductContainer}>
                                    <div className={styles.optionsListTypeProduct}>
                                      {filteredOptions.map(option => (
                                        <li
                                          key={option}
                                          onClick={() => handleSelectTypeProductSearchFormEnums(option)}
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
                    </div>

                    <div className={styles.listTypeProductTaskBodyButton}>
                      <button className={styles.saveButtonlistTypeProductTaskBody} onClick={handleSaveTypeProductEnums}>
                        <FaCheckCircle />
                        <span>Xong</span>
                      </button>
                      <button className={styles.dismissButtonlistTypeProductTaskBody} onClick={handleDismissButtonTypeProduct}>
                        <FaBan />
                        <span>Bỏ qua</span>
                      </button>
                    </div>
                </div>
              </div>
            )}
          </div>
        );
        default:
          return null;
      }
    };
    
    const renderInput = () => {
      if (schema.type === 'string' && schema.enum) {
        return (
          <select value={value || ''} onChange={handleChange} style={{ padding: '5px', flex: 1 }}>
            {schema.enum.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      };
  
      switch (schema.type) {
        case 'string':
          if (schema.format === 'date') {
            return (
              <input
                type="date"
                value={value || ''}
                onChange={handleChange}
                style={{ padding: '5px', flex: 1 }}
              />
            );
          }
          return (
            <input
              type="text"
              value={value || ''}
              onChange={handleChange}
              style={{ padding: '5px', flex: 1 }}
            />
          );
        case 'number':
          return (
            <input
              type="number"
              value={value || ''}
              onChange={handleChange}
              style={{ padding: '5px', flex: 1 }}
            />
          );
        default:
          return null;
      }
    };
  
    return (
      <div style={{ display: 'flex',}}>
        {renderInput()}
        {RenderButtons()}
      </div>
    );
  };
  const CustomFieldTemplateDM = ({ id, classNames, label, required, description, errors, children }) => {
    return (
      <div className={classNames}>
        <label htmlFor={id}>{label}{required ? '*' : null}</label>
        {description && <p>{description}</p>}
        {children}
        {errors.length > 0 && <div style={{ display: 'none' }}>{errors}</div>}
      </div>
    );
  };
  
  const [uiSchema] = useState({
    "ui:submitButtonOptions": {
      norender: true,
    },
    nameProduct: { 'ui:widget': CustomWidgetSp, 'ui:options': {'hideError': true} },
    nameProductDad: { 'ui:widget': CustomWidgetSp, 'ui:options': {'hideError': true}  },
    typeCodeProduct: { 'ui:widget': CustomWidgetSp, 'ui:options': {'hideError': true}  },
    code: { 'ui:widget': CustomWidgetSp, 'ui:options': {'hideError': true}  },
    giaNhap: { 'ui:widget': CustomWidgetSp, 'ui:options': {'hideError': true}  },
    giaBan: { 'ui:widget': CustomWidgetSp, 'ui:options': {'hideError': true}  },
    statusProduct: { 'ui:widget': CustomWidgetSp, 'ui:options': {'hideError': true}  },
    dateCreated: { 'ui:widget': CustomWidgetSp, 'ui:options': {'hideError': true}  },
    
    danhMuc: { 'ui:widget': CustomWidgetDM, 'ui:options': {'hideError': true} },
    thuongHieu: { 'ui:widget': CustomWidgetDM, 'ui:options': {'hideError': true} },
    weightProduct: { 'ui:widget': CustomWidgetDM, 'ui:options': {'hideError': true} },
    unitCaculation: { 'ui:widget': CustomWidgetDM, 'ui:options': {'hideError': true} },
    sizeProduct: { 'ui:widget': CustomWidgetDM, 'ui:options': {'hideError': true} },
    imgProduct: { 'ui:widget': CustomWidgetDM, 'ui:options': {'hideError': true} }
  });
  
  const [filterGuaranteeProductBH, setFilterInventoryProducts] = useState ({
    title: 'Form BH',
    type: 'object',
    properties: {
      originProduct: { type: 'string', title: 'Xuất xứ', enum: []},
      adressInventoryProduct: {type: 'string', title: 'Địa chỉ bảo hành'},
      phoneNumber: { type: 'number', title: 'Số điện thoại'},
      timeLimitInventory: {type: 'string', title: 'Số tháng bảo hành'},
      titleInventory: {type: 'string', title: 'Nội dung bảo hành'}
    },
  });

  const toggleDropdownGuarantee = () => {
    setIsOpenGuarantee(!isOpenGuarantee);
    setIsRotatedGuaranteeIcon(!isRotatedGuaranteeIcon);
  };
  const toggleDropdownInventory = () => {
    setIsOpenInventory(!isOpenInventory);
    setIsRotatedInventoryIcon(!isRotatedInventoryIcon);
  };

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
  
  const handleChangeFormSP = (data) => {
    setFormDataSP(data.formData);
  };
  
  const handleChangeFormDM = (data) => {
    setFormDataDM(data.formData);
  };

  const handleChangeFormBH = (data) => {
    setFormDataBH(data.formData);
  };
  
  const handleChangeFormTK = (data) => {
    setFormDataTK(data.formData);
  };

  const handleSubmitFormSP = (data) => {
    const result = data?.formData;
    setFormDataSP(result);
  };
  
  const handleSubmitFormDM = (data) => {
    const result = data?.formData;
    setFormDataDM(result);
  };

  const handleSubmitFormBH = (data) => {
    const result = data?.formData;
    setFormDataBH(result);
  };
  
  const handleSubmitFormTK = (data) => {
    const result = data?.formData;
    setFormDataTK(result);
  };
  
  const handleSaveDataAllForm = async () => {
    const notifyError = () => toast.error("Vui lòng điền đầy đủ thông tin bắt buộc", {
      autoClose: 2000
    });

    await formSPRef.current.submit();
    await formDMRef.current.submit();
    if (isOpenInventory) await formTKRef.current.submit();
    if (isOpenGuarantee) await formBHRef.current.submit();

    const result = {
      [filterProductsSchemaFormSP?.title]: formDataSP || {},
      [filterProductsSchemaDM?.title]: formDataDM || {},
      [filterInventoryProductTK?.title]: formDataTK || {},
      [filterGuaranteeProductBH?.title]: formDataBH || {},
    };

    const requiredFieldsFormSP = filterProductsSchemaFormSP?.required || [];
    const requiredFieldsFormDM = filterProductsSchemaDM?.required || [];
    const requiredFieldsFormBH = filterGuaranteeProductBH?.required || [];
    const requiredFieldsFormTK = filterInventoryProductTK?.required || [];

    const isFormComplete = (formData, requiredFields) => {
      return requiredFields.every(field => formData[field] !== undefined && formData[field] !== "");
    };

    const isSPFormComplete = isFormComplete(result[filterProductsSchemaFormSP?.title], requiredFieldsFormSP);
    const isDMFormComplete = isFormComplete(result[filterProductsSchemaDM?.title], requiredFieldsFormDM);
    const isBHFormComplete = isOpenGuarantee ? isFormComplete(result[filterGuaranteeProductBH?.title], requiredFieldsFormBH) : true;
    const isTKFormComplete = isOpenInventory ? isFormComplete(result[filterInventoryProductTK?.title], requiredFieldsFormTK) : true;

    if (!isSPFormComplete || !isDMFormComplete || !isBHFormComplete || !isTKFormComplete) {
      notifyError();
      return null;
    };

    try {
      const functionName = 'add_newProduct_INLIST_FC';
      const response = await app?.currentUser?.callFunction(functionName, result);
      
      const notifySuccess  = () => toast.success(response.message, {
        autoClose: 2000
      });
      const notifyError  = () => toast.error(response.message, {
        autoClose: 2000
      });

      if (response.success === true) {
        notifySuccess();
        setTimeout(() => {window.location.reload();}, 2001);
      };
      if (response.success === false) {
        notifyError();
      }
      
      return response;
    } catch (error) {
      console.log(error.error);
    }
  };

  if (app.currentUser === null || statusSetEnumContries.length === 0) {
    return <div><LoadingPage /></div>
  }

  return (
    <div className={styles.containerProducts}>
      <div className={styles.containerProductsLayer1}> 
        <div className={styles.containerForm1Layer}>
          <Form
            ref={formSPRef} 
            className={styles.custom_formProducts}
            schema={filterProductsSchemaFormSP}
            validator={validator}
            uiSchema={uiSchema}
            showErrorList={false}
            onChange={handleChangeFormSP}  
            onSubmit={handleSubmitFormSP}
            onError={() => {}}
            FieldTemplate={CustomFieldTemplateSP}
          />
        </div>
        <div className={styles.containerForm2Layer}>
          <Form
            ref={formDMRef} 
            className={styles.custom_formProducts}
            schema={filterProductsSchemaDM}
            validator={validator}
            uiSchema={uiSchema}
            showErrorList={false}
            onChange={handleChangeFormDM}  
            onSubmit={handleSubmitFormDM}
            onError={() => {}}
            FieldTemplate= {CustomFieldTemplateDM}
          />
        </div>
      </div>

      <div className={styles.containerProductsLayer2}>
        <div className={styles.containerGuaranteeLayer}>
          <div className={styles.itemGuaranteeHeader}>
            <div className={styles.itemGuaranteeHeaderName}>
              <span>Bảo hành</span>
            </div>
            <div className={styles.itemGuaranteeHeaderIcon} onClick={toggleDropdownGuarantee}>
              <FaAngleUp style={{ transform: isRotatedGuaranteeIcon ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
            </div>
          </div>
          <div className={styles.itemGuaranteeDropList}>
            {isOpenGuarantee && (
              <div className={styles.itemGuaranteeDropListLayer}>
                <Form
                  ref={formBHRef} 
                  className={styles.custom_formGuaranteeProducts}
                  schema={filterGuaranteeProductBH}
                  validator={validator}
                  uiSchema={uiSchema}
                  onChange={handleChangeFormBH}  
                  onSubmit={handleSubmitFormBH}
                />
              </div>
            )}
          </div>
        </div>
        <div className={styles.containerInventoryLayer}>
          <div className={styles.itemInventoryHeader}>
            <div className={styles.itemInventoryHeaderName}>
              <span>Tồn đầu</span>
            </div>
            <div className={styles.itemInventoryHeaderIcon} onClick={toggleDropdownInventory}>
              <FaAngleUp style={{ transform: isRotatedInventoryIcon ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
            </div>
          </div>
          <div className={styles.itemInventoryDropList}>
            {isOpenInventory && (
              <div className={styles.itemInventoryDropListLayer}>
                <Form
                  ref={formTKRef} 
                  className={styles.custom_formInventoryProducts}
                  schema={filterInventoryProductTK}
                  validator={validator}
                  uiSchema={uiSchema}
                  onChange={handleChangeFormTK}  
                  onSubmit={handleSubmitFormTK}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.containerProductsLayerEnd}>
        <span onClick={handleSaveDataAllForm}>Lưu</span>
      </div>
    </div>
  );
};

export default AddNewItemPage;
