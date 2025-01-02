import React, {useEffect, useState} from 'react';
import * as Realm from 'realm-web';
import LoadingPage from '../../loadingPage/loadingPage';
import styles from './styles.module.css'

import { AiOutlineMenuUnfold } from "react-icons/ai";
import { LuWarehouse } from "react-icons/lu";
import { CgTime } from "react-icons/cg";
import { CiViewList } from "react-icons/ci";
import { VscHome } from "react-icons/vsc";
import { FaAngleDown } from "react-icons/fa";
import { MdCalendarMonth } from "react-icons/md";
import { RiCalendarEventLine } from "react-icons/ri";
import { FaRegCalendarCheck } from "react-icons/fa6";
import { FaCalendarWeek } from "react-icons/fa6";
import { MdOutlineCalendarMonth } from "react-icons/md";

import OrderPage from '../order/orderPage';
import { useAppContext } from '../../appContext/AppContext';

const app = new Realm.App({ id: process.env.REACT_APP_REALM_ID });

const Reporting = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 500);
  const [isVisible, setIsVisible] = useState(false);
  const [activePage, setActivePage] = useState('revenue');
  const [isOpenDropListChoose, setIsOpenDropListChoose] = useState(false);
  const {selectedDay} = useAppContext();
  const {setSelectedDay} = useAppContext();

  const toggleSidebar = () => {
    setIsVisible(!isVisible);
  };

  const handleOpenDropListChoose = () => {
    setIsOpenDropListChoose(!isOpenDropListChoose);
  }

  const handleNavigation = (page) => {
    setActivePage(page);
    setIsVisible(false);
    
    localStorage.setItem('activePageReporting', page);
  };


  useEffect(() => {
    const savedPage = localStorage.getItem('activePageReporting');
    
    if (savedPage) {
      setActivePage(savedPage);
    }

    if (savedPage === null) {
      setActivePage('revenue');
    }

    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 1000);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const switchDay = (day) => {
    const Day = ['Hôm nay', 'Hôm qua', 'Tuần này', 'Tháng này', 'Tháng trước'];
    const Default = 'Hôm qua';
    const response = Day.find(item => item === day);
    if (!response) return Default
    return response;
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

          <div className={styles.menuTabChoose}>
            <div className={styles.menuTabChooseIcon}>
              <MdCalendarMonth size={isSmallScreen ? 20 : 20}/>
            </div>

            <div className={styles.menuTabChooseActive}>
              <span>{switchDay(selectedDay)}</span>
              <div className={styles.menuTabChooseActiveIcon} onClick={handleOpenDropListChoose}>
                <FaAngleDown size={isSmallScreen ? 20 : 20}/>
              </div>
            </div>

            {isOpenDropListChoose && (
              <div className={styles.menuTabChooseDropList}>
                <div className={styles.menuTabChooseDropListBody}>
                    <div className={styles.menuTabToday} onClick={() => setSelectedDay('Hôm nay')}>
                      <FaRegCalendarCheck size={isSmallScreen ? 15 : 15}/>
                      <span>Hôm nay</span>
                    </div>

                    <div className={styles.menuTabYesterday} onClick={() => setSelectedDay('Hôm qua')}>
                      <RiCalendarEventLine size={isSmallScreen ? 15 : 15}/>
                      <span>Hôm qua</span>
                    </div>

                    <div className={styles.menuTabThisWeek} onClick={() => setSelectedDay('Tuần này')}>
                      <FaCalendarWeek size={isSmallScreen ? 15 : 15}/>
                      <span>Tuần này</span>
                    </div>

                    <div className={styles.menuTabTodayThisMonth} onClick={() => setSelectedDay('Tháng này')}>
                      <MdOutlineCalendarMonth size={isSmallScreen ? 15 : 15}/>
                      <span>Tháng này</span>
                    </div>

                    <div className={styles.menuTabTodayLastMonth} onClick={() => setSelectedDay('Tháng trước')}>
                      <MdOutlineCalendarMonth size={isSmallScreen ? 15 : 15}/>
                      <span>Tháng trước</span>
                    </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className={`${styles.sidebar} ${isVisible ? styles.visible : ""}`}>
          <div className={styles.sidebarContent}>
            <ul>
              <div className={styles.sidebarContentItems} >
                <div className={`${styles.sidebarContentInventory} ${activePage === 'order' ? styles.active : ''}`} 
                  onClick={() => handleNavigation('order')}>
                  <LuWarehouse size={isSmallScreen ? 15 : 16}/>
                  <li>Đơn hàng</li>
                </div>       
              </div>

              <div className={styles.sidebarContentItems} >
                <div className={styles.sidebarContentProducts}>
                  <CgTime size={isSmallScreen ? 15 : 16}/>
                  <li>Tồn kho</li>
                </div>       
              </div>

              <div className={styles.sidebarContentItems} >
                <div className={styles.sidebarContentProducts}>
                  <CiViewList size={isSmallScreen ? 15 : 16}/>
                  <li>Sản phẩm</li>
                </div>       
              </div>  

              <div className={styles.sidebarContentItems} >
                <div className={styles.sidebarContentProducts}>
                  <VscHome size={isSmallScreen ? 15 : 16}/>
                  <li>Khách hàng</li>
                </div>       
              </div>     
            </ul>
          </div>
        </div>

        <div className={styles.pageContent}>
          {activePage === 'order' && <OrderPage />}
        </div>
      </div>
    </div>
  );
};

export default Reporting;
