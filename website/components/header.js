import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { useWallet } from 'use-wallet';
import { Button, Container } from 'react-bootstrap';

const Header = (props) => {
  const wallet = useWallet();

  const disconnect = async () => {
    wallet.reset();
    Router.push('https://dizzydragons.club');
  };
  return (
    <div className="navbar">
      <Container fluid>
        <div className="navbar-left">
          <Link href="/">
            <div className="logo">
              <img src="/logo.png" height="100" alt="" loading="lazy" />
            </div>
          </Link>
          {/*
          <ul className="navbar-nav">
            <li className="nav-item active">
              <Link className="nav-link" aria-current="page" href="/">Portfolio</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" target="_blank" href="https://snapshot.org/#/bullsontheblock.eth">Vote</Link>
            </li>
          </ul>*/}
        </div>
        {wallet && wallet.account && (
          <Button onClick={() => disconnect()} variant="outline-light" size="lg">
            <img src="/metamask.png" width="25px" />{' '}
            {`${wallet.account.substr(0, 6)}...${wallet.account.substr(wallet.account.length - 4)}`}
          </Button>
        )}
      </Container>
    </div>
  );
};

export default Header;
