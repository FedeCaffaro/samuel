import React, { useState, useEffect } from "react";
import { Button } from "@chakra-ui/react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import { isOgOwner, getMaxSupply, getCurrentSupply } from "./ContractFunction";
import { useWeb3React } from "@web3-react/core";

export const NFTModal = (props) => {
  const handleModals = () => {
    // props.setNftModalShow(false);
    props.setModalShow(true);
  };

  const { active, chainId, account } = useWeb3React();

  const [isOgOwnerState, setIsOgOwnerState] = useState(false);
  const [totalMinted, setTotalMinted] = useState(0);
  const [isSoldout, setIsSoldout] = useState(false);

  async function handleStats(id) {
    getCurrentSupply(id).then(setTotalMinted);
    isOgOwner(account).then(setIsOgOwnerState);
  }

  handleStats(props.id);

  useEffect(() => {
    if (chainId == 1) {
      handleStats(props.id);
    }
  }, [chainId]);

  useEffect(() => {
    if (totalMinted == props.quantity) {
      setIsSoldout(true);
    } else {
      setIsSoldout(false);
    }
  }, [totalMinted]);

  // console.log(totalMinted);
  // console.log(props.id)
  // console.log(props.quantity)

  return (
    <Modal
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      size="lg"
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body className="show-grid">
        <Container>
          <Row className="d-flex justify-content-between align-items-center">
            <Col
              xs={12}
              md={5}
              className="d-flex justify-content-center align-items-center p-0"
            >
              {props.video_url ? (
                <video
                  className="videoTag w-full"
                  autoPlay
                  loop
                  muted
                  playsInline
                // onLoadedData={onVideoLoaded}
                // style={{ display: isVideoLoaded ? "block" : "none" }}
                >
                  <source
                    src={`/ripgang/${props.video_url}`}
                    type="video/mp4"
                  />
                </video>
              ) : (
                <img
                  src={`/ripgang/${props.img_url}`}
                  alt="NFT Card"
                  className="nft-card-image"
                />
              )}
            </Col>
            <Col
              xs={12}
              md={7}
              className="d-flex justify-content-center flex-wrap flex-column align-items-center"
            >
              <h1 className="align-self-start text-white bold-h1 oskari-g2 line-height-85">
                {props.name != "COMING SOON"
                  ? `${props.name} x ${props.artist}`
                  : "?"}
              </h1>
              {props.description ? (
                <>
                  <span className="border-top text-white bold oskari-g2 align-self-start pt-3 w-100">
                    {props.title}
                    <br />
                    {props.description}
                  </span>
                  <Row className="d-flex align-items-center justify-content-between pt-2 w-full m-0">
                    <Col xs={6} md={3}>
                      <Button
                        disabled={true}
                        className="text-white w-100 button-mint h4 pe-none px-4"
                      >
                        {isOgOwnerState ? props.owner_price : props.price} ETH
                      </Button>
                    </Col>
                    <Col xs={6} md={3}>
                      <Button
                        disabled={true}
                        className="text-white w-100 button-mint h4 pe-none px-4"
                      >
                        {props.quantity ? props.quantity : "?"} Un.
                      </Button>
                    </Col>
                    <Col xs={12} md={6}>
                      <Button
                        onClick={() => handleModals()}
                        disabled={isSoldout}
                        className={isSoldout ? `${"text-black background-red w-100 button-mint h4"}` : `${"text-white w-100 button-mint h4"}`}
                      >
                        {isSoldout ? "SOLD OUT" : "MINTEAR"}
                      </Button>
                    </Col>
                  </Row>
                </>
              ) : (
                <span className="border-top text-white bold oskari-g2 align-self-start pt-3 w-100">
                  ???????????????????????????????
                </span>
              )}
              {props.name != "COMING SOON" ? (
                <>
                  {props.disclaimer &&
                    <span className="d-inline border-top text-white helvetica mt-2 small pt-3">
                      {props.disclaimer}
                    </span>
                  }
                  <span className="d-inline text-white helvetica mb-3 small pt-3">
                    {props.claimability} Para más información
                    dirigirse al{" "}
                    <a
                      className="d-inline text-decoration-underline helvetica no-hover"
                      href="https://discord.gg/NU2EzTH9vA"
                      target="_blank"
                    >
                      discord oficial
                    </a>{" "}
                    de la colección.
                  </span>
                </>
              ) : (
                <span className="text-break border-top text-white helvetica mb-3 mt-2 small pt-3">
                  "??????????????????????????????????????????????????????????????"
                </span>
              )}
            </Col>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );
};
