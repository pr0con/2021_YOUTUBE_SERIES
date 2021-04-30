import React, { useRef, useEffect, useState, createContext } from 'react';
import { nanoid } from 'nanoid';
/* 
 	Native React Global State System
*/
export const AppContext = createContext();
export default function({children}) {
	const iiRef = useRef(null); //image input ref
	const wcRef = useRef(null); //webcam ref
	const piRef = useRef(null); //profile image form ref
	
	const [ systemAlerts, setSystemAlerts ] = useState([]);
	
	const DataURIToBlob = (dataURI) => {
		const splitDataURI = dataURI.split(',')
		const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1]);
		const mimeString = splitDataURI[0].split(':')[1].split(';')[0];
		
		const ia = new Uint8Array(byteString.length)
		for (let i = 0; i < byteString.length; i++)
			ia[i] = byteString.charCodeAt(i)

		return new Blob([ia], {type: mimeString});
	}
	
	const handleFetchErr = (error) => {
		if(typeof error === 'object' && 'message' in error) {
			console.log('EIS: ',error.message);
			return new Response(JSON.stringify({
				type: 'alert-error',
				code: 400,
				message: 'Stupid network error'
			}));
		}
	}
	
	//takes a fetch response
	const pushAlert = async (a) => {
		a.alertId = await nanoid()
		
		if('access_token' in a) a.access_token = 'F00';
		if('success' in a && a.success === true) a.type = 'alert-success';
		
		console.log('hit');
		setSystemAlerts((alerts) => ([a, ...alerts]));
	}
	
	const killAlert = (aid) => {
		let filtered_alerts = systemAlerts.filter(a => a.alertId !== aid);
		setSystemAlerts(filtered_alerts);
	}
	
	return(
		<AppContext.Provider value={{
			iiRef,
			wcRef,
			piRef,
			
			DataURIToBlob,
			handleFetchErr,
			
			pushAlert,
			killAlert,
			systemAlerts,
		}}>
			{children}
		</AppContext.Provider>
	)	
}