import Card from 'react-bootstrap/Card';
import Image from "next/image";
import Mint from './Mint';
import Countdown from "./Countdown.tsx";
import { faDiscord } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function NFTs ()  {

  return(
    <div className="main-container" >
          <img src="/ripgang/Logo.webp" width={600} height={600} alt="Bohemian GroupLogo" className="rotate"/>
          <div className="countdown-container">
            <Countdown />
          </div>
          <br/>
          <div className="footer-logo">
            <a href="https://samot.chat" target='_blank'>
              <FontAwesomeIcon icon={faDiscord}/>
            </a>
          </div>
    </div>
  );
}
  
export default NFTs;
