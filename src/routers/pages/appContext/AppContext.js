
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
    const countPublishMQTTRefExportPage = useRef(0);
    const countPublishMQTTRefImportPage = useRef(0);

    //Trạng thái kết nối máy scan từ thiết bị điều khiển
    const [isConnectedScanFromDevices, setisConnectedScanFromDevices] = useState(false);
    const isConnectedScanFromDevicesRef = useRef(false);

    // Dữ liệu hàng exportPackageVote
    const [updatedDataExportPage, setUpdatedDataExportPage] = useState([]);

    // Dữ liệu hàng importPackageVote
    const [updatedDataImportPage, setUpdatedDataImportPage] = useState([]);
    
    //Dữ liêu MQTT
    const isConnectedRefExportPages = useRef(false);
    const [isconnectedMQTTBrokerExportPage, setIsconnectedMQTTBrokerExportPage] = useState(false);
    const [messageMQTTBrokerExportPage, setMessageMQTTBrokerExportPage] = useState([]);
    const [connectAttemptsExportPage, setConnectAttemptsExportPage] = useState(0);
    const [ipAdressInternetScannerDevices, setIpAdressInternetScannerDevices] = useState('');
    const [ipAdressConnnetScannerDevices, setIpAdressConnnetScannerDevices] = useState('');
    const [ssidInternetScannerDevices, setSsidInternetScannerDevices] = useState('');
    const [passwordInternetScannerDevices, setPasswordInternetScannerDevices] = useState('');
    const clientRefExportPage = useRef(null);
    const lastReceivedMessageRefExportPage = useRef('');
    const lastReceivedTimeRefExportPage = useRef(0);
    const topicExportPage = 'scan/data/export';

    const isConnectedRefImportPages = useRef(false);
    const [isconnectedMQTTBrokerImportPage, setIsconnectedMQTTBrokerImportPage] = useState(false);
    const [messageMQTTBrokerImportPage, setMessageMQTTBrokerImportPage] = useState([]);
    const [connectAttemptsImportPage, setConnectAttemptsImportPage] = useState(0);
    const clientRefImportPage = useRef(null);
    const lastReceivedMessageRefImportPage = useRef('');
    const lastReceivedTimeRefImportPage = useRef(0);
    const topicImportPage = 'scan/data/import';
    
    const request_connect_mqtt = 'scan/request/connect/mqtt';
    const response_connect_mqtt = 'scan/response/connect/mqtt';
    const request_controlMode_mqtt_exportPage = "scan/request/controlMode/mqtt";
    const request_deleteInternet_mqtt =  "scan/request/resetWifi/mqtt";

    const request_ssidInternetScannerDevices_mqtt = 'scan/request/ssidInternetScannerDevices/mqtt';
    const response_ssidInternetScannerDevices_mqtt = 'scan/response/ssidInternetScannerDevices/mqtt';

    const request_passwordInternetScannerDevices_mqtt = 'scan/request/passwordInternetScannerDevices/mqtt';
    const response_passwordInternetScannerDevices_mqtt = 'scan/response/passwordInternetScannerDevices/mqtt';

    const request_ipAdressInternetScannerDevices_mqtt = 'scan/request/ipAdressInternetScannerDevices/mqtt';
    const response_ipAdressInternetScannerDevices_mqtt = 'scan/response/ipAdressInternetScannerDevices/mqtt';

    const request_ipAdressConnnetScannerDevices_mqtt = 'scan/request/ipAdressConnnetScannerDevices/mqtt';
    const response_ipAdressConnnetScannerDevices_mqtt = 'scan/response/ipAdressConnnetScannerDevices/mqtt';

    const [isFinishMQTTSetupExportPage, setIsFinishMQTTSetupExportPage] = useState(false);
    const [isFinishMQTTSetupImportPage, setIsFinishMQTTSetupImportPage] = useState(false);

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

