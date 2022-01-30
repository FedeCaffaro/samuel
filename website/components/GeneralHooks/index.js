import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getWallet } from '../../services/LocalStorageService';
import actions from '../../redux/Settings/actions';
import { ROUTES } from '../../constants/routes';
import { getActualRoute } from '../../utils/routes';

function GeneralHooks() {
  const dispatch = useDispatch();

  // Set wallet state from local storage
  useEffect(() => {
    const localWallet = getWallet();
    if (localWallet) {
      dispatch(actions.setWallet(localWallet));
    }
  }, []);

  const wallet = useSelector((state) => state.settings.wallet);

  // Redirect to home page if wallet isn't connected and is a private route
  const [actualRoute, setActualRoute] = useState(null);
  useEffect(() => {
    setActualRoute(getActualRoute());
  }, []);

  useEffect(() => {
    if (actualRoute?.isWalletNeeded && !wallet) {
      window.location.href = window.location.origin + ROUTES.HOME.pagePath;
    }
  }, [actualRoute, wallet]);

  return <></>;
}

export default GeneralHooks;
