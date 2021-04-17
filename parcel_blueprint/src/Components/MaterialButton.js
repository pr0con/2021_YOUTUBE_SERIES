import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const StyledMaterialButton = styled.div`
	position: relative;
	
	span.ripple {
		position: absolute;
		
		border-radius: 50%;
		transform: scale(0);
		
		animation: ripple 600ms linear;
		background-color: rgba(0, 0, 0, 1);
	}
	
	@keyframes ripple {
		to {
			transform: scale(4);
			opacity: 0;
		}	
	}
	
	overflow: hidden;
	&:hover { cursor: pointer; }
`;


export function MaterialButton(props) {
	
	const createRipple = (e) => {
		const button = e.currentTarget;
		
		
		const circle = button.querySelector(".ripple");
		const diameter = Math.max(button.clientWidth, button.clientHeight);
		const radius = diameter / 2;
		
		
		var rect = e.target.getBoundingClientRect();
		var x = e.clientX - rect.left; //x position within the element.
		var y = e.clientY - rect.top;  //y position within the element.
		
		circle.style.width = circle.style.height = `${diameter}px`;
		circle.style.left = `${x - radius}px`;
		circle.style.top = `${y - radius}px`;
		circle.classList.add("ripple");
		
		const ripple = button.getElementsByClassName("ripple")[0];
		
		if (ripple) {
			ripple.remove();
		}
		
		button.appendChild(circle);
	}
	
	return(
		<StyledMaterialButton className={`${props.classes}`} onClick={(e) => { createRipple(e); props.onClick(e);} }>
			{props.children}
			<span className="ripple"></span>
		</StyledMaterialButton>
	)
}
