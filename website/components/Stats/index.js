import i18next from 'i18next';
import React from 'react';
import cn from 'classnames';

import styles from './styles.module.scss';

function Stats({ owned, staked, balance, className, big }) {
  const elements = [
    {
      title: i18next.t('Stats:owned'),
      value: i18next.t('Stats:ownedValue', { owned: owned > 50 ? '50+' : owned })
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
            <span
              className={cn(styles.title, {
                [styles.big]: big
              })}
            >
              {title}
            </span>
            <span
              className={cn(styles.value, {
                [styles.big]: big
              })}
            >
              {value}
            </span>
          </div>
          {index !== elements.length - 1 && (
            <div
              className={cn(styles.divider, {
                [styles.big]: big
              })}
            />
          )}
        </>
      ))}
    </div>
  );
}

export default Stats;
