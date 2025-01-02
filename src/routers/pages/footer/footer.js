import React from 'react';
import styles from'./styles.module.css';  // Nếu bạn muốn tách style riêng cho Footer

const Footers = () => {
  return (
    <footer className={styles.footer}>
      <p>Bản quyền © 2024 Công ty của bạn. Mọi quyền được bảo lưu.</p>
      <ul>
        <li><a href="https://nhanh.vn/product/item/index">Giới thiệu</a></li>
        <li><a href="/privacy">Chính sách bảo mật</a></li>
        <li><a href="/contact">Liên hệ</a></li>
      </ul>
    </footer>
  );
};

export default Footers;
