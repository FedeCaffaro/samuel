import { useState, useEffect } from "react";
import { Button } from "@chakra-ui/react";
import { Container, Row, Col } from "react-bootstrap";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useWeb3React } from "@web3-react/core";
import { getMaxSupply, getCurrentSupply } from "./ContractFunction";
import NFTCard from "./NFTCard";
import CenteredModal from "./CenteredModal";
import { NFTModal } from "./NFTModal";
import ControlledCarousel from "./ControlledCarousel";
import ripgangJson from "../../../data/ripgang_drops.json";

const RipgangMain = ({ setModalShow, modalShow }) => {
  const { active, chainId, account } = useWeb3React();

  const [totalMinted, setTotalMinted] = useState(0);
  const [maxSupply, setMaxSupply] = useState(0);
  const [nftModalShow, setNftModalShow] = useState(false);
  const [modalData, setModalData] = useState({});
  const [index, setIndex] = useState(1);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };


  async function handleStats() {
    if (index == 0) {
      getCurrentSupply(1).then(setTotalMinted);
      getMaxSupply(1).then(setMaxSupply);
    } else if (index == 1) {
      getCurrentSupply(7).then(setTotalMinted);
      getMaxSupply(7).then(setMaxSupply);
    }
  }

  useEffect(() => {
    if (chainId == 1) {
      handleStats(index);
    }
  }, [chainId, index]);

  useEffect(() => {
    if (nftModalShow == false) {
      if (index == 0) {
        setModalData(ripgangJson[0])
      } else if (index == 1) {
        setModalData(ripgangJson[5])
      }
    }
  }, [nftModalShow, index]);

  return (
    <div className="main-container">
      <div className="top-banner-container">
        <img
          src="/ripgang/ripgang_collection.png"
          alt="Bohemian GroupLogo"
          className="top-banner"
        />
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
          <span className="bold">
            La RIPGANG COLLECTION es un puente entre la familia de BOHEMIAN
            GROOVE, el movimiento RIPGANG, y los fanáticos y seguidores del
            sello y su colectivo artístico.
          </span>
          <br></br>
          <br></br>
          <span className="bold mx-md-5">
            Junto a nuestros partners de SAMOT CLUB, este proyecto está
            orientado de manera directa a construir, cultivar y promover la
            verdadera comunidad de la RIPGANG a través de COLECCIONABLES
            DIGITALES que se inspiran en la identidad de nuestros artistas y
            representan beneficios reales en el universo de Bohemian Groove.
          </span>
          <br></br>
          <br></br>
        </p>
      </div>
      <footer>
        <div className="footer-logo">
          <a href="https://discord.gg/NU2EzTH9vA" target="_blank" className="no-hover d-flex justify-content-center align-items-center flex-wrap">
            <FontAwesomeIcon icon={faDiscord} style={{ width: "100%" }} />
            <p className="join-discord">Unite a Discord</p>
          </a>
          {/* <p>Unite a Discord</p> */}
        </div>
      </footer>

      {/* Ripcoin */}

      <div className="flex-container border-top pt-5 mb-0">
        <Container>
          <Row>
            <Col xs={12} lg={6} className="d-flex justify-content-center align-items-center">
              {/* <video
                className="videoTag"
                autoPlay
                loop
                muted
                playsInline
              // onLoadedData={onVideoLoaded}
              // style={{ display: isVideoLoaded ? "block" : "none" }}
              >
                <source src="/ripgang/ripcoin.mp4" type="video/mp4" />
              </video> */}
              <ControlledCarousel
                index={index}
                handleSelect={handleSelect}
              />
            </Col>
            <Col
              xs={12}
              lg={6}
              className="d-flex justify-content-center flex-wrap flex-column align-items-center"
            >
              <h1 className="bold-h1 oskari-g2 line-height-85">
                Llevate una RIPCOIN, coleccionarla es gratis.
              </h1>
              <span className="helvetica mb-3 mt-2">
                Las RIPCOINS son el token de la RIPGANG. Su diseño va a ser
                distinto en cada uno de los 7 drops y habrá 1312 copias de cada una. Tenerla te da acceso a sorteos por premios
                y beneficios de todo el sello. Coleccioná la que quieras (o todas) y unite al Discord para participar.
              </span>
              <span className="bold oskari-g2 align-self-start">
                Más de 300 owners de una RIPCOIN ya ganaron premios.
              </span>
              <ul className="list-style-disc align-self-start p-0">
                <li className="bold oskari-g2 item my-1">
                  Merch de EDICIÓN LIMITADA de toda la RIPGANG
                </li>
                <li className="bold oskari-g2 item my-1">
                  Pre-reserva de entradas para shows de todos los artistas
                </li>
                <li className="bold oskari-g2 item my-1">
                  Acceso a shows agotados de cualquiera de los artistas
                </li>
                <li className="bold oskari-g2 item my-1">
                  Invitaciones a los eventos exclusivos de BOHEMIAN GROOVE
                </li>
                <li className="bold oskari-g2 item my-1">
                  Airdrops de coleccionables digitales
                </li>
              </ul>
              <div className="connect-button-container">
                <Button
                  onClick={() => setModalShow(true)}
                  className="button-mint"
                >
                  {index == 0 ? "MINTEA TU RIPCOIN DE DILLOM" : "MINTEA TU RIPCOIN DE CARRITO"}
                </Button>
                {chainId === 1 ? (
                  <p className="w-100 text-center mt-2">
                    {" "}
                    {totalMinted} / {maxSupply}
                  </p>
                ) : (
                  <p className="w-100 text-center mt-2 invisible">
                    {" "}
                    {totalMinted} / {maxSupply}
                  </p>
                )}
              </div>
            </Col>
          </Row>
          <div className="centered-container"></div>
        </Container>
      </div>

      {/* Piezas Dillom */}

      <div className="flex-container border-top pt-5">
        <span className="w-100 text-center letter-spacing">PRIMER DROP</span>
        <span className="xl-title w-100 text-center">DILLOM</span>
      </div>
      <NFTModal
        {...modalData}
        setModalShow={setModalShow}
        show={nftModalShow}
        onHide={() => setNftModalShow(false)}
      />
      <CenteredModal {...modalData} show={modalShow} onHide={() => setModalShow(false)} />
      <Container>
        <Row>
          {ripgangJson.slice(1, 5).map((nft) => {
            return (
              <>
                <Col
                  xs={12}
                  md={6}
                  className="d-flex justify-content-center align-items-around"
                >
                  <NFTCard
                    {...nft}
                    setNftModalShow={setNftModalShow}
                    setModalData={setModalData}
                    setModalShow={setModalShow}
                  />
                </Col>
              </>
            );
          })}
          {/* <Col xs={12} md={4} className="d-flex justify-content-center align-items-around"><NFTCard /></Col>
          <Col xs={12} md={4} className="d-flex justify-content-center align-items-around"><NFTCard /></Col>
          <Col xs={12} md={4} className="d-flex justify-content-center align-items-around"><NFTCard /></Col> */}
        </Row>
      </Container>

      {/* Pieza Yon Frula */}

      <div className="flex-container border-top pt-3 mb-0">
        <Container>
          <Row>
            <Col sm={12} lg={5} className="d-flex justify-content-center align-items-center">
              <video
                className="videoTag w-75 border border-2 my-4"
                autoPlay
                loop
                muted
                playsInline
              // onLoadedData={onVideoLoaded}
              // style={{ display: isVideoLoaded ? "block" : "none" }}
              >
                <source src="/ripgang/dillom_x_yon.mp4" type="video/mp4" />
              </video>
            </Col>
            <Col xs={12} lg={7} className="d-flex justify-content-start align-items-between flex-wrap">
              <span className="w-100 poppins text-small">ARTIST COLLAB</span>
              <span className="w-100 lg-title">DILLOM X YON</span>
              <span className="w-100 poppins text-small mb-2">Yon Frula, artista chaqueño, amigo de la casa y creador de <span className="fw-bold poppins text-small d-inline">Peacevoid World</span>:
                Un universo psicodélico plagado de paisajes surreales, personajes lisérgicos y arte.
                Con su estilo característico, Yon nos regala una versión groupieficada de DILLOM,
                siendo esta la primera colaboración de la Ripgang Collection y también la primera
                pieza única que será subastada a través de Open Sea. </span>
              <span className="">
                El ganador de la subasta obtendrá los siguientes beneficios:
              </span>
              <ul className="list-style-none p-0">
                <li className="item my-1">
                  Vinilo POST MORTEM Edición Especial.
                </li>
                <li className="item my-1">
                  Fine Art Print de la obra, firmada por el artista.
                </li>
                <li className="item my-1">
                  Pre-escucha exclusiva del próximo material de estudio de DILLOM.*
                </li>
                <li className="item my-1">
                  Invitación al evento de lanzamiento del próximo disco del artista.*
                </li>
              </ul>
              <span className="w-100 text-xs poppins">*(La pre-escucha y el evento de lanzamiento no tienen una fecha proyectada)</span>
              <Row className="d-flex justify-content-start align-items-center w-100 mt-3 mx-auto">
                <Col className="d-flex justify-content-center align-items-center mb-3">
                  <a href="https:///opensea.io/es/assets/ethereum/0x1bbb943c60788b4c6d4257f477e2dc2a6f759738/6" target="_blank" className="button-mint m-0 no-hover">
                    Ver en OpenSea
                  </a>
                </Col>
                <Col className="d-flex justify-content-center align-items-center mb-3">
                  <img className="rounded-circle me-4" src="ripgang/frula-profile.jpg" height="60" />
                  <a className="fs-4 no-hover" href="https://twitter.com/botfrula">@botfrula</a>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
      <footer className="flex-container border-top pt-4 mt-2">
        <span className="text-center w-100">RIPGANG x SAMOT CLUB</span>
        <span>2022</span>
      </footer>
    </div >
  );
};

export default RipgangMain;
