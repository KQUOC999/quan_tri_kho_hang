import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from 'react-router-dom';
import * as Realm from 'realm-web';
import './MainPage.css';
import Taskbar from "./T_MainTaskbar";
import SubTaskbar from "./SubTaskbar";
import Account from "../routers/pages/accountLogin/highAdminAccount";
import AttendancePage from "../routers/pages/home/AttendancePage";


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
/*
  const checkUserRole = async (user) => {
    try {
      if (!user || !user.profile || !user.profile.email) {
        throw new Error("User is not logged in or does not have an email.");
      }
      const functionName = "checkUserRole";
      const userProfile = await user.functions[functionName](user.profile.email);
      if (userProfile.error) {
        throw new Error(userProfile.error);
      }
      setRole(userProfile.role);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Failed to check user role:", error);
    } finally {
      setLoading(false);
    }
  };
*/
  const logout = async () => {
    if (currentUser) {
      await currentUser.logOut();
      setCurrentUser(null);
      setIsLoggedIn(false);
      navigate('/form-salary-page');
    }
  };

  const handleTaskbarSelect = (taskbar) => {
    setSelectedTaskbar(taskbar);
    sessionStorage.setItem('selectedTaskbar', JSON.stringify(taskbar));
  };

  const handleSubTaskbarSelect = (subTaskbarItem) => {
    setOpenTabs(prevTabs => {
      // Remove existing tab if it exists
      const updatedTabs = prevTabs.filter(tab => tab.path !== subTaskbarItem.path);
      const newTabs = [subTaskbarItem, ...updatedTabs];
      localStorage.setItem('openTabs', JSON.stringify(newTabs));
      setActiveTab(subTaskbarItem);
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
      case "/main-page":
        return <AttendancePage />;
      case "/client-page":
        return null;
      case "/search-page":
        return null;
      case "/tính_công/employee":
        return null;
      case "/tính_công/workshift":
        return null;;
      case "/tính_công/marking_scheme":
        return null;
      case "/tính_công/schedule":
        return null;
      case "/tính_công/employee_schedule":
        return null;
      case "/tính_công/time_clock_machine":
        return null;
      case "/tính_công/reporting":
        return null;
      case "/tính_công/time_clock_hours":
        return null;
      case "/tính_công/current_status":
        return null;
      case "/tùy_chỉnh/phân_quyền":
        return null;
      case "/tùy_chỉnh/sơ_đồ":
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
    { label: "Tính công", path: "/tính_công" },
    { label: "Tùy chỉnh", path: "/tùy_chỉnh" }
  ];

  const attendanceSubTaskbarItems = [
    { label: "Nhân viên", path: "/tính_công/employee" },
    { label: "Ca làm việc", path: "/tính_công/workshift" },
    { label: "Cách chấm", path: "/tính_công/marking_scheme" },
    { label: "Lịch trình", path: "/tính_công/schedule" },
    { label: "Lịch nhân viên", path: "/tính_công/employee_schedule" },
    { label: "Máy chấm công", path: "/tính_công/time_clock_machine" },
    { label: "Báo cáo", path: "/tính_công/reporting" },
    { label: "Giờ chấm công", path: "/tính_công/time_clock_hours" },
    { label: "Hiện hành", path: "/tính_công/current_status" }
  ];

  const customizationSubTaskbarItems = [
    { label: "Phân quyền", path: "/tùy_chỉnh/phân_quyền" },
    { label: "Sơ đồ", path: "/tùy_chỉnh/sơ_đồ" },
    { label: "Nghỉ chế độ", path: "/tùy_chỉnh/nghỉ_chế_độ"},
    { label: "Phép năm", path: "/tùy_chỉnh/phép_năm" },
    { label: "Phân giờ", path: "/tùy_chỉnh/phân_giờ" },
    { label: "Chọn dữ liệu", path: "/tùy_chỉnh/chọn_dữ_liệu" },
    { label: "Form", path: "/form-page" },
    { label: "NodeRed", path: "/client-page" },
    { label: "Search", path: "/search-page" }
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="main-page">
      {isLoggedIn ? (
        <>
          <div className="taskbar-container">
            <Taskbar items={taskbarItems} onSelect={handleTaskbarSelect} />
            <button onClick={logout}>Logout</button>
          </div>
          {selectedTaskbar && (
            <SubTaskbar
              items={
                selectedTaskbar.label === "Tính công"
                  ? attendanceSubTaskbarItems
                  : customizationSubTaskbarItems
              }
              onSelect={handleSubTaskbarSelect}
            />
          )}
          
          <div className="container-main-page">
            {/* Display list of open tabs horizontally */}
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
            {/* Display content of the active tab */}
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