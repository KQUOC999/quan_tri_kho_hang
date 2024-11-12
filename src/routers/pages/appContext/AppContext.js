
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
    const [isShowButtonBackProductImportPage, setIsShowButtonBackProductImportPage] = useState(true);

    const [rowData, setRowData] = useState([
        { page: 'Hàng hóa' , category: 'Sản phẩm', feature: 'Thêm mới', highAdminRole: true, mediumAdminRole: false, lowAdminRole: true },
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

    const [permissionsHighAdmin, setPermissionsHighAdmin] = useState([
        {
          label: "Tổng quan",
          description: "Giới hạn quyền truy cập của nhân viên để chỉ xem các khách hàng mà họ phụ trách.",
          checked: true
        },
        {
          label: "Hàng hóa",
          description: "Giới hạn quyền truy cập của nhân viên để chỉ thấy các khách hàng có 'cửa hàng mua cuối cùng' là những cửa hàng mà họ quản lý.",
          checked: true
        },
        {
          label: "Nhập hàng",
          description: "Giới hạn quyền truy cập của nhân viên để chỉ thấy các yêu cầu nhập hàng do chính họ tạo.",
          checked: true
        },
        {
          label: "Xuất hàng",
          description: "Giới hạn quyền truy cập của nhân viên để chỉ thấy các phiếu xuất hàng do chính họ tạo.",
          checked: true
        },
        {
          label: "Báo cáo",
          description: "Cho phép nhân viên bán hàng hoặc thu ngân được quyền xem báo cáo này và xem doanh thu của các nhân viên khác.",
          checked: true
        },
        {
          label: "Nhân viên",
          description: "Cho phép nhân viên được quyền xem báo cáo này để theo dõi doanh số toàn bộ các cửa hàng (thường dùng cho mục đích khen thưởng hoặc thi đua).",
          checked: true
        }    
      ]);
    
      const [permissionsMediumAdmin, setPermissionsMediumAdmin] = useState([
        {
          label: "Tổng quan",
          description: "Giới hạn quyền truy cập của nhân viên để chỉ xem các khách hàng mà họ phụ trách.",
          checked: false
        },
        {
          label: "Hàng hóa",
          description: "Giới hạn quyền truy cập của nhân viên để chỉ thấy các khách hàng có 'cửa hàng mua cuối cùng' là những cửa hàng mà họ quản lý.",
          checked: false
        },
        {
          label: "Nhập hàng",
          description: "Giới hạn quyền truy cập của nhân viên để chỉ thấy các yêu cầu nhập hàng do chính họ tạo.",
          checked: true
        },
        {
          label: "Xuất hàng",
          description: "Giới hạn quyền truy cập của nhân viên để chỉ thấy các phiếu xuất hàng do chính họ tạo.",
          checked: false
        },
        {
          label: "Báo cáo",
          description: "Cho phép nhân viên bán hàng hoặc thu ngân được quyền xem báo cáo này và xem doanh thu của các nhân viên khác.",
          checked: false
        },
        {
          label: "Nhân viên",
          description: "Cho phép nhân viên được quyền xem báo cáo này để theo dõi doanh số toàn bộ các cửa hàng (thường dùng cho mục đích khen thưởng hoặc thi đua).",
          checked: false
        }    
      ]);
    
      const [permissionsLowAdmin, setPermissionsLowAdmin] = useState([
        {
          label: "Tổng quan",
          description: "Giới hạn quyền truy cập của nhân viên để chỉ xem các khách hàng mà họ phụ trách.",
          checked: false
        },
        {
          label: "Hàng hóa",
          description: "Giới hạn quyền truy cập của nhân viên để chỉ thấy các khách hàng có 'cửa hàng mua cuối cùng' là những cửa hàng mà họ quản lý.",
          checked: false
        },
        {
          label: "Nhập hàng",
          description: "Giới hạn quyền truy cập của nhân viên để chỉ thấy các yêu cầu nhập hàng do chính họ tạo.",
          checked: false
        },
        {
          label: "Xuất hàng",
          description: "Giới hạn quyền truy cập của nhân viên để chỉ thấy các phiếu xuất hàng do chính họ tạo.",
          checked: true
        },
        {
          label: "Báo cáo",
          description: "Cho phép nhân viên bán hàng hoặc thu ngân được quyền xem báo cáo này và xem doanh thu của các nhân viên khác.",
          checked: false
        },
        {
          label: "Nhân viên",
          description: "Cho phép nhân viên được quyền xem báo cáo này để theo dõi doanh số toàn bộ các cửa hàng (thường dùng cho mục đích khen thưởng hoặc thi đua).",
          checked: false
        }    
      ]);

    const permissionUsePageAccess = (access, pages) => {
        let permissions;
        if (access === process.env.REACT_APP_HIGH_ADMIN_ROLE) {
          permissions = permissionsHighAdmin;
        } else if (access === process.env.REACT_APP_MEDIUM_ADMIN_ROLE) {
          permissions = permissionsMediumAdmin;
        } else if (access === process.env.REACT_APP_LOW_ADMIN_ROLE) {
          permissions = permissionsLowAdmin;
        }
        if (permissions) {
          return permissions.filter(item => item.checked === true).some(e => e.label === pages);
        }
        return false;
      }

    return (
        <AppContext.Provider value={{   dataDataAdress, setDataAdress, formData, setFormData, jsonSchemaAccountDetails, setJonSchemaAccountDetails,
                                        data, setData, addNewItem, setAddNewItem, addPrintCode, setAddPrintCode,
                                        selectedDay, setSelectedDay, addNewEmployeesDecentralization, setAddNewEmployeesDecentralization,
                                        addNewEmployees, setAddNewEmployees, addNewItemImportPackage, setAddNewItemImportPackage,
                                        addNewItemExportPackage, setAddNewItemExportPackage,
                                        isVisible, setIsVisible, activePage, setActivePage, handleNavigation,
                                        access, setAccess,
                                        rowData, setRowData,
                                        accessPage,
                                        permissionsHighAdmin, setPermissionsHighAdmin,
                                        permissionsMediumAdmin, setPermissionsMediumAdmin,
                                        permissionsLowAdmin, setPermissionsLowAdmin,
                                        permissionUsePageAccess,
                                        isShowButtonBackProductImportPage, setIsShowButtonBackProductImportPage }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    return useContext(AppContext);
};
