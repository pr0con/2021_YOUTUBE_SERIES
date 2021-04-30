import React from 'react';
import { atom, selector } from 'recoil';

/*
	Carousel Properties
*/
export const MAX_WINDOWS = atom({
	key: 'MAX_WINDOWS',
	default: 9
});

export const windows = atom({
	key: 'windows',
	default: 9
});

export const wind0w = atom({
	key: 'wind0w',
	default: 1
});

export const orientation = atom({
	key: 'orientation',
	default: 'rotateY'
});

export const transforms = atom({
	key: 'transforms',
	default: []
});

export const zoom = atom({
	key: 'zoom',
	default: 0
});

export const perspective = atom({
	key: 'perspective',
	default: 0
});

export const angle = atom({
	key: 'angle',
	default: 0
});


/*
	Carousel Rotation
*/
export const rotation = atom({
	key: 'rotation',
	default: 0
});

export const macroIndex = atom({
	key: 'macro-index',
	default: 0
});


/* For Controls Display */
export const direction = atom({
	key: 'direction',
	default: 'noop'
});

//https://codepen.io/desandro/pen/wjeBpp
// set: async ({get,set}, op)  --->  Async selector sets are not currently supported.
const updatCarousel = (get,set) => {
	let theta = 360 / get(windows);	
	set(rotation, (theta * get(macroIndex) * -1));
}


//technically op not used yet... 
const rotateCarousel = (get,set,op) => {
	let theta = 360 / get(windows);	
	let next_index = (op === "left") ? get(macroIndex) - 1 : (op === "right") ? get(macroIndex) + 1 : '';	

	set(macroIndex, next_index);
	set(rotation, (theta * next_index * -1));	
}

export const operation = selector({
	key: 'operation',
	get: ({get}) => { return get(direction) },
	set: ({ get, set}, op) => {
		if(['left','right','up','down','noop'].includes(op)) set(direction, op);
		
		switch(op) {
			case "up":
			case "down":
				(op === "up" && get(windows) + 1 <= get(MAX_WINDOWS)) ? set(windows, get(windows) + 1) : (op === "down" && get(windows) > 3) ? set(windows, get(windows) -1) : '';
				break;
			case "left":
			case "right":
				(op === "left" && get(wind0w) === 1) ? set(wind0w, get(windows)) : (op === "left") ? set(wind0w, get(wind0w) - 1) : '';
				(op === "right" && get(wind0w) === get(windows)) ? set(wind0w, 1) : (op === "right") ? set(wind0w, get(wind0w) + 1) : '';
				rotateCarousel(get,set,op);
				break;
				
			case "update":
				updatCarousel(get,set);
				break;
			default:
				break;	
		}
	}
});


/* Loading and Session Login */
export const initializing = atom({
	key: 'initializing',
	default: true
});

export const accessToken = atom({
	key: 'access-token',
	default: false
})

export const loggedIn = atom({
	key: 'logged-in',
	get: ({get}) => {
		return ( get(accessToken) === false) ? false : true
	}
});

const handleFetchErrors = () => {
	return new Response(JSON.stringify({
		type: 'alert-error',
		code: 400,
		message: 'Stupid network error'
	}));	
}

export const userProfile  = selector({
	key: 'user-profile',
	get: async({get}) => {
		let at = get(accessToken);
		if(at === false) return
		
		let response = await (await fetch(`https://var.pr0con.com:1300/api/auth/profile`, {
			method: 'GET',
			//credentials: 'include',
			headers: {
				'Authorization': 'Bearer ' + at
			}
		}).catch(handleFetchErrors)).json();
		return response
		console.log(response);
	}
})

