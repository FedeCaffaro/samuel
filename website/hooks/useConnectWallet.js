/* eslint-disable camelcase */
import { useEffect } from 'react';
import { useWallet } from 'use-wallet';

import { setWallet } from '../services/LocalStorageService';
import { mapWallet } from '../utils/wallet';

export const useConnectWallet = () => {
  const wallet = useWallet();

  const onConnectWallet = () => {
    wallet.connect();
  };

  useEffect(() => {
    if (wallet?.account && !!window) {
      setWallet(mapWallet(wallet));
      location.reload();
    }
  }, [wallet]);
  return { onConnectWallet };
};
