import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRecoilState, useRecoilValue } from 'recoil';

const StyledCell = styled.div`
	position: absolute;
	
	width: 100%;
	height: 100%;
	
	background: rgba(0,0,0,.5);
	transform: ${(props) => props.t};
	border-radius: .2rem;
	
	display: flex;
	flex-direction: row-reverse;
	
	padding-top: 2rem;
`;

import { transforms } from './Atoms.js';
import { loadComponents } from './Atoms2.js';

export function Cell({index}) {
	let transforms_ = useRecoilValue(transforms);
	const windowComs = useRecoilValue(loadComponents(index+1));
	
	useEffect(() => {
		console.log(windowComs)
	},[windowComs]);
	
	return(
		<StyledCell t={transforms_[index]}>
			{ windowComs.length > 0 && windowComs.map((wco, i) => (
				wco.wrapper 
			))}
		</StyledCell>
	)
}