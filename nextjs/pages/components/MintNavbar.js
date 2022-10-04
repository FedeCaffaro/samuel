import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { Button } from 'react-bootstrap';
import { useWallet } from 'use-wallet'

const MintNavbar = ({ mintWithEth, setMintWithEth }) => {
    const wallet = useWallet()

    const connect = () => {
        wallet.connect()
    }

    const disconnect = () => {
        wallet.reset()
        setMintWithEth(false);
        //Router.push("/")
    }

    return (
        <Navbar variant="dark" className="background-black">
            <Container>
                <Navbar.Brand href="/">
                    <img src="/logo.png" width="40px" />
                </Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    {wallet.status === 'connected' ?
                        (
                            <Button size="md" variant="primary" className="btn-round" onClick={() => disconnect()}>Disconnect Wallet</Button>
                        ) : (
                            <Button size="md" variant="primary" className="btn-round" onClick={() => connect()}>Connect Wallet</Button>
                        )
                    }
                </Navbar.Collapse>
            </Container>
        </Navbar >
    );
}

export default MintNavbar;