import React, { useState, useEffect, useContext, Suspense } from 'react';
import styled from 'styled-components';
import { useRecoilState, useRecoilValue } from 'recoil';

//padding: 0 .5rem 0 .5rem; --> top right bottom left
import { AppContext } from './AppProvider.js';
const StyleControls = styled.div`
	position: absolute;
	
	top: 0px;
	left: 0px;
	
	width: 100%;
	height: 2rem;

	background: rgba(12,6,8,1);
	
	display: flex;	
	align-items: center;
	padding: 0 .5rem 0 .5rem; 
	
	#controls-left {
		display: flex;
		align-items: center;
		
		.control-key {
			text-transform: uppercase;
			margin-right: .5rem;
			color: rgba(81, 49, 54, 1);
			
			&.on {
				color: rgba(115, 75, 77, 1);	
			}
		}		
	}
	
	#controls-center {
		flex-grow: 1;
	}
	
	#controls-right {
		position: relative;
		display: flex;
		align-items: center;
		
		.cr-chevron {
			width: .8rem;
			color: #27ae60;	
			margin-right: .5rem;
			
			&.left { }
			&.up { transform: rotate(90deg);  }
			&.down { transform: rotate(270deg); }
			&.right { transform: rotate(180deg); }
		}
	}
	
`;

import { Websocket } from './Websocket.js';
import { Howler } from './SCI_FI_WRAPPERS/Howler.js';

import { loggedIn, orientation, operation, selectToggle } from './Atoms.js';

export function Controls() {	
	const [ shiftDown, setShiftDown ] = useState(false);
	const [ ctrlDown,  setCtrlDown ]  = useState(false);	
	const [ altDown,   setAltDown ]   = useState(false);	
	const [ metaDown,  setMetaDown ]  = useState(false);	
		

	const [ orientation_, setOrientation ] = useRecoilState(orientation);	
	const [ operation_, setOperation ] = useRecoilState(operation);
	
	//Could use a state variable and use only one we will do this later.. 
	const loggedIn_ = useRecoilValue(loggedIn);
	const [ showFloats, toggleFloats ] = useRecoilState(selectToggle('floats'));
	const [ showLogin, toggleLogin ] = useRecoilState(selectToggle('login-form'));
	const [ showMenu, toggleMenu ] = useRecoilState(selectToggle('menu'));
	const [ showClock, toggleClock ] = useRecoilState(selectToggle('clock'));
		
	const handleKeyDownEvent = async (key_event) => {
		if(key_event.type == "keydown") {
			switch(key_event.key) {
				case 'Shift':
					setShiftDown(true);
					break;
				case 'Control':
					setCtrlDown(true);
					break;
				case 'Alt':
					setAltDown(true);
					break;
				case 'Meta':
					setMetaDown(true);
					break;
					
				case 'ArrowUp':	
				case 'ArrowDown':
					(key_event.shiftKey === true && event.key == 'ArrowUp') ? setOperation('up') : (key_event.shiftKey === true && event.key == 'ArrowDown') ? setOperation('down') : '';				
				case 'ArrowLeft':
				case 'ArrowRight':
					(key_event.shiftKey === true && event.key == 'ArrowLeft') ? setOperation('left') : (key_event.shiftKey === true && event.key == 'ArrowRight') ? setOperation('right') : '';				
					break;
				
				
				
				case 'o': //for changing orientation
					console.log(key_event);
					(key_event.ctrlKey === true &&  key_event.metaKey === true &&  orientation_ === 'rotateY') ? setOrientation('rotateX') : (key_event.ctrlKey === true &&  key_event.metaKey === true &&  orientation_ === 'rotateX') ? setOrientation('rotateY') : '';
					break;
				
				default:
					break;
			}
		}	
	}
	
	const handleKeyUpEvent = async(key_event) => {
		if(key_event.type == "keyup") {
			switch(key_event.key) {
				case 'Shift':
					setShiftDown(false);
					setOperation('noop');
					break;
				case 'Control':
					setCtrlDown(false);
					break;
				case 'Alt':
					setAltDown(false);
					break;
				case 'Meta':
					setMetaDown(false);
					break;
				
				default:
					break;
			}
		}	
	}

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDownEvent);
		
		//cleanup
		return () => {
			window.removeEventListener("keydown", handleKeyDownEvent);
		}		
	},[handleKeyDownEvent]);	
	
	
	useEffect(() => {
		window.addEventListener("keyup", handleKeyUpEvent);
		
		//cleanup
		return () => {
			window.removeEventListener("keyup", handleKeyUpEvent);	
		}
	},[handleKeyUpEvent]);
	
	//adds
	useEffect(() => {
		console.log(loggedIn_);
	},[loggedIn_])	
		
		
	return(
		<StyleControls>
			<div id="controls-left">
				<svg className="hov" onClick={(e) => toggleFloats()} width="18" height="18" fill="transparent" stroke="rgba(150,107,104,1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
					<use href="/images/Svgs/feather-sprite.svg#feather"/>
				</svg>	
				<svg className="hov mr-5" onClick={(e) => toggleMenu()} width="18" height="18" fill="transparent" stroke="rgba(150,107,104,1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
					<use href="/images/Svgs/feather-sprite.svg#layout"/>
				</svg>					
				<div className={`control-key ${shiftDown ? 'on' : ''}`}>Shift</div>
				<div className={`control-key ${ctrlDown ? 'on' : ''}`}>Ctrl</div>
				<div className={`control-key ${altDown ? 'on' : ''}`}>Alt</div>
				<div className={`control-key ${metaDown ? 'on' : ''}`}>Meta</div>
			</div>
			<div id="controls-center">
			
			</div>
			<div id="controls-right">
				<Howler />
				<Websocket />
			
				{ loggedIn_ ?
					<svg className="hov mr-5" onClick={(e) => toggleLogin()} width="18" height="18" fill="transparent" stroke="rgba(150,107,104,1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<use href="/images/Svgs/feather-sprite.svg#log-out"/>
					</svg>	
				:	
					<svg className="hov mr-5" onClick={(e) => toggleLogin()} width="18" height="18" fill="transparent" stroke="rgba(150,107,104,1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<use href="/images/Svgs/feather-sprite.svg#log-in"/>
					</svg>					
				}
				{ ['up','down','left','right'].includes(operation_) &&
					<img className={`cr-chevron ${operation_}`} src="/images/Svgs/Chevron.svg" />
				}
				<svg className="hov mr-5" width="18" height="18" fill="transparent" stroke="rgba(150,107,104,1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
					<use href="/images/Svgs/feather-sprite.svg#clock"/>
				</svg>					
			</div>
		</StyleControls>	
	)
}