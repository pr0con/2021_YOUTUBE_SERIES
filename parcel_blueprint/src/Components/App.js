import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

const StyledApp = styled.div`
	position: relative;
	
	top: 0px;
	left: 0px;
	
	width: 100vw;
	height: 100vh;	
`;

export function App() {
	return(
		<StyledApp>
			Our App
		</StyledApp>
	)
}

if (document.getElementById('react_root')) {
	ReactDOM.render(<App />, document.getElementById('react_root'));
}