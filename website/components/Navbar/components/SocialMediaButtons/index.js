import React from 'react';

import { SOCIAL_MEDIA_ICONS } from './constants';
import styles from './styles.module.scss';

function SocialMediaButtons() {
  return (
    <div className={styles['icons-container']}>
      {SOCIAL_MEDIA_ICONS.map(({ key, url, icon }) => (
        <a href={url} key={key} className={styles['icon-link']}>
          <img src={icon} />
        </a>
      ))}
    </div>
  );
}

export default SocialMediaButtons;
