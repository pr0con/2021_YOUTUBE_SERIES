import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const StyledMaterialInput = styled.div`
	position: relative;
	
	.material-input-label {
		position: absolute;
		font-size: 1.2rem;
		margin-top: 1rem;	
		
		transition: margin-top 250ms, font-size 250ms;
	}

	.material-input-input {
		position: relative;
		background: transparent;
		font-size: 1.2rem;
		border: 0px;
		padding-top: 1rem;	
	}
	
	.material-input-border-bottom {
		position: absolute;
		bottom: 0px;
		left: 50%;
		
		transform: translateX(-50%);
		
		width: 0%;
		border-bottom: 1px solid #000;
		
		transition: width 250ms;
	}
	
	&.true {
		.material-input-label {
			margin-top: 0rem;
			font-size: .8rem;	
		}
		.material-input-border-bottom {
			width: 100%;	
		}	
	}
	
	border-bottom: 1px solid rgba(0,0,0,.2);
`;


export function MaterialInput({type, label, k = "", v, onChange, classes, onKeyUp = () => {} }) {
	const [ focused, setFocused ] = useState(false);
	
	return(
		<StyledMaterialInput className={`material-input ${focused ? 'true' : 'false'} ${classes} ${v.length > 0 ? 'true' : 'false'}`}>
			<div className="material-input-label">{label}</div>
			<input type={type} className="material-input-input" onFocus={(e) => setFocused(true)} onBlur={(e) => setFocused(false)} value={v} onChange={(e) => { (k === "") ? onChange(e.target.value) : onChange(k, e.target.value) }} onKeyUp={(e) => onKeyUp(e)} />
							
			<div className="material-input-border-bottom"></div>
		</StyledMaterialInput>
	)
}