/*########################### Xử lý tác vụ MQTT của trang ExportPage ###########################*/
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

      const subscribeToTopic = (topic) => {
        return new Promise((resolve, reject) => {
          client.subscribe(topic, (err) => {
            if (!err) {
              console.log(`Subscribed: ${topic}`);
              resolve();
            } else {
              console.error(`Lỗi Subscribe: ${topic}`, err);
              reject(err);
            }
          });
        });
      };
    
      const publishToTopic = (topic, message) => {
        return new Promise((resolve, reject) => {
          client.publish(topic, message, (err) => {
            if (!err) {
              console.log(`Published: ${topic} - message: "${message}"`);
              resolve();
            } else {
              console.error(`Lỗi Publish: ${topic}`, err);
              reject(err);
            }
          });
        });
      };
      
      const topicsToSubscribe = [
        topicExportPage,
        response_connect_mqtt,
        response_ssidInternetScannerDevices_mqtt,
        response_passwordInternetScannerDevices_mqtt,
        response_ipAdressInternetScannerDevices_mqtt,
        response_ipAdressConnnetScannerDevices_mqtt,
      ];

      const topicsToPublish = [
        { topic: request_connect_mqtt, message: "check" },
        { topic: request_ssidInternetScannerDevices_mqtt, message: "check" },
        { topic: request_passwordInternetScannerDevices_mqtt, message: "check" },
        { topic: request_ipAdressInternetScannerDevices_mqtt, message: "check" },
        { topic: request_ipAdressConnnetScannerDevices_mqtt, message: "check" },
      ];
    
      client.on('connect', async () => {
        isConnectedRefExportPages.current = true;
        setIsconnectedMQTTBrokerExportPage(true);
        setConnectAttemptsExportPage(0);
        console.log('Đã kết nối đến MQTT Broker');

        try {
          if (isFinishMQTTSetupImportPage) {
            await Promise.all(topicsToSubscribe.slice(0, 2).map(subscribeToTopic));
            await publishToTopic(topicsToPublish[0].topic, topicsToPublish[0].message);
          }
          else {
            await Promise.all(topicsToSubscribe.map(subscribeToTopic));
            if (isConnectedRefExportPages.current && isConnectedScanFromDevicesRef.current) {
              await Promise.all(topicsToPublish.slice(1, 5).map(({ topic, message }) => publishToTopic(topic, message)));
            }
            else {
              await publishToTopic(topicsToPublish[0].topic, topicsToPublish[0].message);
            }
          }

          setIsFinishMQTTSetupExportPage(true);

          console.log("Tất cả thao tác MQTT đã hoàn thành!");
        } catch (error) {
          console.error("Lỗi khi xử lý MQTT:", error);
        }
      });
      
      client.on('error', (err) => {
        console.error('Kết nối thất bại đến MQTT Broker:', err.message);
        countPublishMQTTRefExportPage.current = 0; 
        setIsFinishMQTTSetupExportPage(false);
        setIsFinishMQTTSetupImportPage(false);
        setConnectAttemptsExportPage((prev) => prev + 1);
    
        if (connectAttemptsExportPage + 1 > 5) {
          console.error('Quá nhiều lần thử. Kết nối thất bại...');
          client.end();
          isConnectedRefExportPages.current = false;
          isConnectedScanFromDevicesRef.current = false;
          setIsconnectedMQTTBrokerExportPage(false);
          setisConnectedScanFromDevices(false);
          toast.error("Đã ngắt kết nối sau quá nhiều lần thất bại!", { autoClose: 2000 });
        }
      });
    
      client.on('message', async (topic, payload) => {
        let count = 0;
        const receivedMessage = payload.toString();
        console.log(`Received message: ${receivedMessage} on topic ${topic}`);

        if (receivedMessage === 'Kết nối thành công!' && topic === response_connect_mqtt) {
          isConnectedScanFromDevicesRef.current = true;
          setisConnectedScanFromDevices(true);
          if (countPublishMQTTRefExportPage.current === 0) {
            try {
              await Promise.all(topicsToPublish.slice(1, 5).map(({ topic, message }) => publishToTopic(topic, message)));
              countPublishMQTTRefExportPage.current++; 
            } catch (error) {
              console.log(error.error);
            }
          } 
          toast.success("Máy scan đã kết nối với máy tính thành công!", { autoClose: 2000 });
        };

        if (receivedMessage.length > 0 && topic === response_ssidInternetScannerDevices_mqtt) {
          const currentTime = new Date().getSeconds();
          setSsidInternetScannerDevices({message: receivedMessage, currentTime});
        };

        if (receivedMessage.length > 0 && topic === response_passwordInternetScannerDevices_mqtt) {
          const currentTime = new Date().getSeconds();
          setPasswordInternetScannerDevices({message: receivedMessage, currentTime});     
        };

        if (receivedMessage.length > 0 && topic === response_ipAdressInternetScannerDevices_mqtt) {
          const currentTime = new Date().getSeconds();
          setIpAdressInternetScannerDevices({message: receivedMessage, currentTime});
        };

        if (receivedMessage.length > 0 && topic === response_ipAdressConnnetScannerDevices_mqtt) {
          const currentTime = new Date().getSeconds();
          setIpAdressConnnetScannerDevices({message: receivedMessage, currentTime});     
        };

        if (receivedMessage === lastReceivedMessageRefExportPage.current) {
          const currentTime = Date.now();
          const timeElapsed = currentTime - lastReceivedTimeRefExportPage.current;
          
          if (timeElapsed > 1000) {
            console.log('1 seconds passed, updating data...');
            count++;
            if (topic === topicExportPage) {
              setMessageMQTTBrokerExportPage({ message: receivedMessage, count });
            };
          }
        } else {
          if (topic === topicExportPage) {
            setMessageMQTTBrokerExportPage({ message: receivedMessage, count });
          };
          lastReceivedMessageRefExportPage.current = receivedMessage;
          lastReceivedMessageRefExportPage.current = Date.now();
        }
      });
    
      return client;
    };

    const sendControlModeToScannerDevicesExportPage = (status) => {
      if (isConnectedRefExportPages.current && isConnectedScanFromDevicesRef.current) {
        clientRefExportPage.current.publish(request_controlMode_mqtt_exportPage, status, (err) => {
          if (!err) {
            console.log(`Publish to topic ${request_controlMode_mqtt_exportPage} with message ${status} of "controlMode"`);
          } else {
            console.error('Publish failed:', err);
          }
        });
      }
    };

    const sendDeleteInternetScannerDevicesExportPage = (request) => {
      if (isConnectedRefExportPages.current && isConnectedScanFromDevicesRef.current) {
        clientRefExportPage.current.publish(request_deleteInternet_mqtt, request, (err) => {
          if (!err) {
            console.log(`Publish to topic ${request_deleteInternet_mqtt} with message ${request} of "deleteInternetScannerDevices"`);
            countPublishMQTTRefExportPage.current = 0; 
            isConnectedRefExportPages.current = false;
            isConnectedScanFromDevicesRef.current = false;
            setIsconnectedMQTTBrokerExportPage(false);
            setisConnectedScanFromDevices(false);
            setIpAdressInternetScannerDevices('');
            setIpAdressConnnetScannerDevices('');
            setSsidInternetScannerDevices('');
            setPasswordInternetScannerDevices('');
            setIsFinishMQTTSetupExportPage(false);
            setIsFinishMQTTSetupImportPage(false);
            
          } else {
            console.error('Publish failed:', err);
          }
        });
      }
    };

    const sendRequestMQTTWhenConnectedScannerDevicesExportPage = async () => {
      const topicsToPublish = [
        { topic: request_ssidInternetScannerDevices_mqtt, message: "check" },
        { topic: request_passwordInternetScannerDevices_mqtt, message: "check" },
        { topic: request_ipAdressInternetScannerDevices_mqtt, message: "check" },
        { topic: request_ipAdressConnnetScannerDevices_mqtt, message: "check" },
      ];

      const publishToTopic = (topic, message) => {
        return new Promise((resolve, reject) => {
          clientRefExportPage.current.publish(topic, message, (err) => {
            if (!err) {
              console.log(`Published: ${topic} - message: "${message}"`);
              resolve();
            } else {
              console.error(`Lỗi Publish: ${topic}`, err);
              reject(err);
            }
          });
        });
      };

      try {
        await Promise.all(topicsToPublish.map(({ topic, message }) => publishToTopic(topic, message)));
        console.log("Tất cả thao tác MQTT đã hoàn thành!");
      } catch (error) {
        console.error("Lỗi khi xử lý MQTT:", error);
      }
    };

