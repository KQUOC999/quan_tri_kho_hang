import React, {useEffect, useState} from 'react';
import * as Realm from 'realm-web';
import LoadingPage from '../../loadingPage/loadingPage';
import styles from './styles.module.css'

import { AiOutlineMenuUnfold } from "react-icons/ai";
import { GoPackage } from "react-icons/go";
import { CgTime } from "react-icons/cg";

import ProductPage from '../products/main/product';
import AddNewItemImportPackagePage from '../products/addNewItemImportPackage/AddNewItemsPage';
import VotePage from '../votes/main/votePackage';
import { useAppContext } from '../../appContext/AppContext';

const app = new Realm.App({ id: process.env.REACT_APP_REALM_ID });

const ImportPackage = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 500);
  const [isVisible, setIsVisible] = useState(false);
  const [activePage, setActivePage] = useState('product');
  const {addNewItemImportPackage} = useAppContext();
  const {setAddNewItemImportPackage} = useAppContext();
  const {addPrintCode} = useAppContext();
  const {setAddPrintCode} = useAppContext();
  const {isShowButtonBackProductImportPage} = useAppContext();

  /* Dữ liệu hàng exportPackageVote */
  const {setUpdatedDataImportPage} = useAppContext();
  const {rowDataDefault} = useAppContext();

  /* MQTT */
  const { setMessageMQTTBrokerImportPage } = useAppContext();

  const toggleSidebar = () => {
    setIsVisible(!isVisible);
  };

  const handleNavigation = (page) => {
    setActivePage(page);
    setIsVisible(false);
    
    localStorage.setItem('activePageImportPackage', page);
  };

  useEffect(() => {
    const savedPage = localStorage.getItem('activePageImportPackage');
    
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
    setAddNewItemImportPackage(!addNewItemImportPackage);
    setMessageMQTTBrokerImportPage('');
    setUpdatedDataImportPage(rowDataDefault.map(row => ({
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
          {addNewItemImportPackage && (
            <div className={styles.createNewPage}>
              {isShowButtonBackProductImportPage && (
                <div className={styles.buttonCloseCreateNewPage}>
                  <button onClick={handleCloseCreateNewPage}>Quay lại</button>
                </div>
              )}
              <AddNewItemImportPackagePage />
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
                <div className={`${styles.sidebarContentInventory} ${activePage === 'vote' ? styles.active : ''}`} 
                  onClick={() => handleNavigation('vote')}>
                  <CgTime size={isSmallScreen ? 15 : 16}/>
                  <li>Phiếu nhập kho</li>
                </div>        
              </div>
            </ul>
          </div>
        </div>

        <div className={styles.pageContent}>
          {activePage === 'product' && <ProductPage />}
          {activePage === 'vote' && <VotePage />}
        </div>
      </div>
    </div>
  );
};

export default ImportPackage;
