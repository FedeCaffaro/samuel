import React, { useState , useEffect} from "react";
import { Transition } from "@headlessui/react";
import { useWeb3React } from '@web3-react/core';
import { injected } from './Wallet/connectors';

import Image from "next/image";

function RipNavbar() {
	const [isOpen, setIsOpen] = useState(false);
	const { active, account, library, connector, activate, deactivate } = useWeb3React();
  
	useEffect(() => {
	  const connectWalletOnPageLoad = async () => {
		if (localStorage?.getItem('isWalletConnected') === 'true') {
		  try {
			await activate(injected);
			localStorage.setItem('isWalletConnected', true);
		  } catch (ex) {
			console.log(ex);
		  }
		}
	  }
	  connectWalletOnPageLoad();
	}, [])
  
	async function connect() {
	  try {
		await activate(injected)
		localStorage.setItem('isWalletConnected', true);
	  } catch (ex) {
		console.log(ex)
	  }
	}
  
	async function disconnect() {
	  try {
		deactivate();
		localStorage.setItem('isWalletConnected', false);
	  } catch (ex) {
		console.log(ex);
	  }
	}
  
	return (
		<div>
			<nav className="ripgang-navbar">
				<div className="ripgang-navbar_outer">
					<div className="ripgang-navbar_logos">
						<a href='https://www.instagram.com/bohemiangroovecorp' target='_blank'>
							<img 
								src="/ripgang/Logo_Bohemian_Blanco.png"
								alt="Logo BG"
								className="navbar-logo"
							/>
						</a>
					</div>
					<div className="dropdown-button_container">
					<button
						onClick={() => setIsOpen(!isOpen)}
						type="button"
						// className="dropdown-container"
						aria-controls="mobile-menu"
						aria-expanded="false"
					>
						<span className="sr-only">Abrir menu</span>
						{!isOpen ? (
							<svg
								className="button-dropdown"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M4 6h16M4 12h16M4 18h16"
								/>
							</svg>
						) : (
							<svg
								className="button-dropdown"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						)}
					</button>
					</div>
					<div className="button-container">
						<div className="button-container_inner">
						{active ?
						<button  className="button-disconnect"  onClick={disconnect}>Desconectar ...{account.slice(-5)}</button>
						: 
						<button  className="button-connect"  onClick={connect}>Conectar Wallet</button>
						}											
						</div>
					</div>
					<div className="ripgang-navbar_logos">
						<a href='https://samot.club' target='_blank'>
							<img
								src="/ripgang/Logo_Samot_Blanco.png"
								alt="Logo Samot"
								className="navbar-logo"
							/>
						</a>
					</div>
				</div>
					<Transition
						show={isOpen}
						enter="transition ease-out duration-100 transform"
						enterFrom="opacity-0 scale-95"
						enterTo="opacity-100 scale-100"
						leave="transition ease-in duration-75 transform"
						leaveFrom="opacity-100 scale-100"
						leaveTo="opacity-0 scale-95"
					>
					{(ref) => (
						<div className="md-hidden" id="mobile-menu">
							<div
								ref={ref}
								className="dropdown-container"
							>
							<ul>
								<li className="button-container_inner">
								{active ?
								<button  className="button-disconnect"  onClick={disconnect}>Desconectar ...{account.slice(-5)}</button>
								: 
								<button  className="button-connect"  onClick={connect}>Conectar Wallet</button>
								}					
								</li>
								<li>
								{/* <a
									href="https://twitter.com/samotclub"
									target="_blank" rel="noopener noreferrer"
									activeClass="services"
									to="services"
									smooth={true}
									offset={50}
									duration={500}
									className="block px-3 py-2 text-base font-medium text-black rounded-md cursor-pointer hover:bg-black hover:text-white"
								>
									Twitter
								</a> */}
								</li>
							</ul>
							</div>
						</div>
					)}
					</Transition>
			</nav>
		</div>
	);
}

export default RipNavbar;
