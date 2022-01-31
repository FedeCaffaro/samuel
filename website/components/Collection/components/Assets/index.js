import React from 'react';

import styles from './styles.module.scss';

function Asset({ name, imageUrl }) {
  return (
    <div className={styles.container}>
      <img src={imageUrl} className={styles.asset} />
      <span className={styles.text}>{name}</span>
    </div>
  );
}

export default Asset;
