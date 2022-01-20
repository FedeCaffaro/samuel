import React, { useEffect } from 'react';
import i18next from 'i18next';
import { useDispatch, useSelector } from 'react-redux';

import settingsActions from '../../redux/Settings/actions';

import styles from './styles.module.scss';

function Home() {
  const data = useSelector((state) => state.settings);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(settingsActions.getSettings());
  }, []);

  return (
    <div>
      <span className={styles.text}>{i18next.t('Home:helloWorld')}</span>
      <span>{JSON.stringify(data)}</span>
    </div>
  );
}

export default Home;
