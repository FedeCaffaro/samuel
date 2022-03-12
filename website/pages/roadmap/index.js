import React from 'react';
import { useSelector } from 'react-redux';

import Navbar from '../../components/Navbar';

import styles from './styles.module.scss';

const Whitepaper = () => {
  const wallet = useSelector((state) => state.settings.wallet);

  return (
    <>
      <div className={styles['center-content']}>
        <img src="/roadmap.gif" alt="roadmap" className={styles.page} />
      </div>
      <Navbar showLogo={!!wallet?.account} />
    </>
  );
};

export default Whitepaper;
