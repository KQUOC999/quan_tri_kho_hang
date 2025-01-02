import React, {useEffect, useState} from 'react';
import * as Realm from 'realm-web';
import LoadingPage from '../../loadingPage/loadingPage';
import styles from './styles.module.css'

import { AiOutlineMenuUnfold } from "react-icons/ai";
import { GoPackage } from "react-icons/go";
import { LuWarehouse } from "react-icons/lu";
import { CgTime } from "react-icons/cg";

import ProductPage from '../products/main/product';
import InventoryPage from '../inventory/inventory';
import AddNewItemExportPackagePage from '../products/addNewItemExportPackage/AddNewItemsPage';
import VotePageExport from '../votes/main/votePackage';
import { useAppContext } from '../../appContext/AppContext';

const app = new Realm.App({ id: process.env.REACT_APP_REALM_ID });

const ExportPackage = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 500);
  const [isVisible, setIsVisible] = useState(false);
  const [activePage, setActivePage] = useState('product');
  const {setAddNewItemExportPackage} = useAppContext();
  const {addNewItemExportPackage} = useAppContext();
  const {addPrintCode} = useAppContext();
  const {setAddPrintCode} = useAppContext();
  const {isShowButtonBackProductExportPage} = useAppContext();

  /* Dữ liệu hàng exportPackageVote */
  const {setUpdatedDataExportPage} = useAppContext();
  const {rowDataDefault} = useAppContext();

  /* MQTT */
  const { setMessageMQTTBrokerExportPage } = useAppContext();

  const toggleSidebar = () => {
    setIsVisible(!isVisible);
  };

  const handleNavigation = (page) => {
    setActivePage(page);
    setIsVisible(false);
    
    localStorage.setItem('activePageExportPackage', page);
  };

  useEffect(() => {
    const savedPage = localStorage.getItem('activePageExportPackage');
    
    if (savedPage) {
      setActivePage(savedPage);
    }

    if (savedPage === null) {
      setActivePage('product');
    }

    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 1000);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleCloseCreateNewPage = () => {
    setAddNewItemExportPackage(!addNewItemExportPackage);
    setMessageMQTTBrokerExportPage('');
    setUpdatedDataExportPage(rowDataDefault.map(row => ({
      ...row,
      quantityAdd: '',
      totalPrice: '',
    })));
  };

  const handleClosePrintCodePage = () => {
    setAddPrintCode(!addPrintCode);
  }

  if (!app.currentUser) {
    return <LoadingPage />
  }
  return (
    <div className={styles.container}>
      <div className={styles.containerBody}>
        <div className={styles.menuTab}>
          <div className={styles.menuTabIcon} onClick={toggleSidebar}>
            <AiOutlineMenuUnfold size={isSmallScreen ? 25 : 30}/>
          </div>
          {addNewItemExportPackage && (
            <div className={styles.createNewPage}>
              {isShowButtonBackProductExportPage && (
                <div className={styles.buttonCloseCreateNewPage}>
                  <button onClick={handleCloseCreateNewPage}>Quay lại</button>
                </div>
              )}
              <AddNewItemExportPackagePage />
            </div>
          )}
          
          {addPrintCode && (
            <div className={styles.createNewPage}>
              <div className={styles.buttonCloseCreateNewPage}>
                <button onClick={handleClosePrintCodePage}>Quay lại</button>
              </div>
            </div>
          )}
        </div>
        <div className={`${styles.sidebar} ${isVisible ? styles.visible : ""}`}>
          <div className={styles.sidebarContent}>
            <ul>
              <div className={styles.sidebarContentItems} >
                <div className={`${styles.sidebarContentProducts} ${activePage === 'product' ? styles.active : ''}`}  
                  onClick={() => handleNavigation('product')}>
                  <GoPackage size={isSmallScreen ? 15 : 16}/>
                  <li>Sản phẩm</li>
                </div>       
              </div>

              <div className={styles.sidebarContentItems} >
                <div className={`${styles.sidebarContentInventory} ${activePage === 'inventory' ? styles.active : ''}`} 
                  onClick={() => handleNavigation('inventory')}>
                  <LuWarehouse size={isSmallScreen ? 15 : 16}/>
                  <li>Tồn kho</li>
                </div>       
              </div>

              <div className={styles.sidebarContentItems} >
                <div className={`${styles.sidebarContentInventory} ${activePage === 'vote' ? styles.active : ''}`} 
                  onClick={() => handleNavigation('vote')}>
                  <CgTime size={isSmallScreen ? 15 : 16}/>
                  <li>Phiếu xuất kho</li>
                </div>  
              </div>   
            </ul>
          </div>
        </div>

        <div className={styles.pageContent}>
          {activePage === 'product' && <ProductPage />}
          {activePage === 'inventory' && <InventoryPage />}
          {activePage === 'vote' && <VotePageExport />}
        </div>
      </div>
    </div>
  );
};

export default ExportPackage;
