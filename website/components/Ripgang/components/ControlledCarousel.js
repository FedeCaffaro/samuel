import React, { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';

const ControlledCarousel = ({ index, handleSelect }) => {

  const [isVideoLoaded, setIsVideoLoaded] = useState(true);

  const onVideoLoaded = () => {
    setIsVideoLoaded(true);
  }

  return (
    <Carousel
      activeIndex={index}
      onSelect={handleSelect}
      interval={null}
      wrap={false}
    >
      <Carousel.Item>
        {/* <img
          className="video-thumb tiny"
          src="/ripgang/ripcoin_placeholder.jpg"
          style={{ display: isVideoLoaded ? "none" : "block", width: "100%" }}
        /> */}
        <video 
        // className='videoTag'
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={onVideoLoaded}
          style={{ display: isVideoLoaded ? "block" : "none" }}
        >
          <source src="/ripgang/ripcoin.mp4" type='video/mp4' />
        </video>
        <Carousel.Caption>
          {/* <h4>NFT 1</h4> */}
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        {/* <img
          className="video-thumb tiny"
          src="/ripgang/carritocoin_placeholder.jpg"
          style={{ display: isVideoLoaded ? "none" : "block", width: "100%" }}
        /> */}
        <video
        //   className='videoTag'
          autoPlay loop
          muted
          playsInline
          onLoadedData={onVideoLoaded}
          style={{ display: isVideoLoaded ? "block" : "none" }}>
          <source src="/ripgang/carritocoin.mp4" type='video/mp4' />
        </video>
        <Carousel.Caption>
          {/* <h4>NFT 2</h4> */}
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default ControlledCarousel