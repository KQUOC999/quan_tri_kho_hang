
import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children, initialFormData }) => {
    const [formData, setFormData] = useState(initialFormData || {});
    const [jsonSchemaAccountDetails, setJonSchemaAccountDetails] = useState(null);
    const [dataDataAdress, setDataAdress] = useState([]);
    const [data, setData] = useState({});
    const [addNewItem, setAddNewItem] = useState(false);
    const [addPrintCode, setAddPrintCode] = useState(false);
    const [selectedDay, setSelectedDay] = useState('Hôm qua');
    const [addNewEmployees, setAddNewEmployees] = useState(false);
    const [addNewEmployeesDecentralization, setAddNewEmployeesDecentralization] = useState(false);
    const [addNewItemImportPackage, setAddNewItemImportPackage] = useState(false);
    const [addNewItemExportPackage, setAddNewItemExportPackage] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [activePage, setActivePage] = useState('product');
    const [access, setAccess] = useState(null);

    const [rowData, setRowData] = useState([
        { page: 'Hàng hóa' , category: 'Sản phẩm', feature: 'Thêm mới', highAdminRole: false, mediumAdminRole: false, lowAdminRole: true },
        { page: 'Hàng hóa' , category: 'Sản phẩm', feature: 'Thêm từ Excell', highAdminRole: false, mediumAdminRole: true, lowAdminRole: false },
        { page: 'Hàng hóa' , category: 'Sản phẩm', feature: 'Xuất Excell', highAdminRole: false, mediumAdminRole: false, lowAdminRole: false },
        { page: 'Hàng hóa' , category: 'Sản phẩm', feature: 'In mã vạch', highAdminRole: false, mediumAdminRole: false, lowAdminRole: false },
        { page: 'Hàng hóa' , category: 'Sản phẩm', feature: 'Gãn nhãn', highAdminRole: false, mediumAdminRole: false, lowAdminRole: false },
        { page: 'Hàng hóa' , category: 'Sản phẩm', feature: 'Gỡ nhãn', highAdminRole: false, mediumAdminRole: false, lowAdminRole: false },
        { page: 'Hàng hóa' , category: 'Sản phẩm', feature: 'Xóa các dòng đã chọn', highAdminRole: false, mediumAdminRole: false, lowAdminRole: false },
        { page: 'Hàng hóa' , category: 'Tồn kho', feature: 'Xuất file', highAdminRole: false, mediumAdminRole: false, lowAdminRole: false },
        { page: 'Hàng hóa' , category: 'Tồn kho', feature: 'Nhập file', highAdminRole: false, mediumAdminRole: false, lowAdminRole: false },
        { page: 'Hàng hóa' , category: 'Tồn kho', feature: 'Cập nhật', highAdminRole: false, mediumAdminRole: false, lowAdminRole: false },
        { page: 'Hàng hóa' , category: 'Tồn kho', feature: 'In mã', highAdminRole: false, mediumAdminRole: false, lowAdminRole: false },
        { page: 'Hàng hóa' , category: 'Tồn kho', feature: 'Sao chép', highAdminRole: false, mediumAdminRole: false, lowAdminRole: false },
        { page: 'Hàng hóa' , category: 'Tồn kho', feature: 'Xóa', highAdminRole: false, mediumAdminRole: false, lowAdminRole: false },
        { page: 'Hàng hóa' , category: 'Danh sách sản phẩm', feature: 'Xuất file', highAdminRole: false, mediumAdminRole: false, lowAdminRole: false },
        { page: 'Hàng hóa' , category: 'Danh sách sản phẩm', feature: 'Nhập file', highAdminRole: false, mediumAdminRole: false, lowAdminRole: false },
        { page: 'Hàng hóa' , category: 'Danh sách sản phẩm', feature: 'Thêm sản phẩm', highAdminRole: false, mediumAdminRole: false, lowAdminRole: false },
        { page: 'Hàng hóa' , category: 'Danh sách sản phẩm', feature: 'Cập nhật', highAdminRole: false, mediumAdminRole: false, lowAdminRole: false },
        { page: 'Hàng hóa' , category: 'Danh sách sản phẩm', feature: 'In mã', highAdminRole: false, mediumAdminRole: false, lowAdminRole: false },
        { page: 'Hàng hóa' , category: 'Danh sách sản phẩm', feature: 'Sao chép', highAdminRole: false, mediumAdminRole: false, lowAdminRole: false },
        { page: 'Hàng hóa' , category: 'Danh sách sản phẩm', feature: 'Xóa', highAdminRole: false, mediumAdminRole: false, lowAdminRole: false },
        { page: 'Hàng hóa' , category: 'Danh mục sản phẩm', feature: 'Thêm danh mục', highAdminRole: false, mediumAdminRole: false, lowAdminRole: false },
        { page: 'Hàng hóa' , category: 'Danh mục sản phẩm', feature: 'Xóa', highAdminRole: false, mediumAdminRole: false, lowAdminRole: false },
        { page: 'Hàng hóa' , category: 'Danh mục sản phẩm', feature: 'Lưu', highAdminRole: false, mediumAdminRole: false, lowAdminRole: false },
        // Các quyền khác...
      ]);

    const accessPage = (page, category, task, access) => {
        const result = rowData
            .filter(item => 
                    item.page.includes(page) && 
                    item.category.includes(category) && 
                    item.feature.includes(task)
            )
            .some(element => 
                 (element.highAdminRole === true && access === process.env.REACT_APP_HIGH_ADMIN_ROLE) ||
                 (element.mediumAdminRole === true && access === process.env.REACT_APP_MEDIUM_ADMIN_ROLE) ||
                 (element.lowAdminRole === true && access === process.env.REACT_APP_LOW_ADMIN_ROLE)
            );
    
        return result;
    };
    
    const handleNavigation = (page) => {
        setActivePage(page);
        setIsVisible(false);
        
        localStorage.setItem('activePageMerchandise', page);
    };

    return (
        <AppContext.Provider value={{   dataDataAdress, setDataAdress, formData, setFormData, jsonSchemaAccountDetails, setJonSchemaAccountDetails,
                                        data, setData, addNewItem, setAddNewItem, addPrintCode, setAddPrintCode,
                                        selectedDay, setSelectedDay, addNewEmployeesDecentralization, setAddNewEmployeesDecentralization,
                                        addNewEmployees, setAddNewEmployees, addNewItemImportPackage, setAddNewItemImportPackage,
                                        addNewItemExportPackage, setAddNewItemExportPackage,
                                        isVisible, setIsVisible, activePage, setActivePage, handleNavigation,
                                        access, setAccess,
                                        rowData, setRowData,
                                        accessPage }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    return useContext(AppContext);
};
