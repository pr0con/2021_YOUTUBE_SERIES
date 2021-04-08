import React, { useEffect, useState, createContext } from 'react';

/* 
 	Native React Global State System
*/
export const AppContext = createContext();
export default function({children}) {
	const [ something, setSomething ] = useState('ANYTHING WE WANT GLOBALLY');
	
	return(
		<AppContext.Provider value={{
			something
		}}>
			{children}
		</AppContext.Provider>
	)	
}