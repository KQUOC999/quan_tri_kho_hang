import React, { useState } from 'react';
import * as Realm from 'realm-web';
import styles from './styles.module.css';
import LoadingPage from '../../loadingPage/loadingPage';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useAppContext } from '../../appContext/AppContext';

import { FaAngleUp } from "react-icons/fa";
import { RiCalendarEventLine } from "react-icons/ri";
import { FaRegCalendarCheck } from "react-icons/fa6";
import { FaCalendarWeek } from "react-icons/fa6";
import { MdOutlineCalendarMonth } from "react-icons/md";

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import 'chartjs-plugin-datalabels'; 

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const app = new Realm.App({ id: process.env.REACT_APP_REALM_ID });

const OrderPage = () => {
  const [data] = useState({
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7'],
    datasets: [
      {
        label: 'Doanh thu',
        data: [1000, 2000, 1500, 2500, 3000, 3500, 4000],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4,
        datalabels: {
          anchor: 'end',
          align: 'end',
        },
      },
      {
        label: 'Bán lẻ',
        data: [800, 1500, 1000, 2000, 2500, 3000, 3500],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.4,
        datalabels: {
          anchor: 'end',
          align: 'end',
        },
      },
      {
        label: 'Đơn hàng',
        data: [300, 500, 700, 900, 1200, 1400, 1600],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
        tension: 0.4,
        datalabels: {
          anchor: 'end',
          align: 'end',
        },
      },
      {
        label: 'Tồn kho',
        data: [500, 400, 300, 200, 100, 50, 0],
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        fill: true,
        tension: 0.4,
        datalabels: {
          anchor: 'end',
          align: 'end',
        },
      },
    ],
  });

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Biểu đồ Doanh thu, Bán lẻ, Đơn hàng và Tồn kho',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            // Hiển thị thông tin cho mỗi điểm dữ liệu
            return `${context.dataset.label}: ${context.raw}`;
          },
        },
      },
      datalabels: {
        display: true,
        align: 'top',
        anchor: 'end',
      },
    },
    onHover: (event, chartElement) => {
      if (chartElement.length) {
        event.native.target.style.cursor = 'pointer';
      } else {
        event.native.target.style.cursor = 'default';
      }
    },
  };

  const [columnDefsSellChanel] = useState([
    { headerName: 'Sản phẩm', field: 'product', width: '200px' },
    { headerName: 'SL', field: 'numberProduct', width: '160px' },
    { headerName: 'Doanh thu', field: 'revenue', width: '160px' },
  ]);
  const [rowDataSellChanel] = useState([
    { salesChannel: 'Online', orders: 120, orderPercentage: '30%', revenue: 3000, revenuePercentage: '40%' },
  ]);

  const [columnDefsReconciliation] = useState([
    { headerName: 'Tình trạng', field: 'status'},
    { headerName: 'Đơn', field: 'order'},
    { headerName: 'Tổng tiền', field: 'totalRevenue'},
  ]);
  const [rowDataReconciliation] = useState([
    {status:"Đã lên đơn", order: 0, totalRevenue: 0},
    {status:"Đã vận chuyển", order: 0, totalRevenue: 0},
    {status:"Đang chuyển", order: 0, totalRevenue: 0},
    {status:"Đang hoàn", order: 0, totalRevenue: 0},
    {status:"Thất bại", order: 0, totalRevenue: 0},
    {status:"Đã thành công", order: 0, totalRevenue: 0},
    {status:"Đã đối soát", order: 0, totalRevenue: 0}
  ]);

  const [isOpensellChanel, setIsOpensellChanel] = useState(false);
  const [isRotatedsellChanel, setIsRotatedsellChanel] = useState(false);
  const [isOpenDashBoardProduct, setIsOpenDashBoardProduct] = useState(false);
  const [isRotatedDashBoardProduct, setIsRotatedDashBoardProduct] = useState(false);
  const [isOpenEmployee, setIsOpenEmployee] = useState(false);
  const [isRotatedEmployee, setIsRotatedEmployee] = useState(false);
  const [isOpenreconciliation, setIsOpenreconciliation] = useState(false);
  const [isRotatedreconciliation, setIsRotatedreconciliation] = useState(false);
  const {selectedDay} = useAppContext();

  const toggleDropdownsellChanel = () => {
    setIsOpensellChanel(!isOpensellChanel);
    setIsRotatedsellChanel(!isRotatedsellChanel);
  };

  const toggleDropdownDashBoardProduct = () => {
    setIsOpenDashBoardProduct(!isOpenDashBoardProduct);
    setIsRotatedDashBoardProduct(!isRotatedDashBoardProduct);
  };

  const toggleDropdownEmployee = () => {
    setIsOpenEmployee(!isOpenEmployee);
    setIsRotatedEmployee(!isRotatedEmployee);
  };

  const toggleDropdownReconciliation = () => {
    setIsOpenreconciliation(!isOpenreconciliation)
    setIsRotatedreconciliation(!isRotatedreconciliation);
  };

  if (!app.currentUser) {
    return <LoadingPage />
  }
  return (
    <div className={styles.container}>
      <div className={styles.containerLayer}>
        <div className={styles.containerLeftRightBody}>
          <div className={styles.leftBody}>
            <div className={styles.leftBodyLayer}>
              <div className={styles.overView}>
                <div className={styles.items}>
                  <div className={styles.itemsLayer}>
                    <div className={`${styles.itemsYesterday} ${selectedDay === 'Hôm qua' ? styles.active : ''}`}>
                      <div className={styles.itemsTypeLayer}>
                        <div className={styles.itemsYesterdayName}>
                          <RiCalendarEventLine />
                          <span>HÔM QUA</span>
                        </div>

                        <div className={styles.itemsYesterdayQuantity}>
                          <span>0</span>
                        </div>

                        <div className={styles.itemsYesterdayStatistical}>
                          <span>0%</span>
                          <span>(0 đơn)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.itemsLayer}>
                    <div className={`${styles.itemsToday} ${selectedDay === 'Hôm nay' ? styles.active : ''}`}>
                      <div className={styles.itemsTypeLayer}>
                        <div className={styles.itemsTodayName}>
                          <FaRegCalendarCheck />
                          <span>HÔM NAY</span>
                        </div>

                        <div className={styles.itemsTodayQuantity}>
                          <span>0</span>
                        </div>

                        <div className={styles.itemsTodayStatistical}>
                          <span>0%</span>
                          <span>(0 đơn)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.itemsLayer}>
                    <div className={`${styles.itemsWeekly} ${selectedDay === 'Tuần này' ? styles.active : ''}`}>
                      <div className={styles.itemsTypeLayer}>
                        <div className={styles.itemsWeeklyName}>
                          <FaCalendarWeek />
                          <span>TUẦN NÀY</span>
                        </div>

                        <div className={styles.itemsWeeklyQuantity}>
                          <span>0</span>
                        </div>

                        <div className={styles.itemsWeeklyStatistical}>
                          <span>0%</span>
                          <span>(0 đơn)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.itemsLayer}>
                    <div className={`${styles.itemsMonth} ${selectedDay === 'Tháng này' ? styles.active : ''}`}>
                      <div className={styles.itemsTypeLayer}>
                        <div className={styles.itemsMonthName}>
                          <MdOutlineCalendarMonth />
                          <span>THÁNG NÀY</span>
                        </div>

                        <div className={styles.itemsMonthQuantity}>
                          <span>0</span>
                        </div>

                        <div className={styles.itemsMonthStatistical}>
                          <span>0%</span>
                          <span>(0 đơn)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.diagram}>
                  <div className={styles.diagramLayer}>
                    <Line
                      data={data}
                      options={options}
                      onHover={(e, chartElement) => {
                        if (chartElement.length) {
                          e.native.target.style.cursor = 'pointer';
                        } else {
                          e.native.target.style.cursor = 'default';
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.rightBody}>
            <div className={styles.rightBodyLayer}>
              <div className={styles.reconciliation}>
                <div className={styles.reconciliationHeader}>
                  <div className={styles.reconciliationHeaderName}>
                    <span>Đối soát</span>
                  </div>
                  <div className={styles.reconciliationHeaderIcon} onClick={toggleDropdownReconciliation}>
                    <FaAngleUp style={{ transform: isRotatedreconciliation ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
                  </div>
                </div>
                <div className={styles.reconciliationBody}>
                  {isOpenreconciliation && (
                    <div className={styles.reconciliationAgridTable}>
                      <div style={{width: '100%', border: 'none'}} className="ag-theme-alpine">
                        <AgGridReact
                          columnDefs={columnDefsReconciliation}
                          rowData={rowDataReconciliation}
                          pagination={false}
                          domLayout="autoHeight" 
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.containerBottomBody}>
          <div className={styles.containerStatisticalTable}>
            <div className={styles.containerStatisticalTableLeft}>
              <div className={styles.sellChanel}>
                <div className={styles.sellChanelHeader}>
                  <div className={styles.sellChanelHeaderName}>
                    <span>Top sản phẩm</span>
                  </div>
                  <div className={styles.sellChanelHeaderIcon} onClick={toggleDropdownsellChanel}>
                    <FaAngleUp style={{ transform: isRotatedsellChanel ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
                  </div>
                </div>
                <div className={styles.sellChanelBody}>
                  {isOpensellChanel && (
                    <div className={styles.sellChanelAgridTable}>
                      <div style={{width: '100%', border: 'none'}} className="ag-theme-alpine">
                        <AgGridReact
                          columnDefs={columnDefsSellChanel}
                          rowData={rowDataSellChanel}
                          pagination={false}
                          domLayout="autoHeight" 
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.containerStatisticalTableRight}>
              <div className={styles.dashBoardProduct}>
                <div className={styles.dashBoardProductHeader}>
                  <div className={styles.dashBoardProductHeaderName}>
                    <span>Danh mục sản phẩm</span>
                  </div>
                  <div className={styles.dashBoardProductIcon} onClick={toggleDropdownDashBoardProduct}>
                    <FaAngleUp style={{ transform: isRotatedDashBoardProduct ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
                  </div>
                </div>
                <div className={styles.dashBoardProductBody}>
                  {isOpenDashBoardProduct && (
                    <div className={styles.dashBoardProductAgridTable}>
                      <div style={{width: '100%', border: 'none'}} className="ag-theme-alpine">
                        <AgGridReact
                          columnDefs={columnDefsSellChanel}
                          rowData={rowDataSellChanel}
                          pagination={false}
                          domLayout="autoHeight" 
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.employee}>
                <div className={styles.employeeHeader}>
                  <div className={styles.employeeHeaderName}>
                    <span>Nhân viên</span>
                  </div>
                  <div className={styles.employeeHeaderIcon} onClick={toggleDropdownEmployee}>
                    <FaAngleUp style={{ transform: isRotatedEmployee ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
                  </div>
                </div>
                <div className={styles.employeeBody}>
                  {isOpenEmployee && (
                    <div className={styles.employeeAgridTable}>
                      <div style={{width: '100%', border: 'none'}} className="ag-theme-alpine">
                        <AgGridReact
                          columnDefs={columnDefsSellChanel}
                          rowData={rowDataSellChanel}
                          pagination={false}
                          domLayout="autoHeight" 
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
