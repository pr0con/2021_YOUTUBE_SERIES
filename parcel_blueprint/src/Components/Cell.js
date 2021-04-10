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
`;

import { transforms } from './Atoms.js';

export function Cell({index}) {
	let transforms_ = useRecoilValue(transforms);
	
	return(
		<StyledCell t={transforms_[index]}>
			{index}
		</StyledCell>
	)
}