import React, { useState, useEffect, useContext } from 'react';
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

	background: #2c3e50;
	
	display: flex;	
	align-items: center;
	padding: 0 .5rem 0 .5rem; 
	
	#controls-left {
		display: flex;
		
		.control-key {
			text-transform: uppercase;
			margin-right: .5rem;
			
			&.on {
				color: #27ae60;	
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

import { orientation, operation, profile, webcam, imgSrc, imgSrcSrc } from './Atoms.js';

export function Controls() {	
	const [ shiftDown, setShiftDown ] = useState(false);
	const [ ctrlDown,  setCtrlDown ]  = useState(false);	
	const [ altDown,   setAltDown ]   = useState(false);	
	const [ metaDown,  setMetaDown ]  = useState(false);	
		

	const [ orientation_, setOrientation ] = useRecoilState(orientation);	
	const [ operation_, setOperation ] = useRecoilState(operation);
		
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
	
		
	return(
		<StyleControls>
			<div id="controls-left">
				<div className={`control-key ${shiftDown ? 'on' : ''}`}>Shift</div>
				<div className={`control-key ${ctrlDown ? 'on' : ''}`}>Ctrl</div>
				<div className={`control-key ${altDown ? 'on' : ''}`}>Alt</div>
				<div className={`control-key ${metaDown ? 'on' : ''}`}>Meta</div>
			</div>
			<div id="controls-center">
			
			</div>
			<div id="controls-right">
				{ ['up','down','left','right'].includes(operation_) &&
					<img className={`cr-chevron ${operation_}`} src="/images/Svgs/Chevron.svg" />
				}
			</div>
		</StyleControls>	
	)
}