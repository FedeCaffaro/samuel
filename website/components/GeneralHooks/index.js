/* eslint-disable max-nested-callbacks */
/* eslint-disable camelcase */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useWallet } from "use-wallet";
import { toast } from "react-toastify";
import i18next from "i18next";

import { getWallet, setWallet } from "../../services/LocalStorageService";
import actions from "../../redux/Settings/actions";
import { ROUTES } from "../../constants/routes";
import { getActualRoute } from "../../utils/routes";
import { getAssets } from "../../services/CollectionService";
import { depositsOf, stakeOf } from "../../utils/staking";
import { SAMOT_DROPS } from "../../constants/drops";

function GeneralHooks() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { reset } = useWallet();

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

  async function getAssets({ owner }) {
    const response = await fetch(
      `https://api.opensea.io/api/v2/chain/ethereum/account/${owner}/nfts?collection=samot-club`,
      {
        headers: {
          'x-api-key': 'd37e7ee828334d34b23637281bc075e4',
        },
      });
    const data = await response.json();
    return data.nfts;
  }

  // Check if is owner
  useEffect(() => {
    if (wallet?.account) {
      getAssets({
        // limit: 50,
        // offset: 0,
        // asset_contract_address: SAMOT_DROPS.contract,
        owner: wallet?.account,
      }).then(( data ) =>
        stakeOf(wallet.account).then((stake) =>
          depositsOf(wallet.account).then((deposits) => {
            const owning = data.length + stake.length + deposits.length;
            // eslint-disable-next-line no-console
            console.info("User owns", owning, "NFT's");

            if (owning === 0) {
              setWallet(null);
              reset();
              dispatch(actions.setWallet(null));
              toast.error(i18next.t("Navbar:notOwner"));
            }
          })
        )
      );
    }
  }, [wallet]);

  return <></>;
}

export default GeneralHooks;
