import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import { getWallet } from '../../services/LocalStorageService';
import actions from '../../redux/Settings/actions';
import { ROUTES } from '../../constants/routes';
import { getActualRoute } from '../../utils/routes';

function GeneralHooks() {
  const dispatch = useDispatch();
  const router = useRouter();

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
      router.push(ROUTES.HOME.pagePath);
    }
  }, [actualRoute, wallet]);

  return <></>;
}

export default GeneralHooks;
