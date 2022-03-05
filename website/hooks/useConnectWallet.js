/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import { set } from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useWallet } from 'use-wallet';

import { SAMOT_DROPS } from '../constants/drops';
import { ROUTES } from '../constants/routes';
import { getAssets } from '../services/CollectionService';
import { getWallet, setWallet } from '../services/LocalStorageService';
import { depositsOf, stakeOf } from '../utils/staking';
import { mapWallet } from '../utils/wallet';

export const useConnectWallet = () => {
  const wallet = useWallet();
  const router = useRouter();
  const [owned, setOwned] = useState([]);
  const [loading, setLoading] = useState(0);

  const onConnectWallet = () => {
    wallet.connect();
  };

  useEffect(() => {
    if (wallet?.account && !!window) {
      setWallet(mapWallet(wallet));
      location.reload();
    }
  }, [wallet]);

  const logoutIfNotOwner = (condition) => {
    if (condition) {
      setWallet(null);
      wallet.reset();
      router.push(ROUTES.HOME.pagePath);
    }
  };

  useEffect(() => {
    // Check if is owner
    if (wallet?.account) {
      setLoading(3);
      setOwned([]);

      getAssets({
        limit: 50,
        offset: 0,
        asset_contract_address: SAMOT_DROPS.contract,
        owner: wallet?.account
      }).then(({ data }) => {
        setLoading(loading - 1);
        setOwned(data.assets.length + owned);
      });

      stakeOf(wallet.account).then((stake) => {
        setLoading(loading - 1);
        setOwned(stake.length + owned);
      });

      depositsOf(wallet.account).then((deposits) => {
        setLoading(loading - 1);
        setOwned(deposits.length + owned);
      });

      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (loading === 0) {
      logoutIfNotOwner(!!wallet?.account && owned.length === 0);
    }
  }, [loading]);

  return { onConnectWallet };
};
