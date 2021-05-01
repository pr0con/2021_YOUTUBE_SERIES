import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { atom, selector, useRecoilValue, useRecoilState } from 'recoil';

const StyledWebsocket = styled.div`

`;


export function Websocket() { 
	const [ stroke, setStroke ] = useState("rgba(150, 107, 104, 1)");
	
	
	return(
		<StyledWebsocket>
			<svg className="mr-5" width="18" height="18" fill="transparent" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> 
				<use href="/images/Svgs/feather-sprite.svg#activity"/> 
			</svg>			
		</StyledWebsocket>
	)
}