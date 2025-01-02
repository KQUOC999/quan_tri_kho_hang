import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Đừng quên import CSS của Quill

const GoogleMap = () => {
  const [selectedPage, setSelectedPage] = useState("Tất cả khổ giấy");
  const [, setSelectedTemplate] = useState(null);
  const [editorContent, setEditorContent] = useState(""); // Dùng để lưu nội dung soạn thảo

  const [senderInfo, ] = useState({
    senderName: "Nguyễn Văn A",
    senderPhone: "0123456789",
    senderAddress: "123 Đường ABC, Quận 1, TP.HCM",
    senderCode: "MVD001"
  });

  const [receiverInfo, ] = useState({
    receiverName: "Trần Thị B",
    receiverPhone: "0987654321",
    receiverAddress: "456 Đường XYZ, Quận 5, TP.HCM"
  });

  const [orderInfo, ] = useState({
    orderCode: "DH002",
    totalPrice: "200,000",
    note: "Giao hàng sau 6h tối"
  });

  const [productInfo, ] = useState([
    { name: "Sản phẩm 1", color: "Đỏ", size: "M", quantity: 2 },
    { name: "Sản phẩm 2", color: "Xanh", size: "L", quantity: 1 }
  ]);

  const handlePageChange = (e) => {
    setSelectedPage(e.target.value);
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };

  const handleSaveSettings = () => {
    alert("Cài đặt đã được lưu!");
  };

  // Hàm xử lý thay đổi nội dung soạn thảo văn bản
  const handleEditorChange = (content, delta, source, editor) => {
    setEditorContent(content);
  };

  return (
    <div className="print-template">
      <div className="template-header">
        <h1>Mẫu in</h1>
        <div className="print-options">
          {/* Chọn khổ giấy */}
          <select onChange={handlePageChange} value={selectedPage}>
            <option value="Tất cả khổ giấy">Tất cả khổ giấy</option>
            <option value="A4">Khổ A4</option>
            <option value="A5">Khổ A5</option>
          </select>

          {/* Chọn mẫu có sẵn */}
          <button onClick={() => handleTemplateSelect("A4/A5")}>Mẫu A4/A5</button>
          <button onClick={() => handleTemplateSelect("Nhiệt")}>Mẫu máy in nhiệt</button>
          <button onClick={() => handleTemplateSelect("GHTK")}>Mẫu GHTK</button>
        </div>
      </div>

      <div className="template-body">
        {/* Thông tin người gửi */}
        <div className="info-section">
          <div className="sender-info">
            <h3>THÔNG TIN NGƯỜI GỬI</h3>
            <p>Người gửi: {senderInfo.senderName}</p>
            <p>Điện thoại: {senderInfo.senderPhone}</p>
            <p>Địa chỉ: {senderInfo.senderAddress}</p>
            <p>Mã BĐ: {senderInfo.senderCode}</p>
          </div>

          {/* Thông tin người nhận */}
          <div className="receiver-info">
            <h3>THÔNG TIN NGƯỜI NHẬN</h3>
            <p>Người nhận: {receiverInfo.receiverName}</p>
            <p>Điện thoại: {receiverInfo.receiverPhone}</p>
            <p>Địa chỉ: {receiverInfo.receiverAddress}</p>
          </div>
        </div>

        {/* Thông tin cước phí và hàng hóa */}
        <div className="info-section">
          <div className="fee-info">
            <h3>THÔNG TIN CƯỚC PHÍ</h3>
            <p>Thu COD: {orderInfo.totalPrice} VNĐ</p>
            <p>Ghi chú: {orderInfo.note}</p>
          </div>

          <div className="product-info">
            <h3>THÔNG TIN HÀNG HÓA</h3>
            <table>
              <thead>
                <tr>
                  <th>Tên SP</th>
                  <th>Màu sắc</th>
                  <th>Size</th>
                  <th>SL</th>
                </tr>
              </thead>
              <tbody>
                {productInfo.map((product, index) => (
                  <tr key={index}>
                    <td>{product.name}</td>
                    <td>{product.color}</td>
                    <td>{product.size}</td>
                    <td>{product.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Soạn thảo văn bản */}
        <div className="editor-section">
          <h3>SOẠN THẢO VĂN BẢN</h3>
          <ReactQuill 
            value={editorContent} 
            onChange={handleEditorChange} 
            theme="snow" 
            placeholder="Nhập nội dung..."
          />
        </div>
      </div>

      {/* Các nút chức năng */}
      <div className="template-footer">
        <div className="footer-buttons">
          <label>
            <input type="checkbox" /> Đặt làm mặc định
          </label>
          <button onClick={handleSaveSettings}>Lưu cài đặt</button>
        </div>
      </div>
    </div>
  );
};

export default GoogleMap;
