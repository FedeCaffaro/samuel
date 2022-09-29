import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Mint from './Mint';
import { CrossmintPayButton } from "@crossmint/client-sdk-react-ui";


function CenteredModal(props) {
    return (
        <Modal
            {...props}
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
                    <Mint />
                    <div className="w-100 m-4 flex align-items-center">
                        <span>Ó</span>
                    </div>
                    <CrossmintPayButton
                        collectionTitle="RIPCOIN x RIPGANG"
                        collectionDescription="RIPCOIN x RIPGANG"
                        collectionPhoto="https://postimg.cc/Z02KBmr3"
                        clientId="17226ac4-e079-493b-9022-643af8aa0da6"
                        mintConfig={{ "type": "erc-1155", "totalPrice": "0.0000", "_quantity": "1", "_id": "1" }}
                    />
                </div>
            </Modal.Body>
            <Modal.Footer>
            </Modal.Footer>
        </Modal>
    );
}

export default CenteredModal;