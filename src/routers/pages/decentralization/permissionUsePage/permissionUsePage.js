import React, { useState } from 'react';
import styles from './styles.module.css'

import { useAppContext } from '../../appContext/AppContext';

import { FaAngleUp } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";

const PermissionUsePage = () => {
  const {permissionsHighAdmin} = useAppContext();
  const {setPermissionsHighAdmin} = useAppContext();
  const {permissionsMediumAdmin} = useAppContext();
  const {setPermissionsMediumAdmin} = useAppContext();
  const {permissionsLowAdmin} = useAppContext();
  const {setPermissionsLowAdmin} = useAppContext();

  const [isOpenDropList, setIsOpenDropList] = useState(true);
  const [isRotatedIconDropList, setIsRotatedIconDropList] = useState(true);


  const catchEventChangeCheckbox = (adminType) => {
    return '';
  }
  
  //HighAdmin
  const handleCheckboxChangeHighAdmin = (index) => {
    const updatedPermissions = [...permissionsHighAdmin];
    updatedPermissions[index].checked = !updatedPermissions[index].checked;
    setPermissionsHighAdmin(updatedPermissions);
  };

  const renderPermissionListHighAdmin = () => {
    return permissionsHighAdmin.map((permission, index) => (
      <div key={index} className={styles.permissions}>
        <label className={styles.switch}>
          <input 
            type="checkbox" 
            checked={permission.checked} 
            onChange={() => {
              handleCheckboxChangeHighAdmin(index);
              catchEventChangeCheckbox('HighAdmin');
            }}            
          />
          <span className={styles.slider_round}></span>
        </label>
        <div style={{ marginLeft: '10px' }}>
          <strong>{permission.label}</strong>: {permission.description}
        </div>
      </div>
    ));
  };

  //MediumAdmin
  const handleCheckboxChangeMediumAdmin = (index) => {
    const updatedPermissions = [...permissionsMediumAdmin];
    updatedPermissions[index].checked = !updatedPermissions[index].checked;
    setPermissionsMediumAdmin(updatedPermissions);
  };

  const renderPermissionListMediumAdmin = () => {
    return permissionsMediumAdmin.map((permission, index) => (
      <div key={index} className={styles.permissions}>
        <label className={styles.switch}>
          <input 
            type="checkbox" 
            checked={permission.checked} 
            onChange={() => handleCheckboxChangeMediumAdmin(index)}
          />
          <span className={styles.slider_round}></span>
        </label>
        <div style={{ marginLeft: '10px' }}>
          <strong>{permission.label}</strong>: {permission.description}
        </div>
      </div>
    ));
  };

  //LowAdmin
  const handleCheckboxChangeLowAdmin = (index) => {
    const updatedPermissions = [...permissionsLowAdmin];
    updatedPermissions[index].checked = !updatedPermissions[index].checked;
    setPermissionsLowAdmin(updatedPermissions);
  };

  const renderPermissionListLowAdmin = () => {
    return permissionsLowAdmin.map((permission, index) => (
      <div key={index} className={styles.permissions}>
        <label className={styles.switch}>
          <input 
            type="checkbox" 
            checked={permission.checked} 
            onChange={() => handleCheckboxChangeLowAdmin(index)}
          />
          <span className={styles.slider_round}></span>
        </label>
        <div style={{ marginLeft: '10px' }}>
          <strong>{permission.label}</strong>: {permission.description}
        </div>
      </div>
    ));
  };

  const handleToggleDropList = () => {
    setIsOpenDropList(!isOpenDropList);
    setIsRotatedIconDropList(!isRotatedIconDropList);
  }

  return (
    <div className={styles.container}>
      <div className={styles.containerLayer}>
        <div className={styles.header}>
          <div className={styles.headerName}>
            <IoSettingsOutline />
            <span>Phân quyền sử dụng trang</span>
          </div>
          <div className={styles.headerIconActive} onClick={handleToggleDropList}>
            <FaAngleUp style={{ transform: isRotatedIconDropList ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
          </div>
        </div>
        <div className={styles.dropListContainer}>
          {isOpenDropList && (
            <div className={styles.dropListContainerLayer}>
              <div className={styles.dropListItem}>
                <div className={styles.accessAdmin}>
                  <span> HighAdmin</span>
                </div>
                <div className={styles.renderPermissionTypeAmin}>
                  {renderPermissionListHighAdmin()}
                </div>        
              </div>
              <div className={styles.dropListItem}>
                <div className={styles.accessAdmin}>
                  <span> MediumAdmin</span>
                </div>
                <div className={styles.renderPermissionTypeAmin}>
                  {renderPermissionListMediumAdmin()}
                </div>
              </div>
              <div className={styles.dropListItem}>
                <div className={styles.accessAdmin}>
                  <span> LowAdmin</span>
                </div>
                <div className={styles.renderPermissionTypeAmin}>
                  {renderPermissionListLowAdmin()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PermissionUsePage;