/*########################### Xử lý tác vụ MQTT của trang ImportPage ###########################*/
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

      const subscribeToTopic = (topic) => {
        return new Promise((resolve, reject) => {
          client.subscribe(topic, (err) => {
            if (!err) {
              console.log(`Subscribed: ${topic}`);
              resolve();
            } else {
              console.error(`Lỗi Subscribe: ${topic}`, err);
              reject(err);
            }
          });
        });
      };
    
      const publishToTopic = (topic, message) => {
        return new Promise((resolve, reject) => {
          client.publish(topic, message, (err) => {
            if (!err) {
              console.log(`Published: ${topic} - message: "${message}"`);
              resolve();
            } else {
              console.error(`Lỗi Publish: ${topic}`, err);
              reject(err);
            }
          });
        });
      };
 
      const topicsToSubscribe = [
        topicImportPage,
        response_connect_mqtt,
        response_ssidInternetScannerDevices_mqtt,
        response_passwordInternetScannerDevices_mqtt,
        response_ipAdressInternetScannerDevices_mqtt,
        response_ipAdressConnnetScannerDevices_mqtt,
      ];

      const topicsToPublish = [
        { topic: request_connect_mqtt, message: "check" },
        { topic: request_ssidInternetScannerDevices_mqtt, message: "check" },
        { topic: request_passwordInternetScannerDevices_mqtt, message: "check" },
        { topic: request_ipAdressInternetScannerDevices_mqtt, message: "check" },
        { topic: request_ipAdressConnnetScannerDevices_mqtt, message: "check" },
      ];
    
      client.on('connect', async () => {
        isConnectedRefImportPages.current = true;
        setIsconnectedMQTTBrokerImportPage(true);
        setConnectAttemptsImportPage(0);
        setisConnectedScanFromDevices(false);
        console.log('Đã kết nối đến MQTT Broker');

        try {
          if (isFinishMQTTSetupExportPage) {
            await Promise.all(topicsToSubscribe.slice(0, 2).map(subscribeToTopic));
            await publishToTopic(topicsToPublish[0].topic, topicsToPublish[0].message);
          }
          else {
            await Promise.all(topicsToSubscribe.map(subscribeToTopic));
            if (isConnectedRefImportPages.current && isConnectedScanFromDevicesRef.current) {
              await Promise.all(topicsToPublish.slice(1, 5).map(({ topic, message }) => publishToTopic(topic, message)));
            }
            else {
              await publishToTopic(topicsToPublish[0].topic, topicsToPublish[0].message);
            }
          }

          setIsFinishMQTTSetupImportPage(true);

          console.log("Tất cả thao tác MQTT đã hoàn thành!");
        } catch (error) {
          console.error("Lỗi khi xử lý MQTT:", error);
        }
      });
    
      client.on('error', (err) => {
        console.error('Kết nối thất bại đến MQTT Broker:', err.message);
        countPublishMQTTRefImportPage.current = 0; 
        setIsFinishMQTTSetupExportPage(false);
        setIsFinishMQTTSetupImportPage(false);
        setConnectAttemptsImportPage((prev) => prev + 1);
    
        if (connectAttemptsImportPage + 1 > 5) {
          console.error('Quá nhiều lần thử. Kết nối thất bại...');
          client.end();
          isConnectedRefImportPages.current = false;
          isConnectedScanFromDevicesRef.current = false;
          setIsconnectedMQTTBrokerImportPage(false);
          setisConnectedScanFromDevices(false);
          toast.error("Đã ngắt kết nối sau quá nhiều lần thất bại!", { autoClose: 2000 });
        }
      });
    
      client.on('message', async (topic, payload) => {
        let count = 0;
        const receivedMessage = payload.toString();
        console.log(`Received message: ${receivedMessage} on topic ${topic}`);

        if (receivedMessage === 'Kết nối thành công!' && topic === response_connect_mqtt) {
          setisConnectedScanFromDevices(true);
          isConnectedScanFromDevicesRef.current = true;
          if (countPublishMQTTRefImportPage.current === 0) {
            try {
              await Promise.all(topicsToPublish.slice(1, 5).map(({ topic, message }) => publishToTopic(topic, message)));
              countPublishMQTTRefImportPage.current++; 
            } catch (error) {
              console.log(error.error);
            }
          } 
          toast.success("Máy scan đã kết nối với máy tính thành công!", { autoClose: 2000 });
        };

        if (receivedMessage.length > 0 && topic === response_ssidInternetScannerDevices_mqtt) {
          const currentTime = new Date().getSeconds();
          setSsidInternetScannerDevices({message: receivedMessage, currentTime});
        };

        if (receivedMessage.length > 0 && topic === response_passwordInternetScannerDevices_mqtt) {
          const currentTime = new Date().getSeconds();
          setPasswordInternetScannerDevices({message: receivedMessage, currentTime});     
        };

        if (receivedMessage.length > 0 && topic === response_ipAdressInternetScannerDevices_mqtt) {
          const currentTime = new Date().getSeconds();
          setIpAdressInternetScannerDevices({message: receivedMessage, currentTime});
        };

        if (receivedMessage.length > 0 && topic === response_ipAdressConnnetScannerDevices_mqtt) {
          const currentTime = new Date().getSeconds();
          setIpAdressConnnetScannerDevices({message: receivedMessage, currentTime});     
        };

        if (receivedMessage === lastReceivedMessageRefImportPage.current) {
          const currentTime = Date.now();
          const timeElapsed = currentTime - lastReceivedTimeRefImportPage.current;
          
          if (timeElapsed > 1000) {
            console.log('1 seconds passed, updating data...');
            count++;
            if (topic === topicImportPage) {
              setMessageMQTTBrokerImportPage({ message: receivedMessage, count });
            };
          }
        } else {
          if (topic === topicImportPage) {
            setMessageMQTTBrokerImportPage({ message: receivedMessage, count });
          };
          lastReceivedMessageRefImportPage.current = receivedMessage;
          lastReceivedTimeRefImportPage.current = Date.now();
        }
      });
    
      return client;
    };

    const sendControlModeToScannerDevicesImportPage = (status) => {
      if (isConnectedRefImportPages.current && isConnectedScanFromDevicesRef.current) {
        clientRefImportPage.current.publish(request_controlMode_mqtt_exportPage, status, (err) => {
          if (!err) {
            console.log(`Publish to topic ${request_controlMode_mqtt_exportPage} with message ${status} of "controlMode"`);
          } else {
            console.error('Publish failed:', err);
          }
        });
      }
    };

    const sendDeleteInternetScannerDevicesImportPage = (request) => {
      if (isConnectedRefImportPages.current && isConnectedScanFromDevicesRef.current) {
        clientRefImportPage.current.publish(request_deleteInternet_mqtt, request, (err) => {
          if (!err) {
            console.log(`Publish to topic ${request_deleteInternet_mqtt} with message ${request} of "deleteInternetScannerDevices"`);
            countPublishMQTTRefImportPage.current = 0; 
            isConnectedRefImportPages.current = false;
            isConnectedScanFromDevicesRef.current = false;
            setIsconnectedMQTTBrokerImportPage(false);
            setisConnectedScanFromDevices(false);
            setIpAdressInternetScannerDevices('');
            setIpAdressConnnetScannerDevices('');
            setSsidInternetScannerDevices('');
            setPasswordInternetScannerDevices('');
            setIsFinishMQTTSetupExportPage(false);
            setIsFinishMQTTSetupImportPage(false);
            
          } else {
            console.error('Publish failed:', err);
          }
        });
      }
    };

    const sendRequestMQTTWhenConnectedScannerDevicesImportPage = async () => {
      const topicsToPublish = [
        { topic: request_ssidInternetScannerDevices_mqtt, message: "check" },
        { topic: request_passwordInternetScannerDevices_mqtt, message: "check" },
        { topic: request_ipAdressInternetScannerDevices_mqtt, message: "check" },
        { topic: request_ipAdressConnnetScannerDevices_mqtt, message: "check" },
      ];

      const publishToTopic = (topic, message) => {
        return new Promise((resolve, reject) => {
          clientRefImportPage.current.publish(topic, message, (err) => {
            if (!err) {
              console.log(`Published: ${topic} - message: "${message}"`);
              resolve();
            } else {
              console.error(`Lỗi Publish: ${topic}`, err);
              reject(err);
            }
          });
        });
      };

      try {
        await Promise.all(topicsToPublish.map(({ topic, message }) => publishToTopic(topic, message)));
        console.log("Tất cả thao tác MQTT đã hoàn thành!");
      } catch (error) {
        console.error("Lỗi khi xử lý MQTT:", error);
      }
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

                                        isConnectedScanFromDevices, setisConnectedScanFromDevices,
                                        isConnectedScanFromDevicesRef,

                                        updatedDataExportPage, setUpdatedDataExportPage,
                                        isConnectedRefExportPages,
                                        isconnectedMQTTBrokerExportPage, setIsconnectedMQTTBrokerExportPage,
                                        messageMQTTBrokerExportPage, setMessageMQTTBrokerExportPage,
                                        ipAdressInternetScannerDevices, setIpAdressInternetScannerDevices,
                                        ipAdressConnnetScannerDevices, setIpAdressConnnetScannerDevices,
                                        ssidInternetScannerDevices, setSsidInternetScannerDevices,
                                        passwordInternetScannerDevices, setPasswordInternetScannerDevices,
                                        isFinishMQTTSetupExportPage, setIsFinishMQTTSetupExportPage,
                                        handleConnectingMQTTBrokerExportPage,
                                        sendControlModeToScannerDevicesExportPage,
                                        sendDeleteInternetScannerDevicesExportPage,
                                        sendRequestMQTTWhenConnectedScannerDevicesExportPage,

                                        updatedDataImportPage, setUpdatedDataImportPage,
                                        isConnectedRefImportPages,
                                        isconnectedMQTTBrokerImportPage, setIsconnectedMQTTBrokerImportPage,
                                        messageMQTTBrokerImportPage, setMessageMQTTBrokerImportPage,
                                        isFinishMQTTSetupImportPage, setIsFinishMQTTSetupImportPage,
                                        handleConnectingMQTTBrokerImportPage,
                                        sendControlModeToScannerDevicesImportPage,
                                        sendDeleteInternetScannerDevicesImportPage,
                                        sendRequestMQTTWhenConnectedScannerDevicesImportPage}}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    return useContext(AppContext);
};
