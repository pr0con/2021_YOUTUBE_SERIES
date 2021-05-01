import React, { Suspense } from 'react';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';

const StyledFloats = styled.div`
	position: absolute;
	
	max-with: 100%;
	display: none;
	
	left: .5rem;
	bottom: .5rem;
	
	&.true {
		display: flex;	
	}
`;

import {Profile} from './Profile.js';
import {Pallete} from './Pallete.js';
import {TaskList} from './TaskList.js';
import { selectToggle } from './Atoms.js';

export function Floats() {
	const showFloats = useRecoilValue(selectToggle('floats'));
	
	return(
		<StyledFloats className={showFloats ? 'true' : 'false'}>
			<Profile classes="mr-5"/>
			<Pallete classes="mr-5"/>
			<TaskList />
		</StyledFloats>	
	)
}