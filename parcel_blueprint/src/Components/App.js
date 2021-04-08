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
`;

export function App() {
	return(
		<AppProvider>
			<AppContext.Consumer>
				{({ something }) => (
					<RecoilRoot>
						<StyledApp>
							<GS />
							<div className="from-global-styles">{something}</div>
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