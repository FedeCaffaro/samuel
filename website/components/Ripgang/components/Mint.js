import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { Button } from "@chakra-ui/react";
import {
  getMaxSupply,
  getCurrentSupply,
  isSaleActive,
  publicSale,
  isOgOwner,
  isOwnerSaleActive,
  ownerSale
} from "./ContractFunction";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { buySuccessRender, buyErrorRender } from "./ContractFunction";

const Mint = (props) => {
  const { active, chainId, account } = useWeb3React();

  const [mintAmount, setMintAmount] = useState(1);

  const [totalMinted, setTotalMinted] = useState(0);
  const [maxSupply, setMaxSupply] = useState(0);

  const [totalMinted2, setTotalMinted2] = useState(0);
  const [maxSupply2, setMaxSupply2] = useState(0);

  const [maxPerTxn, setMaxPerTxn] = useState(1);
  const [maxPerTxnPreSale, setMaxPerTxnPresale] = useState(1);

  const [saleActive, setSaleActive] = useState(false);
  const [onwerSaleActive, setOwnerSaleActive] = useState(false);
  const [isOgOwnerState, setIsOgOwnerState] = useState(false);

  const [transactionUrl, setTransactionUrl] = useState("");
  const [pending, setPending] = useState(false);
  const [contractUrl, setContractUrl] = useState("");

  async function handleInactiveStats() {
    getCurrentSupply(1).then(setTotalMinted);
    getMaxSupply(1).then(setMaxSupply);
  }

  async function handleStats() {
    getCurrentSupply(1).then(setTotalMinted);
    getMaxSupply(1).then(setMaxSupply);
    isSaleActive().then(setSaleActive);
    isOgOwner(account).then(setIsOgOwnerState);
    isOwnerSaleActive().then(setOwnerSaleActive);
    getCurrentSupply(2).then(setTotalMinted2);
    getMaxSupply(2).then(setMaxSupply2);
  }

  useEffect(() => {
    handleInactiveStats();

    if (active) {
      handleStats();
    }
  }, [active]);

  async function handlePublicMint() {
    if (active) {
      try {
        if (isOgOwnerState) {
          toast.promise(ownerSale(1, props.id), {
            pending: "Esperando confirmación...",
            success: { render: renderAndGetData(buySuccessRender) },
            error: { render: renderAndGetError(buyErrorRender) },
          });
        } else {
          toast.promise(publicSale(1, props.id), {
            pending: "Esperando confirmación...",
            success: { render: renderAndGetData(buySuccessRender) },
            error: { render: renderAndGetError(buyErrorRender) },
          });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Please install MetaMask");
    }
  }

  const renderAndGetData =
    (aFunction, callBefore = () => {}) =>
    (result) => {
      callBefore();

      return aFunction(result?.data);
    };

  const renderAndGetError =
    (aFunction, callBefore = () => {}) =>
    (result) => {
      callBefore();
      return aFunction(result?.data);
    };

  return (
    <div className="flex flex-col justify-center text-center">
      {active ? (
        <div>
          {saleActive ? (
            <div>
              {1 == chainId ? (
                <div>
                  <Button onClick={handlePublicMint} className="button-connect oskari-g2 text-white fs-5">
                    MINTEO CON ETHEREUM
                  </Button>
                </div>
              ) : (
                <div>
                  <p className="font-bold">
                    {" "}
                    Tenes que estar conectado a Ethereum mainnet para mintear.{" "}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <p>El minteo todavia no esta activo! </p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <p>
            {" "}
            Tenes que estar conectado <br></br> a Metamask para mintear.
          </p>
        </div>
      )}
    </div>
  );
};

export default Mint;
