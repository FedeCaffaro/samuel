import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import actions from '../../redux/Settings/actions';
import Asset from '../Assets';

import styles from './styles.module.scss';

function Collection({ collection }) {
  const dispatch = useDispatch();

  const { currentCollection, currentAssets, currentCollectionLoading, currentAssetsLoading } = useSelector(
    (state) => state.settings
  );

  useEffect(() => {
    dispatch(actions.getCollection(collection?.slug));
  }, [collection]);

  useEffect(() => {
    if (currentCollection?.name === 'undefined') {
      dispatch(actions.getCollection(collection?.slug));
    }
  }, [currentCollection?.name]);

  useEffect(() => {
    dispatch(
      // eslint-disable-next-line camelcase
      actions.getAssets({ collection: collection?.slug, limit: 50 })
    );
  }, [collection]);

  return currentCollectionLoading || currentAssetsLoading ? null : (
    <div className={styles.center}>
      <div className={styles.header}>
        <img src={currentCollection?.picture} className={styles.picture} />
        <span className={styles.name}>{currentCollection?.name}</span>
      </div>
      <div className={styles.assets}>
        {currentAssets?.map((asset) => (
          <Asset {...asset} key={asset.name} />
        ))}
      </div>
    </div>
  );
}

export default Collection;
