
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import * as Realm from 'realm-web';
import mqtt from 'mqtt';
import { toast } from 'react-toastify';

const AppContext = createContext();

const app = new Realm.App({ id: process.env.REACT_APP_REALM_ID });

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
    const [isShowButtonBackVoteListPage, setIsShowButtonBackProductVoteListPage] = useState(true);
    const [isShowButtonBackProductExportPage, setIsShowButtonBackProductExportPage] = useState(true);
    const [isShowButtonBackVoteListExportPage, setIsShowButtonBackProductVoteListExportPage] = useState(true);
    const [rowDataDefault, setRowDataDefault] = useState([]);
    const [loadingDataFetch, setLoadingDataFetch] = useState(true);
    const [isOpenAddVotesPageBySearch, setIsOpenAddVotesPageBySearch] = useState(false);
    const [isOpenAddVotesPageBySearchExportPage, setIsOpenAddVotesPageBySearchExportPage] = useState(false);
    const [numberVoteShowing, setNumberVoteShowing] = useState('');
    const [numberVoteShowingExportPage, setNumberVoteShowingExportPage] = useState('');
    const [addProductTypesEnumsSP, setAddProductTypesEnumsSP] = useState('');
    const [addUnitcalculateEnumsDM, setAddUnitcalculateEnumsDM] = useState('');
    const [isReloadDataExportVote, setIsReloadDataExportVote] = useState(false);
    const [isReloadDataImportVote, setIsReloadDataImportVote] = useState(false);
    const [isReloadDataProductList, setIsReloadDataProductList] = useState(false);
    const innerScrollRef = useRef(null);

    // Dữ liệu hàng exportPackageVote
    const [updatedDataExportPage, setUpdatedDataExportPage] = useState([]);

    // Dữ liệu hàng importPackageVote
    const [updatedDataImportPage, setUpdatedDataImportPage] = useState([]);
    
    //Dữ liêu MQTT
    const isConnectedRefExportPages = useRef(false);
    const [isconnectedMQTTBrokerExportPage, setIsconnectedMQTTBrokerExportPage] = useState(false);
    const [messageMQTTBrokerExportPage, setMessageMQTTBrokerExportPage] = useState([]);
    const [connectAttemptsExportPage, setConnectAttemptsExportPage] = useState(0);
    const clientRefExportPage = useRef(null);
    const lastReceivedMessageRefExportPage = useRef('');
    const lastReceivedTimeRefExportPage = useRef(0);
    const topicExportPage = 'home/data/export';

    const isConnectedRefImportPages = useRef(false);
    const [isconnectedMQTTBrokerImportPage, setIsconnectedMQTTBrokerImportPage] = useState(false);
    const [messageMQTTBrokerImportPage, setMessageMQTTBrokerImportPage] = useState([]);
    const [connectAttemptsImportPage, setConnectAttemptsImportPage] = useState(0);
    const clientRefImportPage = useRef(null);
    const lastReceivedMessageRefImportPage = useRef('');
    const lastReceivedTimeRefImportPage = useRef(0);
    const topicImportPage = 'home/data/import';

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

    useEffect(() => {
      const fetchData = async () => {
        try {
          const functionName = 'call_permissionUsedPages_INLIST_FC';
          const response = await app?.currentUser?.callFunction(functionName);

          const listPageHighAdminRole = response.reduce((acc, item) => {
            const enums = item?.highAdminRole?.properties?.enum;
            if (Array.isArray(enums)) {
              acc.push(...enums);
            }
            return acc;
          }, []);

          const listPageMediumAdminRole = response.reduce((acc, item) => {
            const enums = item?.mediumAdminRole?.properties?.enum;
            if (Array.isArray(enums)) {
              acc.push(...enums);
            }
            return acc;
          }, []);

          const listPageLowAdminRole = response.reduce((acc, item) => {
            const enums = item?.lowAdminRole?.properties?.enum;
            if (Array.isArray(enums)) {
              acc.push(...enums);
            }
            return acc;
          }, []);

          setPermissionsHighAdmin(listPageHighAdminRole);
          setPermissionsMediumAdmin(listPageMediumAdminRole);
          setPermissionsLowAdmin(listPageLowAdminRole);
          
          return response;
        } catch (error) {
          return error.error;
        }
      }
      fetchData();
    }, []);

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
    };

    useEffect(() => {
      async function fetchData() {
        try {
          const functionName = 'call_productList_INLIST_FC';
          const response = await app?.currentUser?.callFunction(functionName);
          const arrangeDataFillTable = response.map((item, index) => ({
            iD: index,
            productName:      item['Form SP']?.nameProduct,
            productType:      item['Form SP']?.nameProductDad,
            typeCodeProduct:  item['Form SP']?.typeCodeProduct,
            code:             item['Form SP']?.code,
            dateCreated:      item['Form SP']?.dateCreated,
            giaVon:           item['Form SP']?.giaNhap,
            giaBan:           item['Form SP']?.giaBan,
            quantity:         item['Form TK']?.numbersProduct,
            DvTinh:           item['Form DM']?.unitCaculation,
          }));
    
          setRowDataDefault(arrangeDataFillTable);

          const uniqueProductTypes = [...new Set(arrangeDataFillTable.map(item => item.productType))];
          const uniqueUnitCaculations = [...new Set(arrangeDataFillTable.map(item => item.DvTinh))];

          setFilterProductsSchemaFormSP(prevSchema => ({
            ...prevSchema,
            properties: {
              ...prevSchema.properties,
              nameProductDad: {
                ...prevSchema.properties.nameProductDad,
                enum: [ ...(addProductTypesEnumsSP ? ['', addProductTypesEnumsSP] : ['']), ...uniqueProductTypes]
              }
            }
          }));

          setfilterProductsSchemaDM(prevSchema => ({
            ...prevSchema,
            properties: {
              ...prevSchema.properties,
              unitCaculation: {
                ...prevSchema.properties.unitCaculation,
                enum: [ ...(addUnitcalculateEnumsDM ? ['', addUnitcalculateEnumsDM] : ['']), ...uniqueUnitCaculations]
              }
            }
          }));

        } catch (error) {
          return error.error;
        } finally {
          setLoadingDataFetch(false);
          setIsReloadDataProductList(false);
        }
      }
    
      fetchData();
      if (isReloadDataImportVote || isReloadDataExportVote || isReloadDataProductList) {
        fetchData();
      };
    }, [addProductTypesEnumsSP, addUnitcalculateEnumsDM, isReloadDataImportVote, isReloadDataExportVote, isReloadDataProductList]);

    const [filterProductsSchemaFormSP, setFilterProductsSchemaFormSP] = useState({
      title: 'Form SP',
      type: 'object',
      required: ['nameProduct', 'nameProductDad', 'typeCodeProduct', 'code', 'giaNhap', 'giaBan', 'dateCreated' ],
      properties: {
        nameProduct: { type: 'string', title: 'Tên SP'},
        nameProductDad: { type: 'string', title: 'Loại SP', enum: ['', 'Dầu gội', 'Sữa tắm']},
        typeCodeProduct: {type: 'string', title: 'Loại mã', enum: ['', 'Mã vạch', 'Mã QR', 'Khác']},
        code: {type: 'string', title: 'Mã'},
        giaNhap: {type: 'number', title: 'Giá nhập'},
        giaBan: { type: 'number', title: 'Giá bán'},
        statusProduct: { type: 'string', title: 'Trạng thái', enum: ['', 'Mới', 'Đang bán', 'Ngừng bán', 'Hết hàng']},
        dateCreated: { type: 'string', title: 'Ngày tạo', format: 'date'},
      },
    });
    
    const [filterProductsSchemaDM, setfilterProductsSchemaDM] = useState({
      title: 'Form DM',
      type: 'object',
      required: ['danhMuc', 'unitCaculation'],
      properties: {
        danhMuc: { type: 'string', title: 'Danh mục'},
        thuongHieu: {type: 'string', title: 'Thương hiệu'},
        weightProduct: { type: 'string', title: 'Khối lượng'},
        unitCaculation: {type: 'string', title: 'Đơn vị tính', enum: ['', 'Cái', 'Chai', 'Hộp']},
        sizeProduct: {type: 'string', title: 'Kích thước'},
        imgProduct: { type: 'string', title: 'Ảnh đại diện'}
      },
    });
    
    const filterInventoryProductTK = {
      title: 'Form TK',
      type: 'object',
      required: ['numbersProduct'],
      properties: {
        numbersProduct: {type: 'number', title: 'Số lượng'},
        stores: {type: 'string', title: 'Cửa hàng'},
        providers: { type: 'string', title: 'Nhà cung cấp'}
      },
    };

    const handleConnectingMQTTBrokerExportPage = () => {
      if (clientRefExportPage.current) {
        clientRefExportPage.current.end(true); 
        clientRefExportPage.current = null;
      }
    
      const broker = process.env.REACT_APP_URL_MQTTBROKER;
      const options = {
        username: process.env.REACT_APP_OPTION_USERNAME_MQTTBROKER,
        password: process.env.REACT_APP_OPTION_PASSWORD_MQTTBROKER,
        reconnectPeriod: 300000,
        connectTimeout: 10000, 
      };
    
      const client = mqtt.connect(broker, options);
      clientRefExportPage.current = client;
    
      client.on('connect', () => {
        isConnectedRefExportPages.current = true;
        setIsconnectedMQTTBrokerExportPage(true);
        setConnectAttemptsExportPage(0);
        console.log('Đã kết nối đến MQTT Broker');
        client.subscribe(topicExportPage, (err) => {
          if (!err) {
            console.log(`Subscribed to topic ${topicExportPage}`);
          } else {
            console.error('Subscription failed:', err);
          }
        });
      });
    
      client.on('error', (err) => {
        console.error('Kết nối thất bại đến MQTT Broker:', err.message);
        setConnectAttemptsExportPage((prev) => prev + 1);
    
        if (connectAttemptsExportPage + 1 > 5) {
          console.error('Quá nhiều lần thử. Kết nối thất bại...');
          client.end();
          isConnectedRefExportPages.current = false;
          setIsconnectedMQTTBrokerExportPage(false);
          toast.error("Đã ngắt kết nối sau quá nhiều lần thất bại!", { autoClose: 2000 });
        }
      });
    
      client.on('message', (topic, payload) => {
        let count = 0;
        const receivedMessage = payload.toString();
        console.log(`Received message: ${receivedMessage} on topic ${topic}`);
      
        if (receivedMessage === lastReceivedMessageRefExportPage.current) {
          const currentTime = Date.now();
          const timeElapsed = currentTime - lastReceivedTimeRefExportPage.current;
          
          if (timeElapsed > 2000) {
            console.log('2 seconds passed, updating data...');
            count++;
            setMessageMQTTBrokerExportPage({ message: receivedMessage, count }); 
          }
        } else {
          setMessageMQTTBrokerExportPage({ message: receivedMessage, count });
          lastReceivedMessageRefExportPage.current = receivedMessage;
          lastReceivedTimeRefExportPage.current = Date.now();
        }
      });
    
      return client;
    };

    const handleConnectingMQTTBrokerImportPage = () => {
      if (clientRefImportPage.current) {
        clientRefImportPage.current.end(true); 
        clientRefImportPage.current = null;
      }
    
      const broker = process.env.REACT_APP_URL_MQTTBROKER;
      const options = {
        username: process.env.REACT_APP_OPTION_USERNAME_MQTTBROKER,
        password: process.env.REACT_APP_OPTION_PASSWORD_MQTTBROKER,
        reconnectPeriod: 300000,
        connectTimeout: 10000, 
      };
    
      const client = mqtt.connect(broker, options);
      clientRefImportPage.current = client;
    
      client.on('connect', () => {
        isConnectedRefImportPages.current = true;
        setIsconnectedMQTTBrokerImportPage(true);
        setConnectAttemptsImportPage(0);
        console.log('Đã kết nối đến MQTT Broker');
        client.subscribe(topicImportPage, (err) => {
          if (!err) {
            console.log(`Subscribed to topic ${topicImportPage}`);
          } else {
            console.error('Subscription failed:', err);
          }
        });
      });
    
      client.on('error', (err) => {
        console.error('Kết nối thất bại đến MQTT Broker:', err.message);
        setConnectAttemptsImportPage((prev) => prev + 1);
    
        if (connectAttemptsImportPage + 1 > 5) {
          console.error('Quá nhiều lần thử. Kết nối thất bại...');
          client.end();
          isConnectedRefImportPages.current = false;
          setIsconnectedMQTTBrokerImportPage(false);
          toast.error("Đã ngắt kết nối sau quá nhiều lần thất bại!", { autoClose: 2000 });
        }
      });
    
      client.on('message', (topic, payload) => {
        let count = 0;
        const receivedMessage = payload.toString();
        console.log(`Received message: ${receivedMessage} on topic ${topic}`);
      
        if (receivedMessage === lastReceivedMessageRefImportPage.current) {
          const currentTime = Date.now();
          const timeElapsed = currentTime - lastReceivedTimeRefImportPage.current;
          
          if (timeElapsed > 2000) {
            console.log('2 seconds passed, updating data...');
            count++;
            setMessageMQTTBrokerImportPage({ message: receivedMessage, count }); 
          }
        } else {
          setMessageMQTTBrokerImportPage({ message: receivedMessage, count });
          lastReceivedMessageRefImportPage.current = receivedMessage;
          lastReceivedTimeRefImportPage.current = Date.now();
        }
      });
    
      return client;
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
                                        accessPage,
                                        permissionsHighAdmin, setPermissionsHighAdmin,
                                        permissionsMediumAdmin, setPermissionsMediumAdmin,
                                        permissionsLowAdmin, setPermissionsLowAdmin,
                                        permissionUsePageAccess,
                                        isShowButtonBackProductImportPage, setIsShowButtonBackProductImportPage,
                                        isShowButtonBackVoteListPage, setIsShowButtonBackProductVoteListPage,
                                        isShowButtonBackProductExportPage, setIsShowButtonBackProductExportPage,
                                        isShowButtonBackVoteListExportPage, setIsShowButtonBackProductVoteListExportPage,
                                        rowDataDefault, setRowDataDefault, loadingDataFetch, setLoadingDataFetch,
                                        filterProductsSchemaFormSP, setFilterProductsSchemaFormSP,
                                        filterProductsSchemaDM, setfilterProductsSchemaDM,
                                        filterInventoryProductTK,
                                        isOpenAddVotesPageBySearch, setIsOpenAddVotesPageBySearch,
                                        isOpenAddVotesPageBySearchExportPage, setIsOpenAddVotesPageBySearchExportPage,
                                        numberVoteShowing, setNumberVoteShowing,
                                        numberVoteShowingExportPage, setNumberVoteShowingExportPage,
                                        addProductTypesEnumsSP, setAddProductTypesEnumsSP,
                                        addUnitcalculateEnumsDM, setAddUnitcalculateEnumsDM,
                                        isReloadDataExportVote, setIsReloadDataExportVote,
                                        isReloadDataImportVote, setIsReloadDataImportVote,
                                        isReloadDataProductList, setIsReloadDataProductList,
                                        innerScrollRef,
                                        
                                        updatedDataExportPage, setUpdatedDataExportPage,
                                        isConnectedRefExportPages,
                                        isconnectedMQTTBrokerExportPage, setIsconnectedMQTTBrokerExportPage,
                                        messageMQTTBrokerExportPage, setMessageMQTTBrokerExportPage,
                                        handleConnectingMQTTBrokerExportPage,

                                        updatedDataImportPage, setUpdatedDataImportPage,
                                        isConnectedRefImportPages,
                                        isconnectedMQTTBrokerImportPage, setIsconnectedMQTTBrokerImportPage,
                                        messageMQTTBrokerImportPage, setMessageMQTTBrokerImportPage,
                                        handleConnectingMQTTBrokerImportPage}}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    return useContext(AppContext);
};
