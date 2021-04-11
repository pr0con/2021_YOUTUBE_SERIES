import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRecoilState, useRecoilValue } from 'recoil';

const StyleControls = styled.div`
	position: absolute;
	
	top: 0px;
	left: 0px;
	
	width: 100%;
	height: 2rem;

	background: #2c3e50;
	
	display: flex;
	align-items: center;
	padding-left: .5rem;
	
	.control-key {
		text-transform: uppercase;
		
		&.on {
			color: #27ae60;	
		}
	}
	
`;

import { operation } from './Atoms.js';

export function Controls() {
	const [ shiftDown, setShiftDown ] = useState(false);	
	const [ operation_, setOperation ] = useRecoilState(operation);
	
	const handleKeyDownEvent = async(key_event) => {
		if(key_event.type == "keydown") {
			switch(key_event.key) {
				case 'Shift':
					setShiftDown(true);
					break;	
				case 'ArrowUp':	
				case 'ArrowDown':
					(key_event.shiftKey === true && event.key == 'ArrowUp') ? setOperation('up') : (key_event.shiftKey === true && event.key == 'ArrowDown') ? setOperation('down') : '';				
				case 'ArrowLeft':
				case 'ArrowRight':
					(key_event.shiftKey === true && event.key == 'ArrowLeft') ? setOperation('left') : (key_event.shiftKey === true && event.key == 'ArrowRight') ? setOperation('right') : '';				
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
			<div className={`control-key ${shiftDown ? 'on' : ''}`}>Shift</div>
		</StyleControls>	
	)
}