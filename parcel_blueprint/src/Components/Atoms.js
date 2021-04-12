import React from 'react';
import { atom, selector } from 'recoil';

/*
	Carousel Properties
*/
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


// set: async ({get,set}, op)  --->  Async selector sets are not currently supported.
export const operation = selector({
	key: 'operation',
	get: ({get}) => { return get(direction) },
	set: ({ get, set}, op) => {
		set(direction, op);
		switch(op) {
			case "up":
			case "down":
				(op === "up") ? set(windows, get(windows) + 1) : (op === "down") ? set(windows, get(windows) -1) : '';
				break;
			case "left":
			case "right":
				(op === "left" && get(wind0w) === 1) ? set(wind0w, get(windows)) : (op === "left") ? set(wind0w, get(wind0w) - 1) : '';
				(op === "right" && get(wind0w) === get(windows)) ? set(wind0w, 1) : (op === "right") ? set(wind0w, get(wind0w) + 1) : '';
				
				let theta = 360 / get(windows);
				let radius = get(perspective) - get(zoom);
				
				let next_index = (op === "left") ? get(macroIndex) - 1 : (op === "right") ? get(macroIndex) + 1 : '';
				set(macroIndex, next_index);
				
				set(rotation, (theta * next_index * -1));
				
				break;
			default:
				break;	
		}
	}
});

/* Floating Components */
export const profile = atom({
	key: 'update-create-profile',
	default: false
});

export const webcam = atom({
	key: 'webcam',
	default: false
});

export const imgSrc = atom({
	key: 'imgSrc',
	default: '/images/profile-image-placeholder.webp'
});

export const imgSrcSrc = atom({
		key: 'img-src-src',
		default: 'noop'
});

