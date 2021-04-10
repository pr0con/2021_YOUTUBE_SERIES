import React, { useEffect, useState, createContext } from 'react';

/* 
 	Native React Global State System
*/
export const AppContext = createContext();
export default function({children}) {
	
	
	return(
		<AppContext.Provider value={{
	
		}}>
			{children}
		</AppContext.Provider>
	)	
}