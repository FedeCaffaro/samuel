import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cn from 'classnames';
import { useWallet } from 'use-wallet';

import { CLOSE_ICON } from '../Navbar/components/BurguerMenu/constants';
import { setWallet } from '../../services/LocalStorageService';
import actions from '../../redux/Settings/actions';

import styles from './styles.module.scss';

function WalletBottom({ mobile }) {
  const account = useSelector((state) => state.settings.wallet?.account);
  const dispatch = useDispatch();
  const { reset } = useWallet();

  const onClose = () => {
    setWallet(null);
    reset();
    dispatch(actions.setWallet(null));
    location.reload();
  };

  return account ? (
    <div
      className={cn(styles.container, {
        [styles.mobile]: mobile
      })}
    >
      <span className={styles.wallet}>Wallet: ...{account?.substr(-4)} </span>
      <img className={styles.close} src={CLOSE_ICON} onClick={onClose} />
    </div>
  ) : null;
}

export default WalletBottom;
