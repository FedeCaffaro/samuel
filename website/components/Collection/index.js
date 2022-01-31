import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import actions from '../../redux/Settings/actions';

function Collection({ collection }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.getCollection(collection?.slug));
  }, [collection]);

  const currentCollection = useSelector((state) => state.settings.currentCollection);

  return (
    <span>
      {collection?.name}:{JSON.stringify(currentCollection)}
    </span>
  );
}

export default Collection;
