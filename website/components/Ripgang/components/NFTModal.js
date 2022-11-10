import React, { useState } from "react";
import { Button } from "@chakra-ui/react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";

export const NFTModal = (props) => {
  const handleModals = () => {
    // props.setNftModalShow(false);
    props.setModalShow(true);
  };

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
              className="d-flex justify-content-center align-items-center"
            >
              <div className="flex-container m-0">
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
              </div>
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
                    {props.description}
                  </span>
                  <Row className="d-flex align-items-center justify-content-between pt-2 w-full">
                    <Col>
                      <Button
                        disabled={true}
                        className="text-white w-100 button-mint h4"
                      >
                        {props.price} ETH
                      </Button>
                    </Col>
                    <Col>
                      <Button
                        disabled={true}
                        className="text-white w-100 button-mint h4"
                      >
                        {props.quantity} Un.
                      </Button>
                    </Col>
                    <Col>
                      <Button
                        onClick={() => handleModals()}
                        className="text-white w-100 button-mint h4"
                      >
                        MINTEAR
                      </Button>
                    </Col>
                  </Row>
                </>
              ) : (
                <span className="border-top text-white bold oskari-g2 align-self-start pt-3 w-100">
                  ???????????????????????????????
                </span>
              )}
              <span className="border-top text-white helvetica mb-3 mt-2 small pt-3">
                Beneficio reclamable por única vez. Para más información
                dirigirse al discord oficial de la colección.
              </span>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );
};
