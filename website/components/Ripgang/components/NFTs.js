import Image from "next/image";
import Mint from './Mint';
import Countdown from "./Countdown.tsx";
import { faDiscord } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function NFTs ()  {

  return(
    <div className="main-container" >
      <div className="spinner-container">
        <img src="/ripgang/Logo.webp" alt="Bohemian GroupLogo" className="rotate"/>
      </div>
          <div className="countdown-container">
            <Countdown />
          </div>
          <br/>
          <div className="description-container">
            <p className="description">
            Bohemian Groove Corp. y Samot Club presentan la RIPCOIN, pieza inaugural de la colección de la RIPGANG.
            <br></br>
            <br></br>
            Este proyecto busca expandir aún más el universo conocido (y por conocer) de cada uno de los artistas, a través de drops que no solo serán piezas coleccionables de edición limitada, sino también llaves para acceder a beneficios, contenidos y regalos exclusivos, porque seamos honestos ¿a quién no le gustan los regalos?
            <br></br>
            <br></br>
            Es por eso que con esta moneda como puntapié inicial - y en contra de toda lógica y la voluntad de nuestros contadores - les traemos 1312 ediciones free to claim* para que de acá a un año cuando haya gente pagando plata pelotuda por los jpgs de Bohemian Groove, no puedan decir que no se los avisamos.
            <br></br>
            <br></br>
            Para los que ya nos conocen, y a quienes acaban de llegar: No se duerman, y bienvenidos al universo de Bohemian Groove.
            <br></br>
            <br></br> 
            Atte.
            Bohemian Groove. Corp x Samot Club
            </p>
          </div>
          <footer>
            <div className="footer-logo">
              <a href="https://discord.gg/NU2EzTH9vA" target='_blank'>
                <FontAwesomeIcon icon={faDiscord}/>
              </a>
            </div>
            <div className="disclaimer">
                <p>*La Ripcoin es gratuita pero su creación requiere de una transacción en Ethereum a cargo del adquiriente. Esta transacción es externa a Bohemian Groove Corp. y Samot Club y no representa ganancia alguna para ambos.</p>
            </div>
          </footer>
    </div>
  );
}
  
export default NFTs;
