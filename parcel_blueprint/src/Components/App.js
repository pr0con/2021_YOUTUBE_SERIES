import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { RecoilRoot } from 'recoil'; //Global State System

//Native React Context System (Global State System)
import AppProvider from './AppProvider.js';
import { AppContext } from './AppProvider.js';

import { GS } from './GS.js';
const StyledApp = styled.div`
	position: relative;
	
	top: 0px;
	left: 0px;
	
	width: 100vw;
	height: 100vh;
	
	overflow: hidden;	
	padding: .5rem;

	#viewport {
		position: relative;
		
		top: 0px;
		left: 0px;
		
		width: 100%;
		height: 100%;
		
		border: 1px solid #ccc;
		boder-radius: .2rem;
		
		perspective: 1000px;
		
		#floating-panels {
			position: absolute;
			
			max-width: 100%;
			display: flex;
			
			left: .5rem;
			bottom: .5rem;	
		}	
	}
`;


import { Controls } from './Controls.js';
import { Windows } from './Windows.js';
import { Profile } from './Profile.js';

export function App() {
	return(
		<AppProvider>
			<AppContext.Consumer>
				{({ something }) => (
					<RecoilRoot>
						<StyledApp>
							<GS />
							<div id="viewport">
								<Windows />
								<Controls />
								
								<div id="floating-panels">
									<Profile classes="mr-5"/>
								</div>
							</div>
						</StyledApp>
					</RecoilRoot>
				)}
			</AppContext.Consumer>
		</AppProvider>
	)
}

if (document.getElementById('react_root')) {
	ReactDOM.render(<App />, document.getElementById('react_root'));
}