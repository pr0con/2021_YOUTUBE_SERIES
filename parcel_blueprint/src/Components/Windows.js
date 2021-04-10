import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRecoilState, useRecoilValue } from 'recoil';

const StyledWindows = styled.div`
	position: relative;
	
	top: 0px;
	left: 0px;
	
	width: 100%;
	height: 100%;
	
	transform-style: preserve-3d;
	transition: transform 1s;
	

	transform: translateZ(${(props) => props.perspective}px) ${(props) => props.orientation}(${(props) => props.rotation}deg);
`;

import { Cell } from './Cell.js';
import { windows, orientation, transforms, zoom, angle, perspective, rotation } from './Atoms.js';

export function Windows() {
	const zoom_ = useRecoilValue(zoom);
	const windows_ = useRecoilValue(windows);
	const[ transforms_, setTransforms ] = useRecoilState(transforms);
	
	const rotation_ = useRecoilValue(rotation);
	const [ perspective_, setPerspective ] = useRecoilState(perspective);
	const orientation_ = useRecoilValue(orientation);
		
	useEffect(() => {
		let new_transforms = [];
		
		let theta = 360 / windows_;
		let cellSize = (orientation_ === 'rotateY') ? window.innerWidth - 10 : window.innerHeight - 10;
		
		let radius = Math.round( (cellSize / 2) / Math.tan( Math.PI / windows_) );
		
		for (let i=0; i < windows_; i++) {
			let cellAngle = theta * i;
			let transform = `${orientation_}(${cellAngle}deg) translateZ(${radius}px)`;
			new_transforms.push(transform);
		}
		
		setPerspective(-(radius+zoom_)); //positive zoom goes back, negative zoom goes forward
		setTransforms([...new_transforms]);
	},[windows_]);	
		
	useEffect(() => {
		console.log(transforms_);
	},[transforms_]);
		
	return(
		<StyledWindows perspective={perspective_} orientation={orientation_} rotation={rotation_}>
			{ transforms_.length > 0 && transforms_.map( (t,i) => (
				<Cell key={`cell-${i}`} index={i} />
			))}
		</StyledWindows>
	)
}
