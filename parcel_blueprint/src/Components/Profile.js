import React, { useRef, useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import Webcam from 'react-webcam';
import { atom, useRecoilState, useRecoilValue } from 'recoil';

import { AppContext } from './AppProvider.js';
const StyledProfile = styled.div`
	position: relative;
	
	width: 30rem;
	height: 40rem;
	
	border-radius: .4rem;
	background: rgba(12,6,8,.6);
	
	padding: .5rem;
	
	display: flex;
	flex-direction: column;
	
	#profile-image-wrapper {
		position: relative;
		width: 100%;
		min-height: 21.45rem;
		
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
			height: 21.45rem;
			max-height: 21.45rem;
			object-fit: cover;
		}
	}
	#profile-image-form { opacity: 0; max-height: 0px; overlfow: hidden; }
	
	#profile-data {}
	#profile-actions {
		position: relative;
		margin-top: .5rem;
			
		display: flex;
		flex-direction: row-reverse;
		
		.profile-data-btn {
			padding: 0 .3rem 0 .3rem;
			color: #734b4d;
			border: 1px solid #734b4d;
			border-radius: .2rem;	
		}
	}
`;

const imgSrc = atom({
	key: 'imgSrc',
	default: '/images/Svgs/Anonymous.svg'
});

const imgSrcSrc = atom({
		key: 'img-src-src',
		default: 'noop'
});

import { MaterialInput } from './MaterialInput.js';
import { MaterialButton } from './MaterialButton.js';



//https://thenounproject.com/term/hacker/
export function Profile({classes}) {
	const [ profileData, setProfileData ] = useState({
		username: '',
		email: '',
		password: '',
		confirm: ''	
	});

	const handleProfileInput = (k,v) => {
		setProfileData((pd) => ({...pd, [k]:v }))
	}

	const [ useWebcam, setUseWebcam ] = useState(false);

	const [ imgSrc_, setImgSrc ] = useRecoilState(imgSrc);
	const [ imgSrcSrc_, setImgSrcSrc ] = useRecoilState(imgSrcSrc); //img src from -> webcam or upload?
	
	const { iiRef, wcRef, piRef, DataURIToBlob } = useContext(AppContext);
	
	const takeSnapShot = () => {
		const imageSrc = wcRef.current.getScreenshot();
		console.log(imageSrc);
				
		setImgSrc(imageSrc);
		setUseWebcam(false);
		setImgSrcSrc('webcam');			
	}
	
	const handleImage = (files) => {
		let reader = new FileReader();
		let file = files.target.files[0];
		
		if(file) {
			if(!file.type.match("image.*")) {
				console.log('Upload a valid image');
				setImgSrc('/images/Svgs/Anonymous.svg');
			} else if(file.size > 100000000) { //if > 1mb
				console.log('File to large');
				setImgSrc('/images/Svgs/Anonymous.svg');
			}else {
				reader.onloadend = () => {
					setImgSrc(reader.result);
				}
				reader.readAsDataURL(file);
				
				setImgSrcSrc('upload');
			}
		}
	}
	
	const doUploadPhoto = () => {
		iiRef.current.click();
	}
	
	
	const clearProfile = () => {
		if(imgSrc_ !== "/images/Svgs/Anonymous.svg" || profileData.username !== '' || profileData.email !== '' || profileData.password != '' || profileData.confirm !== '' ) {
			setUseWebcam(false);
			setProfileData({
				username: '',
				email: '',
				password: '',
				confirm: '',
			});
			setImgSrc('/images/Svgs/Anonymous.svg');
		}
	}
	
	const submitProfile = async () => {
		let fd = new FormData(piRef.current);
		
		if (imgSrcSrc_ === 'webcam') {
			console.log(imgSrc_);
			fd.set('file', DataURIToBlob(imgSrc_), 'whatever_you_feel_like.jpg')	
		}
		
		//fd.delete('file'); as test.
		fd.set('alias', profileData.username);
		fd.set('email', profileData.email);
		fd.set('password', profileData.password);
		
		let response = await fetch('https://var.pr0con.com:1300/api/auth/register', {
			method: 'POST',
			body: fd,
			credentials: 'include',
		});
		
		let result = await response.json();
		console.log(result);		
	}
	
	return(
		<StyledProfile className={`${classes}`}>
			<div id="profile-image-wrapper">
				{ useWebcam ? 
					<Webcam style={{ margin: 2}} audio={false} ref={wcRef} videoConstraints={{ facingMode: "user"}} screenshotFormat="image/jpeg"/>
				:	
					<img src={imgSrc_} />
				}
			</div>
			<form id="profile-image-form" encType="multipart/form-data" ref={piRef}>
				<input id="profile-image-input" name="file" accept="image/*" type="file" ref={iiRef} onChange={(e) => handleImage(e)} />
			</form>

			<div id="profile-data">
				<MaterialInput type="text" label="Username" k="username" v={profileData.username} onChange={(k,v) => handleProfileInput(k,v)} classes="profile-input" />
				<MaterialInput type="email" label="Email" k="email" v={profileData.email} onChange={(k,v) => handleProfileInput(k,v)} classes="profile-input" />
				<MaterialInput type="password" label="Password" k="password" v={profileData.password} onChange={(k,v) => handleProfileInput(k,v)} classes="profile-input" />
				<MaterialInput type="password" label="Confirm" k="confirm" v={profileData.confirm} onChange={(k,v) => handleProfileInput(k,v)} classes="profile-input" />
			</div>
			
			<div id="profile-actions">
				{ imgSrc_ !== "/images/Svgs/Anonymous.svg" && ![profileData.username,profileData.email,profileData.password,profileData.confirm].includes('') && (profileData.password === profileData.confirm) &&
					<MaterialButton classes="profile-data-btn mr-5" onClick={(e) => submitProfile()}><span>Post</span></MaterialButton>
				}
				
				{ useWebcam ?
					<>
						<MaterialButton classes="profile-data-btn mr-5" onClick={(e) => takeSnapShot()}><span>Take Snapshot</span> </MaterialButton>
						<MaterialButton classes="profile-data-btn mr-5" onClick={(e) => setUseWebcam(false)}><span>Cancel</span> </MaterialButton>
					</>
				:
					<>
						<MaterialButton classes="profile-data-btn mr-5" onClick={(e) => doUploadPhoto()}><span>Upload Photo</span> </MaterialButton>
						<MaterialButton classes="profile-data-btn mr-5" onClick={(e) => setUseWebcam(!useWebcam)}><span>Toggle Webcam</span> </MaterialButton>
					</>
				}
						
				{	(imgSrc_ !== "/images/Svgs/Anonymous.svg" || profileData.username !== '' || profileData.email !== ''  || profileData.password !== '' || profileData.confirm !== '' ) &&
					<MaterialButton classes="profile-data-btn mr-5" onClick={(e) => clearProfile()}><span>Clear</span> </MaterialButton>
				}
			</div>
		</StyledProfile>	
	)
}
