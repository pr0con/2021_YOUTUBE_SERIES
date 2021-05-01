import React, { useRef, useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { useRecoilValue, useRecoilState } from 'recoil';

const StyledMenu = styled.div`
	background: rgba(12, 6, 8, 1);
	border: 8px solid rgba(12, 6, 8, 1);
	box-shadow: 0 3px 3px rgba(0, 0, 0, 0.2);
	float: left;
	position: absolute;
	margin: 0;
	top: 3.2rem;
	width: 200px;
	z-index: 99999;	
		
	
	&:after {
		content:"";
		position: absolute;
		left: 4px;
		top: -22px;
		width: 0;
		height: 0;
		border-style: solid;
		border-width: 0 17px 17px 17px;
		border-color: transparent transparent rgba(12, 6, 8, 1) transparent;
		z-index:9998;		
	}
	
	&.false {
		display: none;	
	}	
`;

import { selectToggle } from './Atoms.js';
//import { loadComponents } from './Atoms2.js';

export function Menu() {
	const menu = useRecoilValue(selectToggle('menu'));
	//const [ components_, setComponents ] = useRecoilState(loadComponents('@menu.js'));//@menu.js actually is nothing
	//onClick={(e) => setComponents('file-browser')} 
	
	return(
		<StyledMenu className={menu ? 'true' : 'false'}>
			<svg className="ml-20 mr-5 hov" width="18" height="18" fill="transparent" stroke="rgba(150, 107, 104, 1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" > 
				<use href="/images/Svgs/feather-sprite.svg#folder"/> 
			</svg>	
		</StyledMenu>	
	)
}


