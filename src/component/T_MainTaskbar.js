import React from "react";
import { Link } from 'react-router-dom';
import './styles.taskbar.css'
import logo from '../logo/logo_warehouse.png';

const Taskbar = ({ items, onSelect }) => {
  return (
    <div className="taskbarContainer">
      <div className="taskbarLogo">
        <img src={logo} alt="Warehouse Logo" className="taskbarWarehouseLogo"/>
      </div>
      {items && items.map((item, index) => (
        <div className="taskbarItems" key={index} onClick={() => onSelect(item)}>
          <Link to={item.path} className="taskbarLink">
            <div className="taskbarIcon">{item.icon}</div>
            <span className="taskbarLabel">{item.label}</span>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Taskbar;
