import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { atom, selector, useRecoilValue, useRecoilState } from 'recoil';

const StyledWebsocket = styled.div`
	
`;

import { loggedIn } from './Atoms.js';


const rs = atom({key: 'rs', default: 0 }); //ready-state
const ws = atom({key: 'ws', default: false });
const wsId = atom({key: 'ws-id', default: ''});

const connect = selector({
	key: 'conn',
	get: ({get}) => {
		return get(loggedIn);
	},
	set: ({get,set}, op) => {
		switch(op) {
			case "ws-on":
				set(ws, new WebSocket('wss://var.pr0con.com:1200/ws'));
				break;
			case "ws-off":
				set(ws, false);
				break;
			default:
				break;
		}
	}
})

const worker = selector({
	key: 'worker',
	get: ({get}) => {
		return get(ws);
	},
	set: ({get,set}, op) => {
		switch(op) {
			//do stuff later....
			default:
				break;
		}
	}
})


export function Websocket() { 
	const [ stroke, setStroke ] = useState("rgba(150, 107, 104, 1)");
	const [ connect_, setConnect ] = useRecoilState(connect)
	const [ worker_, setWorker ] = useRecoilState(worker);
		
	useEffect(() => {
		if (connect_ === false) setStroke("rgba(150,107,104,1)");
		if (connect_ === true ) setStroke("rgba(253,152,60,1");
		
		if(connect_) {
			setConnect('ws-on');
		}else if(!connect_) {
			setConnect('ws-off');
		}
	},[connect_]);	
		
	//listen for actual websocket connect object	
	useEffect(() => {
		if(worker_ !== false && worker_.readyState === 0) { //basically act on ready-state
			(async() => {
				worker_.onopen = (open_event) => {
					setStroke("rgba(183,223,185,1)");
					worker_.onmessage = (msg_event) => {
						console.log(msg_event);
					}
					worker.onclose = (close_event) => {
						
					}
					worker.onerror = (error_event) => {
						
					}
				}
			})()	
		}
	},[worker_])	
		
	return(
		<StyledWebsocket>
			<svg className="mr-5" width="18" height="18" fill="transparent" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> 
				<use href="/images/Svgs/feather-sprite.svg#activity"/> 
			</svg>			
		</StyledWebsocket>
	)
}