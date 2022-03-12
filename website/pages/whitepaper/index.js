import React from 'react';
import { useSelector } from 'react-redux';

import Navbar from '../../components/Navbar';

import styles from './styles.module.scss';

const Whitepaper = () => {
  const wallet = useSelector((state) => state.settings.wallet);
  const pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

  return (
    <>
      <div className={styles['center-content']}>
        {pages.map((page) => (
          <img
            key={page}
            src={`/whitepaper/page-${page}.png`}
            alt={`whitepaper page ${page}`}
            className={styles.page}
          />
        ))}
      </div>
      <Navbar showLogo={!!wallet?.account} />
    </>
  );
};

export default Whitepaper;
