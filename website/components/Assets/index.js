/* eslint-disable no-empty-function */
import React, { useMemo } from 'react';
import cn from 'classnames';

import styles from './styles.module.scss';
import { getRandomDefaultAsset } from './utils';

function Asset({ name, tokenId, imageUrl, selected, onClick = () => {} }) {
  const image = useMemo(() => imageUrl || getRandomDefaultAsset(), [imageUrl]);

  return (
    <div
      className={cn(styles.container, {
        [styles.selected]: selected
      })}
      onClick={onClick}
    >
      <img src={image} className={styles.asset} />
      <span className={styles.text}>{name || `#${tokenId}`}</span>
    </div>
  );
}

export default Asset;
