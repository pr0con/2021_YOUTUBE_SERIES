import React, { useRef, useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { atom, useRecoilState, useRecoilValue  } from 'recoil';
import { nanoid } from 'nanoid';

const StyledFileSystem = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	padding: .2rem;
	
	.fs-heading {	
	
	}
	.file-browser-root-path {
		color: #5dd973;
		text-align: right;
		font-weight: 600;
		
		.current-path {
			position: relative;
			display: flex;
			align-items: center;
			justify-content: space-between;
			
			svg { &:hover { cursor: pointer; }}
		}
		
		
		.fs-directory-info {
			position: relative;
			color: #27ae60;
			text-align: left;
			font-weight: 500;
			
			&>div {
				position: relative;
				display: flex;
				justify-content: space-between;	
			}	
		}
	}
	
	.file-browser-directory,
	.file-browser-file {
		position: relative;
		display: flex;
		align-items: center;
		color: #5dd973;
		&:hover {
			cursor: pointer;
			background: rgba(53,84,56,.3);	
		}
	}
	.file-browser-directory {
		font-weight: 600;	
	}
	.file-browser-file { color: #27ae60; }		
`;

import { getWssData, worker } from './Websocket.js';
export function FileSystem() {
	const [ cid, setCid ] = useState(nanoid());
	const [ ws, request ] = useRecoilState(worker);
	const [ msgs, setMsgs ] = useRecoilState(getWssData(cid));
		
	const [ initPath, setInitPath ] = useState('');
	const [ currentPath, setCurrentPath ] = useState('');
	const [ directories, setDirectories ] = useState([]);
	const [ files, setFiles ] = useState([]);
	const [ infoTabs, setInfoTabs ] = useState({});
		
		
	//make initial request for working directory...
	useEffect(() => {  if(ws) {  request({ owner: cid, type: 'get-working-directory', data: 'noop'}); }},[ws]);	
	
	useEffect(() => {
		if(msgs.length > 0) {
			[].forEach.call(msgs, function(msg) {
				switch(msg.type) {
					case "fs-directory":
						let ds = JSON.parse(msg.data);
						setCurrentPath(ds.path)
						
						if(initPath === "") setInitPath(ds.path)
						
						//gets the root path info
						setInfoTabs((its) => ({...its, [ds.path]: {size: ds.info.size, mode: ds.info.mode, mod_time: ds.info.mod_time }} ))
						
						let d = ds.children.filter(fsc => fsc.info.is_dir === true);  //get all child directories
						let f = ds.children.filter(fsc => fsc.info.is_dir === false); //get all child files
						
						setDirectories(d);
						setFiles(f);
						
						
						[].forEach.call(d, function(d_) {
							setInfoTabs((its) => ({ ...its, [d_.path]: {size: d_.info.size, mode: d_.info.mode, mod_time: d_.info.mod_time}} ))
						});

						[].forEach.call(f, function(f_) {
							setInfoTabs((its) => ({ ...its, [f_.path]: {size: f_.info.size, mode: f_.info.mode, mod_time: f_.info.mod_time}} ))
						});
					
						let purged_msgs = msgs.filter(msg => msg.owner !== cid);
						setMsgs(purged_msgs);
						break;
							
					default:
						break;			
				}
			});
		}	
	},[msgs]);
	
	useEffect(() => {
		console.log(infoTabs);
	},[infoTabs]);
	
	
	const [ hovering, setHovering ] = useState('');	
	const [ hoverInfoDisplay, setHoverInfoDisplay ] = useState({
		size: '',
		mode: '',
		mode_time: '',	
	})	
	return(
		<StyledFileSystem>
			{ infoTabs[currentPath] &&
				<div className="file-browser-root-path fs-heading">
					<div className="current-path">
						{ (currentPath !== initPath && !([currentPath, initPath].includes(''))) ?
							<svg className="mr-5" width="18" height="18" fill="transparent" stroke={`#27ae60`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" onClick={(e) => request({owner: cid, type: 'get-working-directory', data: 'noop'})}> 
								<use href="/images/Svgs/feather-sprite.svg#arrow-left"/>
							</svg>
						: 
							<></>		
						}					
						<span>{ currentPath }</span>
					</div>
					<div className="fs-directory-info">
						{ hovering === '' ?
							<>
								<div className="fs-di-size"><span>size:</span><span>{infoTabs[currentPath]['size']}</span></div>
								<div className="fs-di-mode"><span>mode:</span><span>{infoTabs[currentPath]['mode']}</span></div>
								<div className="fs-di-mod_time"><span>mod_time:</span><span>{infoTabs[currentPath]['mod_time']}</span></div>
							</>
						: (hovering in infoTabs && hovering !== '') ?
							<>
								<div className="fs-di-size"><span>size:</span><span>{infoTabs[hovering]['size']}</span></div>
								<div className="fs-di-mode"><span>mode:</span><span>{infoTabs[hovering]['mode']}</span></div>
								<div className="fs-di-mod_time"><span>mod_time:</span><span>{infoTabs[hovering]['mod_time']}</span></div>
							</>						
						:
							''
						}
					</div>				
				</div>	
			}
			{ directories.length > 0 && directories.map((d,i) => (
				<div key={`dsd-${i}`} className="file-browser-directory" onMouseOver={(e) => setHovering(d.path)} onMouseOut={(e) => setHovering('')} onClick={(e) => request({owner: cid, type: 'get-child-directory', data: d.path})}>
					<svg className="mr-5" width="18" height="18" fill="transparent" stroke={`#27ae60`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> 
						<use href="/images/Svgs/feather-sprite.svg#folder"/> 
					</svg>				
					<span>{d.info.name}</span>
				</div>
			))}
			{ files.length > 0 && files.map((f,i) => (
				<div key={`dsf-${i}`} className="file-browser-file" onMouseOver={(e) => setHovering(f.path)} onMouseOut={(e) => setHovering('')}>
					<svg className="mr-5" width="18" height="18" fill="transparent" stroke={`#27ae60`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> 
						<use href="/images/Svgs/feather-sprite.svg#file"/> 
					</svg>	
					<span>{f.info.name}</span>				
				</div>
			))}
		</StyledFileSystem>
	)
}