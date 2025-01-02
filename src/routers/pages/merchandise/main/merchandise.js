import React, {useEffect, useState} from 'react';
import * as Realm from 'realm-web';
import LoadingPage from '../../loadingPage/loadingPage';
import styles from './styles.module.css'

import { AiOutlineMenuUnfold } from "react-icons/ai";
import { GoPackage } from "react-icons/go";
import { LuWarehouse } from "react-icons/lu";
import { FaListUl } from "react-icons/fa6";
import { CiViewList } from "react-icons/ci";

import ProductPage from '../products/main/product';
import InventoryPage from '../inventory/main/inventory';
import ProductListPage from '../productList/main/productList';
import ProductCategory from '../productCategory/main/productCategory'
import AddNewItemPage from '../products/addNewItems/AddNewItemsPage';
import CodeGenerator from '../products/printCodes/printCode';
import { useAppContext } from '../../appContext/AppContext';

const app = new Realm.App({ id: process.env.REACT_APP_REALM_ID });

const Merchandise = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 500);

  const {isVisible} = useAppContext();
  const {setIsVisible} = useAppContext();
  const {activePage} = useAppContext();
  const {setActivePage} = useAppContext();
  const {handleNavigation} = useAppContext();
  const {addNewItem} = useAppContext();
  const {setAddNewItem} = useAppContext();
  const {addPrintCode} = useAppContext();
  const {setAddPrintCode} = useAppContext();

  const toggleSidebar = () => {
    setIsVisible(!isVisible);
  };


  useEffect(() => {
    const savedPage = localStorage.getItem('activePageMerchandise');
    
    if (savedPage) {
      setActivePage(savedPage);
    }

    if (savedPage === null) {
      setActivePage('product')
    }

    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 1000);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [setActivePage]);

  const handleCloseCreateNewPage = () => {
    setAddNewItem(!addNewItem);
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
          {addNewItem && (
            <div className={styles.createNewPage}>
              <div className={styles.buttonCloseCreateNewPage}>
                <button onClick={handleCloseCreateNewPage}>Quay lại</button>
              </div>
              <AddNewItemPage />
            </div>
          )}
          
          {addPrintCode && (
            <div className={styles.createNewPage}>
              <div className={styles.buttonCloseCreateNewPage}>
                <button onClick={handleClosePrintCodePage}>Quay lại</button>
              </div>
              <CodeGenerator />
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
                <div className={`${styles.sidebarContentInventory} ${activePage === 'product_list' ? styles.active : ''}`} 
                  onClick={() => handleNavigation('product_list')}>
                  <FaListUl size={isSmallScreen ? 15 : 16}/>
                  <li>Danh sách sản phẩm</li>
                </div>       
              </div>

              <div className={styles.sidebarContentItems} >
                <div className={`${styles.sidebarContentInventory} ${activePage === 'product_category' ? styles.active : ''}`} 
                  onClick={() => handleNavigation('product_category')}>
                  <CiViewList size={isSmallScreen ? 15 : 16}/>
                  <li>Danh mục sản phẩm</li>
                </div>       
              </div>  
            </ul>
          </div>
        </div>

        <div className={styles.pageContent}>
          {activePage === 'product' && <ProductPage />}
          {activePage === 'inventory' && <InventoryPage />}
          {activePage === 'product_list' && <ProductListPage />}
          {activePage === 'product_category' && <ProductCategory />}
        </div>
      </div>
    </div>
  );
};

export default Merchandise;
