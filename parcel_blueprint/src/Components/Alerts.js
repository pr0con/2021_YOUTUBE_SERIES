import React, { useRef, useState, useEffect, useContext } from 'react';
import styled from 'styled-components';

import {AppContext} from './AppProvider.js';
const StyledAlerts = styled.div`
	position: absolute;
	top: 3rem;
	right: .5rem;
	width: 30rem;
	
	display: flex;
	flex-direction: column;
	
	.alert-message {
		position: relative;
		display: flex;
		align-items: center;
		border-radius: 4px;
		padding: .8rem;
		transition: box-shadow 300ms cubic bezier(0.4, 0, 0.2, 1) 0ms;
		margin-top: .5rem;
		
		svg.alert-type-icon { margin-right: 1rem; }
		&.alert-error {
			color: rgb(250, 179, 174);
			background-color: rgb(24, 6, 5);
		}
		&.alert-warning {
			color: rgb(255, 213, 153);
			background-color: rgb(25, 15, 0);
		}
		&.alert-info {
			color: rgb(166, 213, 250);
			background-color: rgb(3, 14, 24);
		}
		&.alert-success {
			color: rgb(183, 223, 185);
			background-color: rgb(7, 17, 7);
		}	
		
		svg.kill-alert-message {
			position: absolute;
			top: .2rem;
			right: .2rem;
			&:hover { cursor: pointer; }
		}	
	}
`;

export function Alerts() {
	const { systemAlerts, killAlert } = useContext(AppContext);
	
	useEffect(() => {
		console.log(systemAlerts);
	},[systemAlerts]);
	
	return(
		<StyledAlerts>
			{ (systemAlerts && systemAlerts.length > 0) && systemAlerts.map((sa,i) => (
				<div key={`alert-${i}`} className={`alert-message ${sa.type}`}>
					{ sa.type === "alert-error" ?
						<svg className="alert-type-icon" focusable="false" viewBox="0 0 24 24" width="24px" height="24px" fill="#f44336"><path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path></svg>			
					: sa.type === "alert-warning" ?
						<svg className="alert-type-icon" focusable="false" viewBox="0 0 24 24" width="24px" height="24px" fill="#ff9800"><path d="M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z"></path></svg>					
					: sa.type === "alert-info" ?
						<svg className="alert-type-icon" focusable="false" viewBox="0 0 24 24" width="24px" height="24px" fill="2196f3"><path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20, 12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10, 10 0 0,0 12,2M11,17H13V11H11V17Z"></path></svg>					
					: sa.type === "alert-success" ?
						<svg className="alert-type-icon" focusable="false" viewBox="0 0 24 24" width="24px" height="24px" fill="#4caf50"><path d="M20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4C12.76,4 13.5,4.11 14.2, 4.31L15.77,2.74C14.61,2.26 13.34,2 12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0, 0 22,12M7.91,10.08L6.5,11.5L11,16L21,6L19.59,4.58L11,13.17L7.91,10.08Z"></path></svg>						
					:
						<></>
					}
					<span>{sa.message ? sa.message : sa.data ? sa.data : 'Something went horribly wrong.' }</span>
					<svg className="kill-alert-message" 
						onClick={(e) => killAlert(sa.alertId)} 
						width="18"
						height="18" 
						fill="transparent" 
						stroke="rgba(150,107,104,1)" 
						strokeWidth="2"
						strokeLinejoin="round"
					>
					  <use href="/images/Svgs/feather-sprite.svg#x"/>
					</svg>
				</div>
			))}
		</StyledAlerts>
	)
}