/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useWallet } from 'use-wallet';

import { getWallet, setWallet } from '../services/LocalStorageService';
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
