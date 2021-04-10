import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRecoilState, useRecoilValue } from 'recoil';

const StyleControls = styled.div`
	position: absolute;
	
	top: -.6rem;
	left: -.6rem;
	
	width: 100vw;
	height: 2rem;

	background: #2c3e50;
`;

//#27ae60

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
				case 'ArrowLeft':
				case 'ArrowRight':
				case 'ArrowDown':
				case 'ArrowUp':
					if(key_event.shiftKey === true && event.key == 'ArrowLeft')  {	console.log('Rotate Left');  setOperation('left');  }
					if(key_event.shiftKey === true && event.key == 'ArrowRight') {  console.log('Rotate Right'); setOperation('right');   }					
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
			
		</StyleControls>	
	)
}