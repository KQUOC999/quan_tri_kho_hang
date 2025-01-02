import React, { Suspense, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import * as Realm from 'realm-web';
import MainPage from './component/MainPage';
import './index.css';
import Footers from "./routers/pages/footer/footer";
import LoadingPage from "./routers/pages/loadingPage/loadingPage";

const app = new Realm.App({ id: process.env.REACT_APP_REALM_ID });

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Giả sử đã đăng nhập thành công
    setIsLoggedIn(true);
    setInitializing(false);

    // Cập nhật các thẻ <head> khi component được mount
    document.querySelector('meta[name="viewport"]').setAttribute('content', 'width=device-width, initial-scale=1');
    document.querySelector('meta[name="theme-color"]').setAttribute('content', '#000000');
    document.title = "Your App Title";
  }, []);


  if (initializing) {
    return <div> <LoadingPage/> </div>;
  };

  return (
    <Router>
      <Suspense fallback={<div> <LoadingPage/></div>}>
        <Routes>
          {!isLoggedIn ? (
            <Route path="/*" element={<Navigate to="/quan_tri_kho_hang" />} />
          ) : (
            <Route path="/*" element={<MainPage />}/>
          )}
        </Routes>
        {app.currentUser !== null && <Footers />}
      </Suspense>
    </Router>
  );
}

export default App;
