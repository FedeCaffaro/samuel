/* eslint-disable no-empty-function */
import React, { useMemo } from 'react';
import cn from 'classnames';

import styles from './styles.module.scss';
import { getRandomDefaultAsset } from './utils';
import { CHECK } from './constants';

function Asset({ name, tokenId, imageUrl, selected, onClick = () => {} }) {
  const image = useMemo(() => imageUrl || getRandomDefaultAsset(), [imageUrl]);

  return (
    <div
      className={cn(styles.container, {
        [styles.selected]: selected
      })}
      onClick={onClick}
    >
      <div className={styles['checkbox-selector']}>
        <div className={styles.checkbox}>
          {selected && <img src={CHECK} className={styles.check} alt="check" />}
        </div>
      </div>
      <img src={image} className={styles.asset} />
      <span className={styles.text}>{name || `#${tokenId}`}</span>
    </div>
  );
}

export default Asset;
