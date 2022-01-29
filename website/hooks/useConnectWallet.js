/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useWallet } from 'use-wallet';

import actions from '../redux/Settings/actions';
import { getWallet, setWallet } from '../services/LocalStorageService';
import { mapWallet } from '../utils/wallet';

export const useConnectWallet = () => {
  const dispatch = useDispatch();
  const wallet = useWallet();
  const [localWallet, setLocalWallet] = useState(null);
  //   const localWallet = getWallet();

  const onConnectWallet = () => {
    wallet.connect();
  };

  useEffect(() => {
    if (window) {
      setLocalWallet(getWallet());
    }
  }, []);

  useEffect(() => {
    if (wallet?.account && !!window) {
      setWallet(mapWallet(wallet));
      location.reload();
    }
  }, [wallet]);

  useEffect(() => {
    if (localWallet) {
      dispatch(actions.setWallet(localWallet));
    }
  }, [localWallet]);

  //   useEffect(() => {
  //     if (wallet?.account) {
  //       dispatch(actions.setWallet(wallet));
  //     }
  //   }, [wallet]);

  return { onConnectWallet };
};
