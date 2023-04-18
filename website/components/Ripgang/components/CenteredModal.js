import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Mint from './Mint';
import { CrossmintPayButton } from "@crossmint/client-sdk-react-ui";
import { useWeb3React } from "@web3-react/core";
import { injected } from './Wallet/connectors';

function CenteredModal(props) {

    const {
        active,
        chainId,
        account,
        library,
        connector,
        activate,
    } = useWeb3React();

    async function connect() {
        try {
            await activate(injected)
            localStorage.setItem('isWalletConnected', true);
        } catch (ex) {
            console.log(ex)
        }
    }

    console.log(props.price)

    return (
        <Modal
            {...props}
            className="text-white"
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Elegí una opción de minteo
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="minting-container">
                    {chainId == 1 ? (
                        <div className="minting-container">
                            <Mint {...props} />
                        </div>
                    ) : (
                        <button
                            className="button-connect oskari-g2 text-white fs-6"
                            onClick={connect}>
                            CONECTA TU WALLET PARA MINTEAR CON ETH
                        </button>
                    )}
                    <div className="w-100 m-4 flex align-items-center">
                        <span>Ó</span>
                    </div>

                    <CrossmintPayButton
                        collectionTitle="RIPCOIN x RIPGANG"
                        collectionDescription="RIPCOIN x RIPGANG"
                        collectionPhoto="https://postimg.cc/Z02KBmr3"
                        className="my-crossmint-button"
                        clientId="17226ac4-e079-493b-9022-643af8aa0da6"
                        mintConfig={{ "type": "erc-1155", "totalPrice": props.price, "_quantity": "1", "_id": props.id }}
                    />
                </div>
            </Modal.Body>
        </Modal >
    );
}

export default CenteredModal;