import React, { useRef, useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { useRecoilState, useRecoilValue } from 'recoil';

const StyledWrapper = styled.div`
	position: relative;
	
	
	min-width: 30rem;
	
	border: 2px solid #000;
	background: rgba(0,0,0,0.6);
`;

export function Wrapper({children, wrapperId}) {	
	return(
		<StyledWrapper key={wrapperId} id={wrapperId}>
			{children}
		</StyledWrapper>
	)
}