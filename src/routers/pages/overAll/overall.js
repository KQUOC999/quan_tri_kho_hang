import React, { useState } from 'react';
import * as Realm from 'realm-web';
import styles from './styles.module.css';
import LoadingPage from '../loadingPage/loadingPage';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

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

const Overall = () => {
  const [data] = useState({
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7'],
    datasets: [
      {
        label: 'Nhập hàng',
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
        label: 'Xuất hàng',
        data: [300, 500, 700, 900, 1200, 1400, 1600],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2) ',
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

  const [columnDefsBills] = useState([
    { headerName: 'Hóa đơn mới', field: 'newBills'},
  ]);
  const [rowDataSellBills] = useState([
    {orders:"Không có dữ liệu", quantity: 0, revenue: 0},
  ]);

  const [columnDefsNotification] = useState([
    { headerName: 'Thông báo mới', field: 'newNotifications'},
  ]);
  const [rowDataNotification] = useState([
    {orders:"Không có dữ liệu", quantity: 0, revenue: 0},
  ]); 


  if (!app.currentUser) {
    return <LoadingPage />
  }
  return (
    <div className={styles.container}>
      <div className={styles.containerBody}>
        <div className={styles.leftBody}>
          <div className={styles.leftBodyLayer}>
            <div className={styles.overView}>
              <div className={styles.items}>
                <div className={styles.itemsLayer}>
                  <div className={styles.itemsRetail}>
                    <div className={styles.itemsTypeLayer}>
                      <div className={styles.itemsRetailName}>
                        <span>NHẬP HÀNG</span>
                      </div>

                      <div className={styles.itemsRetailQuantity}>
                        <span>0</span>
                      </div>

                      <div className={styles.itemsRetailStatistical}>
                        <span>0%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.itemsLayer}>
                  <div className={styles.itemsOrder}>
                    <div className={styles.itemsTypeLayer}>
                      <div className={styles.itemsOrderName}>
                        <span>XUẤT HÀNG</span>
                      </div>

                      <div className={styles.itemsOrderQuantity}>
                        <span>0</span>
                      </div>

                      <div className={styles.itemsOrderStatistical}>
                        <span>0%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.itemsLayer}>
                  <div className={styles.itemsInventory}>
                    <div className={styles.itemsTypeLayer}>
                      <div className={styles.itemsInventoryName}>
                        <span>TỒN KHO</span>
                      </div>

                      <div className={styles.itemsInventoryQuantity}>
                        <span>0</span>
                      </div>

                      <div className={styles.itemsInventoryStatistical}>
                        <span>0%</span>
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
            <div className={styles.newBills}>
              <div className={styles.newBillsList}>
                <div style={{width: '100%', padding: '10px' }} className="ag-theme-alpine">
                  <AgGridReact
                    columnDefs={columnDefsBills}
                    rowData={rowDataSellBills}
                    pagination={false}
                    domLayout="autoHeight" 
                  />
                </div>
              </div>
            </div>
            <div className={styles.newNotification}>
              <div className={styles.newNotificationList}>
                <div style={{width: '100%', padding: '10px' }} className="ag-theme-alpine">
                  <AgGridReact
                    columnDefs={columnDefsNotification}
                    rowData={rowDataNotification}
                    pagination={false}
                    domLayout="autoHeight" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overall;
