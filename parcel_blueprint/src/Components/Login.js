import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { atom, useRecoilState, useRecoilValue } from 'recoil';


import { AppContext } from './AppProvider.js';
const StyledLogin = styled.div`
	position: absolute;
	
	top: 50%;
	left: 50%;
	
	transform: translate(-50%,-50%);
	
	width: 30rem;
	height: auto;
	
	border-radius: .4rem;
	background: rgba(12,6,8,.6);
	
	padding: .5rem;	
	
	display:flex;
	flex-direction: column;
	
	.init-message { color: rgba(150, 107, 104, 1); }
	
	#login-form,
	#access-granted-form {
		#lf-actions,
		#agf-actions {
			padding-top: .5rem;
			display: flex;
			flex-direction: row-reverse;
		}
	}
	
	input { min-width: 100%; }
`;

import { MaterialInput } from './MaterialInput.js';
import { MaterialButton } from './MaterialButton.js';
import { loggedIn, initializing, accessToken } from './Atoms.js';

export function Login() {
	const [ username, setUsername ] = useState('');
	const [ password, setPassword ] = useState('');
	const [ initializing_, setInitializing ] = useRecoilState(initializing);
	const [ accessToken_, setAccessToken ] = useRecoilState(accessToken);
	
	const { handleFetchErr, pushAlert } = useContext(AppContext);
	
	useEffect(() => {
		if(initializing_) {
			async function fetchRefresh() {
				let response = await(await fetch(`https://var.pr0con.com:1300/api/auth/refresh`, {
					method: 'GET',
					credentials: 'include'
				}).catch(handleFetchErr)).json();
				
				console.log(response);
				
				if('type' in response && response.type === "access-token") pushAlert(response), setAccessToken(response.access_token);
				if('code' in response && 'message' in response) pushAlert(response); //Most likely a network error
				if('success' in response && response.success === false) (response.type = 'alert-error'), pushAlert(response);				
				
				
				setInitializing(false);
			}
			fetchRefresh()
		}
	},[initializing_]);
	
	
	const Logout = async () => {
		setAccessToken(false);
	}
	
	const Login = async () => {
		if(![username,password].includes('')) {
			let response = await ( await fetch('https://var.pr0con.com:1300/api/auth/login', {
				method: 'POST',
				credentials: 'include',
				headers: {"Content-Type": "application/json;charset=UTF-8"},
				body: JSON.stringify({username,password})
				
			}).catch(handleFetchErr)).json();
			
			console.log(response);
			
			if('type' in response && response.type === "access-token") pushAlert(response), setAccessToken(response.access_token);
			if('code' in response && 'message' in response) pushAlert(response); //Most likely network Error
			if('success' in response && response.success === true) pushAlert(response);
			setInitializing(false);
		}
	}
	
	return(
		<StyledLogin>	
				{ (initializing_ === true && accessToken_ === false) ?
					<span className="init-message">Refreshing credentials...</span>	
				: (initializing_ === false && accessToken_ === false) ?
					<div id="login-form">
						<span className="init-message">Please login...</span>
						<MaterialInput type="text" label="Alias || Email"  v={username} onChange={(v) => setUsername(v)} classes="login-form-input" />
						<MaterialInput type="password" label="Password" v={password} onChange={(v) => setPassword(v)} classes="login-form-input" />			
						<div id="lf-actions">
							<MaterialButton classes="generic-form-btn" onClick={(e) => Login()}><span>Log In</span> </MaterialButton>
						</div>
					</div>
				: 
					<div id="access-granted-form">
						<span className="init-message">Access Granted</span>
						<div id="agf-actions">
							<MaterialButton classes="generic-form-btn" onClick={(e) => Logout()}><span>Log Out</span></MaterialButton>
						</div>
					</div>
				}
		</StyledLogin>		
	)
}