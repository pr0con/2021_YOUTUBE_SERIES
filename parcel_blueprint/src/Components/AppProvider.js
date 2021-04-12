import React, { useRef, useEffect, useState, createContext } from 'react';

/* 
 	Native React Global State System
*/
export const AppContext = createContext();
export default function({children}) {
	const iiRef = useRef(null); //image input ref
	const wcRef = useRef(null); //webcam ref
	const piRef = useRef(null); //profile image form ref
	
	const DataURIToBlob = (dataURI) => {
		const splitDataURI = dataURI.split(',')
		const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1]);
		const mimeString = splitDataURI[0].split(':')[1].split(';')[0];
		
		const ia = new Uint8Array(byteString.length)
		for (let i = 0; i < byteString.length; i++)
			ia[i] = byteString.charCodeAt(i)

		return new Blob([ia], {type: mimeString});
	}
	
	return(
		<AppContext.Provider value={{
			iiRef,
			wcRef,
			piRef,
			
			DataURIToBlob,
		}}>
			{children}
		</AppContext.Provider>
	)	
}