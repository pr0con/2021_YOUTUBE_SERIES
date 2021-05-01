//https://github.com/goldfire/howler.js/
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Howl, Howler as TheHolwer } from 'howler';

const StyledHowler = styled.div`
	
`;

export function Howler() {
	const [ stroke, setStroke ] = useState("rgba(150, 107, 104, 1)");
	
	return(
		<StyledHowler>
			<svg className="hov mr-5" width="18" height="18" fill="transparent" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> 
				<use href="/images/Svgs/feather-sprite.svg#headphones"/> 
			</svg>		
		</StyledHowler>	
	)
}
