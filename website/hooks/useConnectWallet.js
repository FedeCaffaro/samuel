/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';

import { SAMOT_DROPS } from '../constants/drops';
import { ROUTES } from '../constants/routes';
import { getAssets } from '../services/CollectionService';
import { getWallet, setWallet } from '../services/LocalStorageService';
import { depositsOf, stakeOf } from '../utils/staking';
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
