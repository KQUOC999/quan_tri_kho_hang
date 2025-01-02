import React, { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import Barcode from 'react-barcode'; 
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import  styles from './styles.module.css';

import { FaAngleUp } from "react-icons/fa";

const CodeGenerator = () => {
  const [type, setType] = useState('qr');
  const [text, setText] = useState('');
  const [size, setSize] = useState(50);
  const [color, setColor] = useState('#000000');
  const [showtypeCode, setShowTypeCode] = useState(true);
  const [showShopName, setShowShopName] = useState(true);
  const [showProductName, setShowProductName] = useState(true);
  const [showPrice, setShowPrice] = useState(true);
  const [showOldPrice, setShowOldPrice] = useState(true);
  const [alternateShopName, setAlternateShopName] = useState('');
  const [isOpenForm, setIsOpenForm] = useState(true);
  const [isOpenSetPrintCode, setIsOpenSetPrintCode] = useState(true);
  const [isRotatedFormIcon, setIsRotatedFormIcon] = useState(false);
  const [isRotatedCodeIcon, setIsRotatedCodeIcon] = useState(false);

  const [columnDefsProduct] = useState([
    { headerName: 'Mã sản phẩm', field: 'codeProduct', width: '200px' },
    { headerName: 'Tên sản phẩm', field: 'nameProduct', width: '160px' },
    { headerName: 'Giá bán', field: 'sellingProduct', width: '160px' }
  ]);
  const [rowDataProduct] = useState([
    { salesChannel: 'Online', orders: 120, orderPercentage: '30%', revenue: 3000, revenuePercentage: '40%' },
  ]);

  const [componentOrder, setComponentOrder] = useState([
    { id: 'shopName', label: 'Tên cửa hàng', show: showShopName, order: 1 },
    { id: 'typeCode', label: 'Loại mã', show: showtypeCode, order: 2 },
    { id: 'productName', label: 'Tên sản phẩm', show: showProductName, order: 3 },
    { id: 'price', label: 'Giá sản phẩm', show: showPrice, order: 4 },
    { id: 'oldPrice', label: 'Giá cũ', show: showOldPrice, order: 5 },
  ]);

  useEffect(() => {
    const typeCode = componentOrder.find(item => item.id === 'typeCode');
    const shopName = componentOrder.find(item => item.id === 'shopName');
    const productName = componentOrder.find(item => item.id === 'productName');
    const price = componentOrder.find(item => item.id === 'price');
    const oldPrice = componentOrder.find(item => item.id === 'oldPrice');
    
    if (typeCode) setShowTypeCode(typeCode.show);
    if (shopName) setShowShopName(shopName.show);
    if (productName) setShowProductName(productName.show);
    if (price) setShowPrice(price.show);
    if (oldPrice) setShowOldPrice(oldPrice.show);
  }, [componentOrder]);

  const renderCode = () => {
    return (
      <div className={styles.containerPreviewLayer}>
        {componentOrder
          .filter(item => item.show)
          .sort((a, b) => a.order - b.order) 
          .map((item) => {
            switch (item.id) {
              case 'shopName':
                return (
                  <div key={item.id} style={{ padding: '0' }}>
                    {showShopName && <div>{alternateShopName || 'Tên Shop'}</div>}
                  </div>
              );
              case 'typeCode':
                return (
                  <div key={item.id} style={{ padding: '0' }}>
                      {showtypeCode && (
                        type === 'qr' ? (
                          <QRCodeCanvas value={text} size={size} fgColor={color} />
                        ) : (
                          <Barcode value={text} width={size / 50} height={size} lineColor={color} />
                        )
                      )}
                  </div>
                );
              case 'productName':
                return (
                  <div key={item.id} style={{ padding: '0' }}>
                    <strong></strong> Slim Fit Periwinkle Double
                  </div>
                );
              case 'price':
                return (
                  <div key={item.id} style={{ padding: '0' }}>
                    <strong></strong> 700.000 đ
                  </div>
                );
              case 'oldPrice':
                return (
                  <div key={item.id} style={{ padding: '0' }}>
                    <strong></strong> 800.000 đ
                  </div>
                );
              default:
                return null;
            }
          })}
      </div>
    );
  };

  const toggleShow = (id) => {
    setComponentOrder((prevOrder) =>
      prevOrder.map((item) =>
        item.id === id ? { ...item, show: !item.show } : item
      )
    );
  };
  
  const updateOrder = (id, newOrder) => {
    setComponentOrder((prevOrder) =>
      prevOrder.map((item) =>
        item.id === id ? { ...item, order: newOrder } : item
      )
    );
  };
  
  const handleOpenForm = () => {
    setIsOpenForm(!isOpenForm);
    setIsRotatedFormIcon(!isRotatedFormIcon)
  }
  const handleOpenSetPrintCode = () => {
    setIsOpenSetPrintCode(!isOpenSetPrintCode);
    setIsRotatedCodeIcon(!isRotatedCodeIcon)
  }

  return (
    <div className={styles.containerPrintCode}>
      <div className={styles.containerForm}>
        <div className={styles.containerFormHeader}>
          <div className={styles.containerFormHeaderName}>
            <span>Sản phẩm tự chọn</span>
          </div>
          
          <div className={styles.containerFormHeaderIcon} onClick={handleOpenForm}>
            <FaAngleUp style={{ transform: isRotatedFormIcon ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
          </div>
        </div>
        
        {isOpenForm && (
          <div className={styles.containerFormLayer}>
            <div style={{width: '100%'}} className="ag-theme-alpine">
              <AgGridReact
                columnDefs={columnDefsProduct}
                rowData={rowDataProduct}
                pagination={false}
                domLayout="autoHeight" 
              />
            </div>
          </div>
        )}
      </div>

      <div className={styles.creatCode}>
        <div className={styles.creatCodeHeader}>
          <div className={styles.creatCodeHeaderName}>
            <span>Cấu hình tem in</span>
          </div>
          <div className={styles.creatCodeHeaderIcon} onClick={handleOpenSetPrintCode}>
            <FaAngleUp style={{ transform: isRotatedCodeIcon ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
          </div>
        </div>

        {isOpenSetPrintCode && (
          <div className={styles.creatCodeBody}>
            <div className={styles.creatCodeBodyLayer}>
              <div className={styles.codePreview}>
                {renderCode()}
              </div>

              <div className={styles.codeType}>
                <label>Loại mã:</label>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="qr">Mã QR</option>
                  <option value="barcode">Mã vạch</option>
                </select>
              </div>

              <div className={styles.codeTitle}>
                <label>Nội dung:</label>
                <input 
                  type="text" 
                  value={text} 
                  onChange={(e) => setText(e.target.value)} 
                  placeholder="Nhập nội dung mã" 
                />
              </div>

              {showShopName && (
                <div className={styles.shopNameChange}>
                  <input 
                    type="text" 
                    value={alternateShopName} 
                    onChange={(e) => setAlternateShopName(e.target.value)} 
                    placeholder="Tên shop thay thế" 
                  />
                </div>
              )}

              <div className={styles.codeSize}>
                <label>Kích thước:</label>
                <input 
                  type="number" 
                  value={size} 
                  onChange={(e) => setSize(Number(e.target.value))} 
                  placeholder="Kích thước" 
                />
              </div>

              <div className={styles.codeColor}>
                <label>Màu sắc:</label>
                <input 
                  type="color" 
                  value={color} 
                  onChange={(e) => setColor(e.target.value)} 
                />
              </div>

              <div className={styles.arrangeItem}> 
                {componentOrder.map((item, index) => (
                  <div key={item.id}>
                    <label>{item.label}:</label>
                    <input 
                      type="checkbox" 
                      checked={item.show} 
                      onChange={() => toggleShow(item.id)} 
                    />
                    <label>Thứ tự: </label>
                    <input 
                      type="number" 
                      value={item.order} 
                      onChange={(e) => updateOrder(item.id, parseInt(e.target.value))} 
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}   
      </div>
    </div>
  );
};

export default CodeGenerator;
