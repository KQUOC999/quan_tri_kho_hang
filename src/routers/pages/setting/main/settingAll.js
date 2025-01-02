import React, { useState, useEffect } from 'react';
import * as Realm from 'realm-web';
import LoadingPage from '../../loadingPage/loadingPage';
import styles from './styles.module.css';

import ScannerDeviceSetting from '../scannerDevice/main/scannerDeviceSetting';
import Scanning from '../scanning/scanning';
import BluetoothComponent from '../methodConnection/connectedBluetooth/main';
import { useAppContext } from '../../appContext/AppContext';

import { AiOutlineMenuUnfold } from "react-icons/ai";
import { BsFillDeviceSsdFill } from "react-icons/bs";
import { AiOutlineScan } from "react-icons/ai";
import { FaDatabase } from "react-icons/fa6";

const app = new Realm.App({ id: process.env.REACT_APP_REALM_ID });

const SettingAll = () => {
  const {innerScrollRef} = useAppContext();
  // State to manage options
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 500);
  const [isVisible, setIsVisible] = useState(false);
  const [activePage, setActivePage] = useState('scannerDeviceSetting');
  
  const toggleSidebar = () => {
    setIsVisible(!isVisible);
  };

  const handleNavigation = (page) => {
    setActivePage(page);
    setIsVisible(false);
    
    localStorage.setItem('scannerDeviceSetting', page);
  };

  useEffect(() => {
    const savedPage = localStorage.getItem('scannerDeviceSetting');
    
    if (savedPage) {
      setActivePage(savedPage);
    } 

    if (savedPage === null) {
      setActivePage('scannerDeviceSetting');
    }

    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 1000);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (!app.currentUser) {
    return <LoadingPage />;
  }

  return (
    <div className={styles.container} ref={innerScrollRef}>
      <div className={styles.containerBody}>
        <div className={styles.menuTab}>
          <div className={styles.menuTabIcon} onClick={toggleSidebar}>
            <AiOutlineMenuUnfold size={isSmallScreen ? 25 : 30}/>
          </div>
        </div>

        <div className={`${styles.sidebar} ${isVisible ? styles.visible : ""}`}>
          <div className={styles.sidebarContent}>
            <ul>
              <div className={styles.sidebarContentItems} >
                <div className={`${styles.sidebarContentScannerDeviceSetting} ${activePage === 'scannerDeviceSetting' ? styles.active : ''}`} 
                  onClick={() => handleNavigation('scannerDeviceSetting')}>
                  <BsFillDeviceSsdFill size={isSmallScreen ? 15 : 16}/>
                  <li>Máy quét</li>
                </div>       
              </div>

              <div className={styles.sidebarContentItems} >
                <div className={`${styles.sidebarContentSaveDataBase} ${activePage === 'scanning' ? styles.active : ''}`} 
                  onClick={() => handleNavigation('scanning')}>
                  <AiOutlineScan size={isSmallScreen ? 15 : 16}/>
                  <li>Quét</li>
                </div>       
              </div>

              <div className={styles.sidebarContentItems} >
                <div className={`${styles.sidebarContentSaveDataBase} ${activePage === 'dataBaseSetting' ? styles.active : ''}`} 
                  onClick={() => handleNavigation('dataBaseSetting')}>
                  <FaDatabase size={isSmallScreen ? 15 : 16}/>
                  <li>Lưu trữ</li>
                </div>       
              </div>
            </ul>
          </div>
        </div>

        <div className={styles.pageContent}>
          {activePage === 'scannerDeviceSetting' && <ScannerDeviceSetting />}
          {activePage === 'scanning' && <Scanning />}
          {activePage === 'dataBaseSetting' && <BluetoothComponent/>}
        </div>
      </div>
    </div>
  );
};

export default SettingAll;
