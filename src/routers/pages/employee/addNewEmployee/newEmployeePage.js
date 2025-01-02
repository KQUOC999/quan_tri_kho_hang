
import React, {useState} from 'react';
import styles from './styles.module.css'
import * as Realm from 'realm-web';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import { FaAngleUp } from "react-icons/fa";

import LoadingPage from '../../loadingPage/loadingPage';

const app = new Realm.App({ id: process.env.REACT_APP_REALM_ID });

const AddNewEmployeePage = () => {
  const [isOpenGuarantee, setIsOpenGuarantee] = useState(true);
  const [isOpenInventory, setIsOpenInventory] = useState(true);
  const [isRotatedGuaranteeIcon, setIsRotatedGuaranteeIcon] = useState(true);
  const [isRotatedInventoryIcon, setIsRotatedInventoryIcon] = useState(true);

  const [filterGuaranteeProducts, ] = useState ({
    title: 'Fill',
    type: 'object',
    properties: {
      access: { type: 'string', title: 'Phân quyền', enum: ['highAdmin', 'mediumAdmin', 'lowAdmin']},
      store: {type: 'string', title: 'Cửa hàng', enum: []},
      userNameLogin: { type: 'string', title: 'Tên đăng nhập'},
      password: {type: 'string', title: 'Mật khẩu'},
      email: {type: 'string', title: 'Email'},
      fullName: {type: 'string', title: 'Tên đầy đủ'},
      phoneNumber: {type: 'number', title: 'Điện thoại'},
    },
  });

  
  const [accountSystem, ] = useState ({
    title: 'Fill',
    type: 'object',
    properties: {
      account: { type: 'string', title: 'Tài khoản'},
      access: { type: 'string', title: 'Phân quyền', enum: ['highAdmin', 'mediumAdmin', 'lowAdmin']},
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

  if (app.currentUser === null) {
    return <div><LoadingPage /></div>
  }

  return (
    <div className={styles.containerProducts}>
      <div className={styles.containerProductsLayer2}>
        <div className={styles.containerGuaranteeLayer}>
          <div className={styles.itemGuaranteeHeader}>
            <div className={styles.itemGuaranteeHeaderName}>
              <span>Tạo mới tài khoản</span>
            </div>
            <div className={styles.itemGuaranteeHeaderIcon} onClick={toggleDropdownGuarantee}>
              <FaAngleUp style={{ transform: isRotatedGuaranteeIcon ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
            </div>
          </div>
          <div className={styles.itemGuaranteeDropList}>
            {isOpenGuarantee && (
              <div className={styles.itemGuaranteeDropListLayer}>
                <Form
                  className={styles.custom_formGuaranteeProducts}
                  schema={filterGuaranteeProducts}
                  validator={validator}
                />
              </div>
            )}
          </div>
        </div>
        <div className={styles.containerInventoryLayer}>
          <div className={styles.itemInventoryHeader}>
            <div className={styles.itemInventoryHeaderName}>
              <span>Gắn tài khoản đã có sẵn trên hệ thống</span>
            </div>
            <div className={styles.itemInventoryHeaderIcon} onClick={toggleDropdownInventory}>
              <FaAngleUp style={{ transform: isRotatedInventoryIcon ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
            </div>
          </div>
          <div className={styles.itemInventoryDropList}>
            {isOpenInventory && (
              <div className={styles.itemInventoryDropListLayer}>
                <Form
                  className={styles.custom_formInventoryProducts}
                  schema={accountSystem}
                  validator={validator}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewEmployeePage;
