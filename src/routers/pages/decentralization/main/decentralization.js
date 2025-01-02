import React, {useEffect, useState} from 'react';
import * as Realm from 'realm-web';
import LoadingPage from '../../loadingPage/loadingPage';
import styles from './styles.module.css';

import { AiOutlineMenuUnfold } from "react-icons/ai";
import { GoPackage } from "react-icons/go";
import { LuWarehouse } from "react-icons/lu";
import { CgTime } from "react-icons/cg";
import { FaUserShield } from "react-icons/fa6";

import Employee from '../employee/main/employee';
import RolePermissionGrid from '../permissionViewGroup/decentralizationGroupPage';
import { useAppContext } from '../../appContext/AppContext';
import AddNewEmployeePage from '../employee/addNewEmployee/newEmployeePage'
import PermissionViewData from '../permissionViewData/permissionViewData';
import PermissionUsePage from '../permissionUsePage/permissionUsePage';

const app = new Realm.App({ id: process.env.REACT_APP_REALM_ID });

const DecentralizationPage = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 500);
  const [isVisible, setIsVisible] = useState(false);
  const [activePage, setActivePage] = useState('employee');
  const {addNewEmployeesDecentralization} = useAppContext();
  const {setAddNewEmployeesDecentralization} = useAppContext();

  const toggleSidebar = () => {
    setIsVisible(!isVisible);
  };

  const handleNavigation = (page) => {
    setActivePage(page);
    setIsVisible(false);
    
    localStorage.setItem('activePageDecentralition', page);
  };

  useEffect(() => {
    const savedPage = localStorage.getItem('activePageDecentralition');
    
    if (savedPage) {
      setActivePage(savedPage);
    } 

    if (savedPage === null) {
      setActivePage('employee');
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
    setAddNewEmployeesDecentralization(!addNewEmployeesDecentralization);
  };

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
        </div>
        <div className={styles.showAddNewPage}>
          {addNewEmployeesDecentralization && (
            <div className={styles.createNewPage}>
              <div className={styles.buttonCloseCreateNewPage}>
                <button onClick={handleCloseCreateNewPage}>Quay lại</button>
              </div>
              <AddNewEmployeePage />
            </div>
          )}
        </div>
        <div className={`${styles.sidebar} ${isVisible ? styles.visible : ""}`}>
          <div className={styles.sidebarContent}>
            <ul>
              <div className={styles.sidebarContentItems} >
                <div className={`${styles.sidebarContentEmployee} ${activePage === 'employee' ? styles.active : ''}`} 
                  onClick={() => handleNavigation('employee')}>
                  <GoPackage size={isSmallScreen ? 15 : 16}/>
                  <li>Nhân viên</li>
                </div>       
              </div>

              <div className={styles.sidebarContentItems} >
                <div className={`${styles.sidebarContentDecentralizationGroup} ${activePage === 'permissionUsePage' ? styles.active : ''}`} 
                  onClick={() => handleNavigation('permissionUsePage')}>
                  <FaUserShield  size={isSmallScreen ? 15 : 16}/>
                  <li>Phân quyền sử dụng trang</li>
                </div>       
              </div>

              <div className={styles.sidebarContentItems} >
                <div className={`${styles.sidebarContentDecentralizationGroup} ${activePage === 'decentralizationGroup' ? styles.active : ''}`} 
                  onClick={() => handleNavigation('decentralizationGroup')}>
                  <LuWarehouse size={isSmallScreen ? 15 : 16}/>
                  <li>Phân quyền nhóm</li>
                </div>       
              </div>

              <div className={styles.sidebarContentItems} >
                <div className={`${styles.sidebarContentPermissionViewData} ${activePage === 'permissionViewData' ? styles.active : ''}`} 
                  onClick={() => handleNavigation('permissionViewData')}>
                  <CgTime size={isSmallScreen ? 15 : 16}/>
                  <li>Phân quyền xem dữ liệu</li>
                </div>       
              </div>
            </ul>
          </div>
        </div>

        <div className={styles.pageContent}>
          {activePage === 'decentralizationGroup' && <RolePermissionGrid />}
          {activePage === 'employee' && <Employee />}
          {activePage === 'permissionViewData' && <PermissionViewData />}
          {activePage === 'permissionUsePage' && <PermissionUsePage />}
        </div>
      </div>
    </div>
  );
};

export default DecentralizationPage;
