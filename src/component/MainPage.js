import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route, useNavigate } from 'react-router-dom';
import * as Realm from 'realm-web';
import './MainPage.css';

import { IoPeopleOutline } from "react-icons/io5";
import { RiCustomerService2Line } from "react-icons/ri";
import { MdOutlineAddHomeWork } from "react-icons/md";
import { PiPackage } from "react-icons/pi";
import { IoAccessibilityOutline } from "react-icons/io5";
import { TbPackageImport } from "react-icons/tb";
import { TbReportAnalytics } from "react-icons/tb";
import { TbPackageExport } from "react-icons/tb";
import { TbRulerMeasure } from "react-icons/tb";

import Taskbar from "./T_MainTaskbar";
import SubTaskbar from "./SubTaskbar";
import Account from "../routers/pages/accountLogin/adminAccount";
import AttendancePage from "../routers/pages/home/AttendancePage";
import LoadingPage from "../routers/pages/loadingPage/loadingPage";

const app = new Realm.App({ id: process.env.REACT_APP_REALM_ID });

const MainPage = () => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(app.currentUser);
  //const [, setRole] = useState('');
  const [selectedTaskbar, setSelectedTaskbar] = useState(null);
  const [openTabs, setOpenTabs] = useState([]); // State to store open tabs
  const [activeTab, setActiveTab] = useState(null); // State to store the currently active tab
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      setIsLoggedIn(true);
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    const selectedItem = sessionStorage.getItem('selectedTaskbar');
    if (selectedItem) {
      setSelectedTaskbar(JSON.parse(selectedItem));
    }

    const storedTabs = JSON.parse(localStorage.getItem('openTabs') || '[]');
    setOpenTabs(storedTabs);
    if (storedTabs.length > 0) {
      setActiveTab(storedTabs[0]);
    }
  }, []);
  const user = app.currentUser;
  const checkUserRole = useCallback ( async () => {
    try {
      if (!user || !user.profile || !user.profile.email) {
        throw new Error("User is not logged in or does not have an email.");
      }
      const functionName = "adminAccountRole";
      const userProfile = await user.functions[functionName](user.profile.email);
      console.log(userProfile);

      if (userProfile.error) {
        throw new Error(userProfile.error);
      }

      //setRole(userProfile.role);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Failed to check user role:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect (() => {
    if (isLoggedIn) {
      checkUserRole();
    }
  }, [isLoggedIn, checkUserRole])
/*
  const logout = async () => {
    if (currentUser) {
      await currentUser.logOut();
      setCurrentUser(null);
      setIsLoggedIn(false);
      navigate('/admitration_warehouse_app');
    }
  };
*/
  const handleTaskbarSelect = (taskbar) => {
    setSelectedTaskbar(taskbar);
    sessionStorage.setItem('selectedTaskbar', JSON.stringify({
      label: taskbar.label,
      path: taskbar.path,
      icon: taskbar.icon 
    }));
  };
  

  const handleSubTaskbarSelect = (subTaskbarItem) => {
    const { path, label } = subTaskbarItem; 
    const newTab = { path, label };
    
    setOpenTabs(prevTabs => {
      const updatedTabs = prevTabs.filter(tab => tab.path !== newTab.path);
      const newTabs = [newTab, ...updatedTabs];
      localStorage.setItem('openTabs', JSON.stringify(newTabs));
      setActiveTab(newTab);
      return newTabs;
    });
  };
  

  const handleCloseTab = (tabPath) => {
    const updatedTabs = openTabs.filter(tab => tab.path !== tabPath);
    setOpenTabs(updatedTabs);
    localStorage.setItem('openTabs', JSON.stringify(updatedTabs));

    // If the closed tab was the active tab, set the next available tab as active
    if (activeTab && activeTab.path === tabPath && updatedTabs.length > 0) {
      setActiveTab(updatedTabs[0]);
    } else if (updatedTabs.length === 0) {
      setActiveTab(null);
    }
  };

  const renderTabContent = () => {
    if (!activeTab) return null; // No active tab

    switch(activeTab.path) {
      case "/quản_trị/overview":
        return <AttendancePage />;
      case "/quản_trị/supplier":
        return <LoadingPage/>;
      case "/quản_trị/package":
        return null;
      case "/quản_trị/employee":
        return null;
      case "/quản_trị/customer":
        return null;
      case "/quản_trị/importPackage":
        return null;
      case "/quản_trị/exportPackage":
        return null;
      case "/quản_trị/reporting":
        return null;

      case "/tùy_chỉnh/decentralization":
        return null;
      case "/tùy_chỉnh/unit":
        return null;
      case "/tùy_chỉnh/nghỉ_chế_độ":
        return null;
      case "/tùy_chỉnh/phép_năm":
        return null;
      case "/tùy_chỉnh/phân_giờ":
        return null;
      case "/tùy_chỉnh/chọn_dữ_liệu":
        return null;
      case "/tùy_chỉnh/xóa_dữ_liệu":
        return null;
      default:
        return null;
    }
  };

  const taskbarItems = [
    { label: "Quản trị", path: "/quản_trị" },
    { label: "Tùy chỉnh", path: "/tùy_chỉnh" },
  ];

  const attendanceSubTaskbarItems = [
    { label: "Tổng quan", path: "/quản_trị/overview", icon: <TbRulerMeasure size={20}/> },
    { label: "Nhà cung cấp", path: "/quản_trị/supplier", icon: <MdOutlineAddHomeWork size={20}/> },
    { label: "Hàng hóa", path: "/quản_trị/package", icon: <PiPackage size={20} />},
    { label: "Nhân viên", path: "/quản_trị/employee", icon: <IoPeopleOutline size={20}/> },
    { label: "Khách hàng", path: "/quản_trị/customer", icon: <RiCustomerService2Line size={20}/> },
    { label: "Nhập hàng", path: "/quản_trị/importPackage", icon: <TbPackageImport size={20}/> },
    { label: "Xuất hàng", path: "/quản_trị/exportPackage", icon: <TbPackageExport size={20}/>},
    { label: "Báo cáo", path: "/quản_trị/reporting", icon: <TbReportAnalytics size={20}/> }
  ];

  const customizationSubTaskbarItems = [
    { label: "Phân quyền", path: "/tùy_chỉnh/decentralization", icon: <IoAccessibilityOutline size={20}/> },
    { label: "Đơn vị", path: "/tùy_chỉnh/unit", icon: <TbRulerMeasure size={20}/> },
    { label: "Nghỉ chế độ", path: "/tùy_chỉnh/nghỉ_chế_độ"},
    { label: "Phép năm", path: "/tùy_chỉnh/phép_năm" },
    { label: "Phân giờ", path: "/tùy_chỉnh/phân_giờ" },
    { label: "Chọn dữ liệu", path: "/tùy_chỉnh/chọn_dữ_liệu" },
    { label: "Form", path: "/form-page" },
    { label: "NodeRed", path: "/client-page" },
    { label: "Search", path: "/search-page" }
  ];

  if (loading) {
    return <div> <LoadingPage /> </div>;
  }

  return (
    <div className="main-page">
      {isLoggedIn ? (
        <>
          <div className="taskbar-container">
            <Taskbar items={taskbarItems} onSelect={handleTaskbarSelect} />
            <div className="extendTaskbarList">
              <div className="extendTaskbarListContainer">
                <span>Hỗ trợ</span>
                <span>Góp ý</span>
                <span>Hộp thư</span>
                <span>Tài khoản</span>
              </div>
            </div>
          </div>
          {selectedTaskbar && (
            <SubTaskbar
              items={
                selectedTaskbar.label === "Quản trị"
                  ? attendanceSubTaskbarItems
                  : customizationSubTaskbarItems
              }
              onSelect={handleSubTaskbarSelect}
            />
          )}
          
          <div className="container-main-page">
            <div className="open-tabs">
              {openTabs.reverse().map(tab => (
                <div key={tab.path} className="tab-item">
                  <span
                    className={`tab-label ${tab.path === activeTab?.path ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.label}
                  </span>
                  <button onClick={() => handleCloseTab(tab.path)}>x</button>
                </div>
              ))}
            </div>
            {activeTab && (
              <div className="tab-content">
                <div className="tab-body">
                  {renderTabContent()}
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-screen">
          <Routes>
            <Route path="/admitration_warehouse_app" element={<Account />} />
          </Routes>
        </div>
      )}
    </div>
  );
};

export default MainPage;