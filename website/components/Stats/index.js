import i18next from 'i18next';
import React from 'react';
import cn from 'classnames';

import styles from './styles.module.scss';

function Stats({ owned, staked, balance, className }) {
  const elements = [
    {
      title: i18next.t('Stats:owned'),
      value: i18next.t('Stats:ownedValue', { owned })
    },
    {
      title: i18next.t('Stats:staked'),
      value: i18next.t('Stats:stakedValue', { staked })
    },
    {
      title: i18next.t('Stats:balance'),
      value: i18next.t('Stats:balanceValue', { balance })
    }
  ];
  return (
    <div className={cn(styles.container, className)}>
      {elements.map(({ title, value }, index) => (
        <>
          <div className={styles.element} key={title}>
            <span className={styles.title}>{title}</span>
            <span className={styles.value}>{value}</span>
          </div>
          {index !== elements.length - 1 && <div className={styles.divider} />}
        </>
      ))}
    </div>
  );
}

export default Stats;
