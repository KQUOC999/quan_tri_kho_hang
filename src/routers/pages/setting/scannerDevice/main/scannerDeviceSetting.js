import React, {useEffect, useState } from 'react';
import * as Realm from 'realm-web';
import LoadingPage from '../../../loadingPage/loadingPage';
import styles from './styles.module.css';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import { useAppContext } from '../../../appContext/AppContext';

import { GoHomeFill } from "react-icons/go";
import { MdPlayArrow } from "react-icons/md";
import { GrStatusDisabledSmall } from "react-icons/gr";

const app = new Realm.App({ id: process.env.REACT_APP_REALM_ID });

const ScannerDeviceSetting = () => {
  const {innerScrollRef} = useAppContext();
  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isConnectedDevices, setIsConnectedDevices] = useState(false);
  const [isOpenSettingDevices, setIsOpenSettingDevices] = useState(false);
  const [isOpenSettingDevicesActive, setIsOpenSettingDevicesActive] = useState('');
  const [isOpenConfigureDevices, setIsOpenConfigureDevices] = useState(false);
  const [dataClickItemCard, setDataClickItemCard] = useState('');
  const [, setFormData] = useState(null);
  const [typeSetting, setTypeSetting] = useState('Beeper');
  const [switchMode, setSwitchMode] = useState('Cài đặt')

  const [filterProductsSchemaFormSP, ] = useState({
    title: 'Form SP',
    type: 'object',
    required: ['setting', 'nameProductDad', 'typeCodeProduct'],
    properties: {
      setting: { type: 'string', title: 'Cài đặt', enum: []},
      media: { type: 'string', title: 'Phương tiện', enum: ['Dầu gội', 'Sữa tắm']},
      typeCode: {type: 'string', title: 'Loại mã', enum: ['Mã vạch', 'Mã QR', 'Khác']},
    },
  });
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsConnectedDevices(prevState => !prevState);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const categories = [
    'All',
    'Hand-held General Purpose',
    'Hand-held Industrial',
    'Hands-free General Purpose',
    'Document Readers',
    'Bioptic In-Counter',
  ];

  const categoriesCard = [
    {
      title: 'Hand-held General Purpose',
      image: 'https://kynguyenbarcode.com/wp-content/uploads/2023/03/DATAMAX-HT2900W.jpg',
      model: 'HT2900W',
      seriesNumber: 'SN12345678',
      connection: 'Wireless',
    },
    {
      title: 'Hand-held Industrial',
      image: 'https://cdn.ready-market.com.tw/39e983bd/Templates/pic/m/Barcode-Scanner-TD-6000_03.jpg?v=1ed84918',
      model: 'TD-6000',
      seriesNumber: 'SN98765432',
      connection: 'Wired',
    },
    {
      title: 'Hands-free General Purpose',
      image: 'https://tanhungha.com.vn/storage/images/series/HH660.png',
      model: 'HH660',
      seriesNumber: 'SN11223344',
      connection: 'USB',
    },
    {
      title: 'Document Readers',
      image: 'https://tanhungha.com.vn/storage/images/products/Newland/HR1250%20-1.jpg',
      model: 'HR1250',
      seriesNumber: 'SN55667788',
      connection: 'Bluetooth',
    },
    {
      title: 'Bioptic In-Counter',
      image: 'https://azpos.vn/wp-content/uploads/2020/09/minjcode4.jpg',
      model: 'MINJCODE4',
      seriesNumber: 'SN33445566',
      connection: 'Serial',
    },
  ];
  
  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleIsOpenSettingDevices = (category) => { 
    if (isOpenSettingDevicesActive !== category.title) {
      setIsOpenSettingDevicesActive(category.title);
      setIsOpenSettingDevices(!isOpenSettingDevices);
      setDataClickItemCard(category);

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      
      if (innerScrollRef.current) {
        innerScrollRef.current.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      };
    } else {
      setIsOpenSettingDevicesActive('');
      setDataClickItemCard('');
      setIsOpenSettingDevices(false);
    };
  };

  const handleIsOpenHomeDevices = () => {
    setIsOpenSettingDevices(!isOpenSettingDevices);
    setIsOpenSettingDevicesActive('');
    setIsOpenConfigureDevices(false);
  };

  const handleIsOpenConfigureDevices = () => {
    setIsOpenConfigureDevices(!isOpenConfigureDevices);
  };

  const handleIsOpenConnectDevices = () => {
    setIsOpenConfigureDevices(false);
  };

  const [uiSchema] = useState({
    "ui:submitButtonOptions": {
      norender: true,
    },
  });

  const handleChangeFormTypeCodeGenneration = (data) => {
    setFormData(data.formData);
  };

  const [settingsBeep, setSettingsBeep] = useState({
    fastBeep: false,
    numBeepsGoodRead: 1,
    beeperGoodRead: true,
    beeperPitchError: 250,
    numBeepsError: 1,
    goodReadBeepFrequency: 1600,
    beepOnBELCharacter: false,
    powerUpBeep: true,
    triggerClick: true,
    volume: 3,
    decodeBeep: 0
  });

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setSettingsBeep((prevSettings) => ({
      ...prevSettings,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleChangeSelected = (event) => {
    setTypeSetting(event.target.value);
  };

  const sendSelectedSwitchMode = (mode) => {
    setSwitchMode(mode);
    return mode;
  };

  const renderItemHandleSelectedSettingMode = () => {
    if (switchMode === 'Cài đặt') {
      switch (typeSetting) {
        case 'Beeper':
          return (
            <div className={styles.formSettingBeepContainer}>
              <div className={styles.formSettingBeep}>
                <div className={styles.formSettingBeepGroup}>
                  <label className={styles.formSettingBeepLabel}>Fast Beep:</label>
                  <input
                    type="checkbox"
                    name="fastBeep"
                    checked={settingsBeep.fastBeep}
                    onChange={handleChange}
                    className={styles.inputCheckboxFormSetting}
                  />
                </div>

                <div className={styles.formSettingBeepGroup}>
                  <label className={styles.formSettingBeepLabel}>Number of Beeps per Good Read:</label>
                  <input
                    type="number"
                    name="numBeepsGoodRead"
                    value={settingsBeep.numBeepsGoodRead}
                    min="1"
                    max="9"
                    onChange={handleChange}
                    className={styles.inputNumberFormSetting}
                  />
                </div>

                <div className={styles.formSettingBeepGroup}>
                  <label className={styles.formSettingBeepLabel}>Beeper - Good Read:</label>
                  <input
                    type="checkbox"
                    name="beeperGoodRead"
                    checked={settingsBeep.beeperGoodRead}
                    onChange={handleChange}
                    className={styles.inputCheckboxFormSetting}
                  />
                </div>

                <div className={styles.formSettingBeepGroup}>
                  <label className={styles.formSettingBeepLabel}>Beeper Pitch - Error:</label>
                  <input
                    type="number"
                    name="beeperPitchError"
                    value={settingsBeep.beeperPitchError}
                    min="200"
                    max="9000"
                    onChange={handleChange}
                    className={styles.inputNumberFormSetting}
                  />
                </div>

                <div className={styles.formSettingBeepGroup}>
                  <label className={styles.formSettingBeepLabel}>Number of Beeps - Error:</label>
                  <input
                    type="number"
                    name="numBeepsError"
                    value={settingsBeep.numBeepsError}
                    min="0"
                    max="9"
                    onChange={handleChange}
                    className={styles.inputNumberFormSetting}
                  />
                </div>

                <div className={styles.formSettingBeepGroup}>
                  <label className={styles.formSettingBeepLabel}>Good Read Beep Frequency:</label>
                  <input
                    type="number"
                    name="goodReadBeepFrequency"
                    value={settingsBeep.goodReadBeepFrequency}
                    min="400"
                    max="9000"
                    onChange={handleChange}
                    className={styles.inputNumberFormSetting}
                  />
                </div>

                <div className={styles.formSettingBeepGroup}>
                  <label className={styles.formSettingBeepLabel}>Beep on BEL character:</label>
                  <input
                    type="checkbox"
                    name="beepOnBELCharacter"
                    checked={settingsBeep.beepOnBELCharacter}
                    onChange={handleChange}
                    className={styles.inputCheckboxFormSetting}
                  />
                </div>

                <div className={styles.formSettingBeepGroup}>
                  <label className={styles.formSettingBeepLabel}>Power Up Beep:</label>
                  <input
                    type="checkbox"
                    name="powerUpBeep"
                    checked={settingsBeep.powerUpBeep}
                    onChange={handleChange}
                    className={styles.inputCheckboxFormSetting}
                  />
                </div>

                <div className={styles.formSettingBeepGroup}>
                  <label className={styles.formSettingBeepLabel}>Trigger Click:</label>
                  <input
                    type="checkbox"
                    name="triggerClick"
                    checked={settingsBeep.triggerClick}
                    onChange={handleChange}
                    className={styles.inputCheckboxFormSetting}
                  />
                </div>

                <div className={styles.formSettingBeepGroup}>
                  <label className={styles.formSettingBeepLabel}>Volume:</label>
                  <select
                    name="volume"
                    value={settingsBeep.volume}
                    onChange={handleChange}
                    className={styles.selectFormSetting}
                  >
                    <option value="1">Low</option>
                    <option value="2">Medium</option>
                    <option value="3">High</option>
                  </select>
                </div>

                <div className={styles.formSettingBeepGroup}>
                  <label className={styles.formSettingBeepLabel}>Decode Beep:</label>
                  <input
                    type="number"
                    name="decodeBeep"
                    value={settingsBeep.decodeBeep}
                    min="0"
                    max="9"
                    onChange={handleChange}
                    className={styles.inputNumberFormSetting}
                  />
                </div>
              </div>
            </div>
          );
        case 'Led':
          return (
            <div>
            </div>
          );
        case 'Camera':
          return (
            <div>
            </div>
          );
        default:
          return (
            <div>
            </div>
        );
      };
    };
  };

  const renderConfigureDevices = (dataClickItemCard) => {
    return (
      <div className={styles.configureDevicesContainer}>
        <div className={styles.configureDevicesContainerLeft}>
          <div className={styles.configureDevicesContainerLeftHeader}>
            <span>Thông tin thiết bị</span>
          </div>
          <div className={styles.configureDevicesContainerLeftBody}>
            <div className={styles.scannerDevices}>
              <div className={styles.scannerDevicesHeader}>
                <span>Thiết bị quét</span>
              </div>
              <div className={styles.scannerDevicesBody}>
                <div className={styles.scannerDevicesCard}>
                  <img
                    src={dataClickItemCard.image}
                    alt={dataClickItemCard.title}
                    style={{ width: '100%', height: '150px', objectFit: 'cover', padding: '5px'}}
                  />
                  <div style={{ padding: '5px', fontWeight: 'bold', fontSize: '14px' }}>
                    {dataClickItemCard.title}
                  </div>
                </div>
                <div className={styles.scannerDevicesDetails}>
                  <span>Số series: {dataClickItemCard.seriesNumber} </span>
                  <span>Kiểu: {dataClickItemCard.model} </span>
                </div>
              </div>
            </div>

            <div className={styles.configuretionHistory}>
              <div className={styles.configuretionHistoryHeader}>
                <span>Lịch sử cấu hình</span>
              </div>
              <div className={styles.configuretionHistoryBody}>
                <span>Chú ý: Click chuột vào biểu tượng undo arrow để trở về thay đổi trước</span>
              </div>
            </div>

            <div className={styles.typeCodeGenneration}>
              <div className={styles.typeCodeGennerationHeader}>
                <span>Tạo loại mã</span>
              </div>
              <div className={styles.typeCodeGennerationBody}>
                <Form
                  className={styles.custom_formProducts}
                  schema={filterProductsSchemaFormSP}
                  validator={validator}
                  uiSchema={uiSchema}
                  showErrorList={false}
                  onChange={handleChangeFormTypeCodeGenneration}  
                  onError={() => {}}
                />
              </div>
            </div>

            <div className={styles.buttonActiveSettingDevice}>
              <button>Lưu cấu hình</button>
              <button>Lưu cấu hình trên thiết bị</button>
            </div>
          </div>
        </div>

        <div className={styles.configureDevicesContainerRight}>
          <div className={styles.configureDevicesContainerRightHeader}>
            <span>{dataClickItemCard.title}</span>
          </div>
          <div className={styles.configureDevicesContainerRightBody}>
            <div className={styles.tagSettingDevices}>
              <ul>
                <li className={`${switchMode === 'Cài đặt' ? styles.active : ''}`} 
                    onClick={() => sendSelectedSwitchMode('Cài đặt')}>
                    Cài đặt
                </li>
                <li className={`${switchMode === 'Ký hiệu' ? styles.active : ''}`} 
                    onClick={() => sendSelectedSwitchMode('Ký hiệu')}>
                    Ký hiệu
                </li>
                <li className={`${switchMode === 'Định dạng dữ liệu' ? styles.active : ''}`} 
                    onClick={() => sendSelectedSwitchMode('Định dạng dữ liệu')}>
                    Định dạng dữ liệu
                </li>
                <li className={`${switchMode === 'Quét dữ liệu máy tính' ? styles.active : ''}`} 
                    onClick={() => sendSelectedSwitchMode('Quét dữ liệu máy tính')}>
                    Quét dữ liệu máy tính
                </li>
              </ul>
            </div>
            {switchMode === 'Cài đặt' && (
              <div className={styles.selectedFormSettingMode}>
                <div className={styles.selectedFormSettingModeLayer}>
                  <select
                    name="typeSetting"
                    value={typeSetting}
                    onChange={handleChangeSelected}
                    className={styles.selectTypeSetting}
                  >
                    <option value="Beeper">Beeper</option>
                    <option value="Led">Led</option>
                    <option value="Camera">Camera</option>
                  </select>
                </div>
              </div>
            )}
            <div className={styles.settingMode}>
              {
                renderItemHandleSelectedSettingMode()   
              }
            </div>
          </div>
        </div>
      </div>
    )
  };

  if (!app.currentUser) {
    return <LoadingPage />;
  };

  return (
    <div className={styles.container}>
      <div className={styles.containerLayer}>
        <div className={styles.settingScannerDeviceHeader}>
          <div className={styles.settingScannerDeviceHeaderIcon}>
            <div className={`${styles.iconStatusConnectedDevices} ${isConnectedDevices === true ? styles.active : ''}`}>
              <GrStatusDisabledSmall size={20}/>
            </div>
            <div className={styles.settingScannerDeviceHeaderIconDescription}>
              <span>{isConnectedDevices ? 'KẾT NỐI THÀNH CÔNG' : 'MẤT KẾT NỐI'}</span>
            </div>
          </div>
        </div>
        {isOpenSettingDevices ? (
          <>
            <div className={styles.newPageSettingDevices}>
              <div className={styles.newPageSettingDevicesLayer}>
                <div className={styles.routerPage}>
                  <button className={styles.routerPageHome} onClick={handleIsOpenHomeDevices}>
                    <GoHomeFill size={20}/>
                    <span>Home</span>
                  </button>
                  <button className={styles.routerPageNext}>
                    <MdPlayArrow size={15}/>
                  </button>
                  <button className={styles.routerPageConnected} onClick={handleIsOpenConnectDevices}>Kết nối thiết bị</button>
                  {isOpenConfigureDevices && (
                    <>
                      <button className={styles.routerPageNext}>
                        <MdPlayArrow size={15}/>
                      </button>
                      <button className={styles.routerPageSetting}>Cài đặt</button>
                    </>
                  )}
                </div>
                {isOpenConfigureDevices ? (
                  <>
                    {renderConfigureDevices(dataClickItemCard)}
                  </>
                ) : (
                  <>
                    <div className={styles.cardItemsChoosen}>
                      <div className={styles.cardItemsChoosenLayer}>
                        <img
                          src={dataClickItemCard.image}
                          alt={dataClickItemCard.title}
                          style={{ width: '100%', height: '150px', objectFit: 'cover', padding: '10px' }}
                        />
                        <div style={{ padding: '10px', fontWeight: 'bold', fontSize: '14px' }}>
                          {dataClickItemCard.title}
                        </div>
                      </div>

                      <div className={styles.cardItemsChoosenData}>
                        <span>Kiểu: {dataClickItemCard.model} </span>
                        <span>Số series: {dataClickItemCard.seriesNumber} </span>
                        <span>Kết nối: {dataClickItemCard.connection} </span>
                      </div>
                    </div>

                    <div className={styles.cardItemsChoosenButton}>
                      <button onClick={handleIsOpenConfigureDevices}>Mở cấu hình</button>
                      <button>Cập nhật frimware</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
          ) : (
          <>
            <div className={styles.settingScannerDeviceBody}>
              <div className={styles.settingScannerDeviceBodyLayer}>
                <div className={styles.settingScannerDeviceBodyItem}>
                  <div className={styles.typeTag}>
                    <div className={styles.typeTagButton}>
                      <button className={styles.openExistingConfigureTag}>
                        <span>MỞ CẤU HÌNH ĐÃ CÀI ĐẶT</span>
                      </button>
                      <button className={styles.createNewConfigureTag}>
                        <span>TẠO MỚI CẤU HÌNH</span>
                      </button>
                    </div>

                    <div className={styles.typeTagSearch}>
                      <div className={styles.typeTagSearchName}>
                        <label htmlFor="searchInput">
                          Tìm theo mã / tên:
                        </label>
                        <input
                          type="text"
                          id="searchInput"
                          value={searchInput}
                          onChange={handleSearchChange}
                          placeholder="Enter device name or number"
                          style={{height: '30px'}}
                        />
                      </div>

                      <div className={styles.typeTagSearchCategory}>
                        <label htmlFor="categorySelect">
                          Tìm theo danh sách thiết bị:
                        </label>
                        <select
                          id="categorySelect"
                          value={selectedCategory}
                          onChange={handleCategoryChange}
                          style={{height: '35px'}}
                        >
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className={styles.settingScannerDeviceCategory}>
                    <div className={styles.categoryDescription}>
                      <span>Loại thiết bị</span>
                    </div>
                    <div className={styles.categoryItemCardContainer}>
                      <div className={styles.categoryItemCardContainerLayer}>
                        {categoriesCard.map((category, index) => (
                          <div
                            key={index}
                            className={styles.cardItems}
                            onClick={() => handleIsOpenSettingDevices(category)}
                          >
                            <img
                              src={category.image}
                              alt={category.title}
                              style={{ width: '100%', height: '150px', objectFit: 'cover', padding: '5px' }}
                            />
                            <div style={{ padding: '10px', fontWeight: 'bold', fontSize: '14px' }}>
                              {category.title}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className={styles.notifyBottom}>
                    <span>Note: </span>
                    <span>Click chuột chọn loại thiết bị</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ScannerDeviceSetting;
