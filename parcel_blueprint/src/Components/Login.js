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

export function Login() {
	const [ username, setUsername ] = useState('');
	const [ password, setPassword ] = useState('');
	
	const { handleFetchErr } = useContext(AppContext);
	
	const Login = async () => {
		if(![username,password].includes('')) {
			let response = await ( await fetch('https://var.pr0con.com:1300/api/auth/login', {
				method: 'POST',
				credentials: 'include',
				headers: {"Content-Type": "application/json;charset=UTF-8"},
				body: JSON.stringify({username,password})
				
			}).catch(handleFetchErr)).json();
		}
	}
	
	return(
		<StyledLogin>
			<div id="login-form">
				<span className="init-message">Please login...</span>
					<MaterialInput type="text" label="Alias || Email"  v={username} onChange={(v) => setUsername(v)} classes="login-form-input" />
					<MaterialInput type="password" label="Password" v={password} onChange={(v) => setPassword(v)} classes="login-form-input" />
					
				<div id="lf-actions">
					<MaterialButton classes="generic-form-btn" onClick={(e) => Login()}><span>Log In</span> </MaterialButton>
				</div>
			</div>
			<div id="access-granted-form">
				<div id="agf-actions">
				
				</div>
			</div>
		</StyledLogin>		
	)
}