import React, {useState} from 'react';
import * as Realm from 'realm-web';
import styles from './styles.module.css';
import { Routes, Route, useNavigate } from 'react-router-dom';

import Account from '../accountLogin/adminAccount';

const app = new Realm.App({ id: process.env.REACT_APP_REALM_ID });

const NotAccessPage = () => {
  const navigate = useNavigate();
  const [isClosePage, setIsClosePage] = useState(true);

  const handleClosePage = () => {
    setIsClosePage(!isClosePage)
  }

  const logout = async () => {
    if (app?.currentUser) {
      await app?.currentUser.logOut();
      navigate('/admitration_warehouse_app');
      window.location.reload(true);
    }
    return  <Routes>
              <Route path="/admitration_warehouse_app" element={<Account />} />
            </Routes>
  };
 
  return (
    isClosePage ? (
      <div className={styles.overLay}>
        <div className={styles.containerLayer}>
          <div className={styles.buttonClose} onClick={handleClosePage}>
            <span>Quay lại</span>
          </div>
          <div className={styles.text}>
            <span>Bạn không có quyền truy cập vào trang này</span>Vui lòng
            <span onClick={logout} className={styles.loginLink}>đăng nhập</span>
            <span> để tiếp tục!</span>
          </div>
        </div>
      </div>
    ) : (
      <div className={styles.message}>
        <span>Chưa đăng nhập</span>
      </div>
    )
  );
};

export default NotAccessPage;
