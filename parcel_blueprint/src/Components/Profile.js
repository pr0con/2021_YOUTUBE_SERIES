import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import Webcam from 'react-webcam';
import { useRecoilState, useRecoilValue } from 'recoil';

import { AppContext } from './AppProvider.js';
const StyledProfile = styled.div`
	position: absolute;
	
	top: 50%;
	left: 50%;
	
	transform: translate(-50%, -50%);
	
	display: none;
	&.on {
		display: flex;
		flex-direction: column;	
	}
	
	
	#profile-image-wrapper {
		position: relative;
		width: 24rem;
		height: 24rem;
		
		display: flex;
		align-items: center;
		justify-content: center;
		
		video {
			position: relative;
			max-width: 100%;	
		}
		
		img {
			position: relative;
			width: 100%;
			height: 100%;
			max-height: 18rem;
			object-fit: cover;	
		}
	}
	#profile-image-form { opacity: 0; max-height: 0px; overlfow: hidden; }
`;

import { profile, webcam, imgSrc, imgSrcSrc } from './Atoms.js';

export function Profile() {
	const profile_ = useRecoilValue(profile);
	const webcam_  = useRecoilValue(webcam);
	const [ imgSrc_, setImgSrc ] = useRecoilState(imgSrc);
	const [ imgSrcSrc_, setImgSrcSrc ] = useRecoilState(imgSrc); //img src from -> webcam or upload?
	
	const { iiRef, wcRef, piRef } = useContext(AppContext);
	
	const handleImage = (files) => {
		let reader = new FileReader();
		let file = files.target.files[0];
		
		if(file) {
			if(!file.type.match("image.*")) {
				console.log('Upload a valid image');
				setImgSrc('/images/profile-image-placeholder.webp');
			} else if(file.size > 100000000) { //if > 1mb
				console.log('File to large');
				setImgSrc('/images/profile-image-placeholder.webp');
			}else {
				reader.onloadend = () => {
					setImgSrc(reader.result);
				}
				reader.readAsDataURL(file);
				
				setImgSrcSrc('upload');
			}
		}
	}
	
	return(
		<StyledProfile className={`${profile_ ? 'on' : 'off'}`}>
			<div id="profile-image-wrapper">
				{ webcam_ ? 
					<Webcam style={{ margin: 2}} audio={false} ref={wcRef} videoConstraints={{ facingMode: "user"}} screenshotFormat="image/jpeg"/>
				:	
					<img src={imgSrc_} />
				}
			</div>
			<form id="profile-image-form" encType="multipart/form-data" ref={piRef}>
				<input id="profile-image-input" name="file" accept="image/*" type="file" ref={iiRef} onChange={(e) => handleImage(e)} />
			</form>
			<input type="text" placeholder="Username" />
			<input type="password" placeholder="Password" />
			<input type="password" placeholder="Confirm Password" />
			
			<div id="profile-actions">	
			</div>
		</StyledProfile>	
	)
}
