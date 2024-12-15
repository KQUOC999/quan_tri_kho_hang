import React from "react";
import './SubTaskbar.css'

const SubTaskbar = ({ items, onSelect }) => {
  return (
    <div className="subtaskbarContainer">
      {items && items.map((item, index) => (
        <div className="subtaskbarItems" key={index} onClick={() => onSelect(item)}>
          <div className="subtaskbarIcons">
            {item.icon}
          </div>
          <div className="subtaskbarLabel">
            <span>{item.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubTaskbar;
