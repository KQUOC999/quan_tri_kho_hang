import React from 'react';
import styles from './styles.module.css';

const LoadingPage = () => {
 
  return (
    <div className={styles.containerText}>
      <div className={styles.loadingText}>Loading...</div>
    </div>
  );
};

export default LoadingPage;
