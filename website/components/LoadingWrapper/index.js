import React from 'react';
import cn from 'classnames';

import { useInitialLoading } from '../../hooks/useInitialLoading';

// import Loading from './components/Loading';
import styles from './styles.module.scss';

function LoadingWrapper({ loading, children, withInitialLoading = false, className = '', loadingProps }) {
  const initialLoading = useInitialLoading(withInitialLoading, loading);
  return initialLoading.current || loading ? (
    <div className={cn(className, styles.container)}>
      <span className={styles['loading-text']}>LOADING</span>
    </div>
  ) : (
    <>{children}</>
  );
}

export default LoadingWrapper;
