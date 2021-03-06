import React, { useState, useEffect, Suspense } from 'react';
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
	}
`;


import { Menu } from './Menu.js';
import { Controls } from './Controls.js';
import { Windows } from './Windows.js';
import { Login } from './Login.js';
import { Alerts } from './Alerts.js';
import { Floats } from './Floats.js';

export function App() {
	return(
		<RecoilRoot>
			<AppProvider>
				<AppContext.Consumer>
					{({ something }) => (
						<StyledApp>
							<GS />
							<div id="viewport">
								<Windows />
								
								<Suspense fallback={<></>}>
									<Controls />
									<Menu />
									<Login />
									<Floats />
								</Suspense>
								
								<Alerts />
							</div>
						</StyledApp>	
					)}
				</AppContext.Consumer>
			</AppProvider>
		</RecoilRoot>
	)
}

if (document.getElementById('react_root')) {
	ReactDOM.render(<App />, document.getElementById('react_root'));
}