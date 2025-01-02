import React from 'react';
import styles from './styles.module.css';
import Logo from '../../../logo/graduation.png'

const LoadingPage = () => {
 
  return (
    <div className={styles.containerText}>
      <div className={styles.loadingText}>
        <div className={styles.outerCircle}></div>
        <img src={Logo} alt="Logo" className={styles.logoImage} />
      </div>
    </div>
  );
};

export default LoadingPage;
