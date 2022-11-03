import { useState, useEffect } from 'react';
import { Button } from "@chakra-ui/react";
import { Container, Row, Col } from 'react-bootstrap';
import { faDiscord } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useWeb3React } from "@web3-react/core";
import { getMaxSupply, getCurrentSupply } from "./ContractFunction";
import NFTCard from './NFTCard';

const RipgangMain = ({ setModalShow }) => {

  const {
    active,
    chainId,
    account,
  } = useWeb3React();

  const [totalMinted, setTotalMinted] = useState(0);
  const [maxSupply, setMaxSupply] = useState(0);

  async function handleStats() {
    getCurrentSupply(1).then(setTotalMinted);
    getMaxSupply(1).then(setMaxSupply);
  }

  useEffect(() => {
    if (chainId == 1) {
      handleStats();
    }
  }, [chainId]);

  return (
    <div className="main-container" >
      <div className="top-banner-container">
        <img src="/ripgang/ripgang_collection.png" alt="Bohemian GroupLogo" className="top-banner" />
      </div>
      {/* <div className="countdown-container">
        <Button
          onClick={() => setModalShow(true)}
          className="button-connect"
        >
          MINTEAR
        </Button>
        {chainId === 1 &&
          <p> MINTED : {totalMinted} / {maxSupply}</p>
        }
      </div> */}
      <br />
      <div className="description-container">
        <p className="description">
          <span className="bold my-md-3">7 ARTISTAS = 7 DROPS</span>
          <br></br>
          <br></br>
          <span className="bold">La RIPGANG COLLECTION es un puente entre la familia de BOHEMIAN GROOVE, el movimiento RIPGANG, y los fanáticos y seguidores del sello y su colectivo artístico.</span>
          <br></br>
          <br></br>
          <span className="bold mx-md-5">
            Junto a nuestros partners de SAMOT CLUB, este proyecto está orientado de manera directa a construir, cultivar y promover la verdadera comunidad de la RIPGANG a través de COLECCIONABLES DIGITALES que se inspiran en la identidad de nuestros artistas
            y representan beneficios reales en el universo de Bohemian Groove.
          </span>
          <br></br>
          <br></br>
        </p>
      </div>
      <footer>
        <div className="footer-logo">
          <a href="https://discord.gg/NU2EzTH9vA" target='_blank'>
            <FontAwesomeIcon icon={faDiscord} />
          </a>
        </div>
      </footer>
      <div className="flex-container">
        <Container>
          <Row>
            <Col xs={12} lg={5} className="d-flex justify-content-center">
              <video className='videoTag'
                autoPlay
                loop
                muted
                playsInline
              // onLoadedData={onVideoLoaded}
              // style={{ display: isVideoLoaded ? "block" : "none" }}
              >
                <source src="/ripgang/ripcoin.mp4" type='video/mp4' />
              </video>
            </Col>
            <Col xs={12} lg={7} className="d-flex justify-content-center flex-wrap flex-column align-items-center">
              <h1 className="bold-h1 oskari-g2 line-height-85">
                Llevate una RIPCOIN, coleccionarla es gratis.
              </h1>
              <span className="helvetica mb-3 mt-2">
                Las RIPCOINS son el token de la RIPGANG, y su diseño va a ser distinto en cada uno de los 7 drops. La primera está inspirada en DILLOM,
                pero los beneficios de tenerla aplican a todos los artistas de la RIPGANG.
              </span>
              <span className="bold oskari-g2 align-self-start">Más de 200 owners de una RIPCOIN ya ganaron premios.</span>
              <ul className="list-style-disc align-self-start d-block">
                <li className="bold oskari-g2">Merchandising de EDICIÓN LIMITADA de toda la RIPGANG</li>
                <li className="bold oskari-g2">Pre-reserva de entradas para shows de todos los artistas</li>
                <li className="bold oskari-g2">Acceso a shows agotados de cualquiera de los artistas</li>
                <li className="bold oskari-g2">Invitaciones a los eventos exclusivos de BOHEMIAN GROOVE</li>
                <li className="bold oskari-g2">Airdrops de coleccionables digitales</li>
              </ul>
              <div className="connect-button-container">
                <Button
                  onClick={() => setModalShow(true)}
                  className="button-mint"
                >
                  MINTEAR
                </Button>
                {chainId === 1 &&
                  <p className="w-100 text-center mt-2"> MINTEADOS : {totalMinted} / {maxSupply}</p>
                }
              </div>
            </Col>
          </Row>
          <div className="centered-container">

          </div>
        </Container>
      </div>
      <div className="flex-container">
        <span className="w-100 text-center letter-spacing">PRIMER DROP</span>
        <span className="xl-title w-100 text-center">DILLOM</span>
      </div>
      <Container>
        <Row>
          <Col xs={12} md={4} className="d-flex justify-content-center align-items-around"><NFTCard /></Col>
          <Col xs={12} md={4} className="d-flex justify-content-center align-items-around"><NFTCard /></Col>
          <Col xs={12} md={4} className="d-flex justify-content-center align-items-around"><NFTCard /></Col>
        </Row>
      </Container>

    </div>
  );
}

export default RipgangMain;
