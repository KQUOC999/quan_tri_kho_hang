import React, { useState } from 'react';
import styles from './styles.module.css'

import { FaAngleUp } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";

const PermissionViewData = () => {
  const [isOpenDropList, setIsOpenDropList] = useState(true);
  const [isRotatedIconDropList, setIsRotatedIconDropList] = useState(true);

  const [permissions, setPermissions] = useState([
    {
      label: "Danh sách khách hàng",
      description: "Giới hạn nhân viên chỉ được nhìn thấy các khách hàng gắn cho nhân viên đó phụ trách.",
      checked: false
    },
    {
      label: "Danh sách khách hàng",
      description: "Giới hạn nhân viên chỉ nhìn thấy khách hàng có 'cửa hàng mua cuối cùng' là các cửa hàng được quản lý.",
      checked: false
    },
    {
      label: "Danh sách phiếu XNK nháp",
      description: "Giới hạn nhân viên chỉ thấy các yêu cầu xuất nhập kho do người đó tạo.",
      checked: false
    },
    {
      label: "Danh sách phiếu XNK",
      description: "Giới hạn nhân viên chỉ thấy phiếu xuất nhập kho do người đó tạo.",
      checked: false
    },
    {
      label: "Báo cáo doanh thu theo nhân viên",
      description: "Cho phép nhân viên bán hàng hoặc nhân viên thu ngân được phân quyền xem báo cáo này sẽ được xem doanh thu của các nhân viên khác.",
      checked: false
    },
    {
      label: "Báo cáo doanh thu theo cửa hàng",
      description: "Cho phép nhân viên được phân quyền xem báo cáo này sẽ được xem doanh số toàn bộ các cửa hàng (thường dùng để khen thưởng, khách lệ thi đua).",
      checked: false
    },
    {
      label: "Báo cáo đơn hàng theo kênh bán",
      description: "Cho phép nhân viên được phân quyền xem báo cáo này sẽ được xem doanh số toàn bộ nhân viên, không bị giới hạn bởi các đơn do nhân viên đó tạo.",
      checked: false
    }
  ]);

  const handleCheckboxChange = (index) => {
    const updatedPermissions = [...permissions];
    updatedPermissions[index].checked = !updatedPermissions[index].checked;
    setPermissions(updatedPermissions);
  };

  const renderPermissionList = () => {
    return permissions.map((permission, index) => (
      <div key={index} className={styles.permissions}>
        <label className={styles.switch}>
          <input 
            type="checkbox" 
            checked={permission.checked} 
            onChange={() => handleCheckboxChange(index)}
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
            <span>Phân quyền xem dữ liệu</span>
          </div>
          <div className={styles.headerIconActive} onClick={handleToggleDropList}>
            <FaAngleUp style={{ transform: isRotatedIconDropList ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
          </div>
        </div>
        <div className={styles.dropListContainer}>
          {isOpenDropList && (
            <div className={styles.dropListContainerLayer}>
              <div className={styles.dropListItem}>
                {renderPermissionList()}
              </div>
              <div className={styles.dropListItem}>
                {renderPermissionList()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PermissionViewData;
