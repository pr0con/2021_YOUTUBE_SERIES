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


// set: async ({get,set}, op)  --->  Async selector sets are not currently supported.
export const operation = selector({
	key: 'operation',
	get: ({get}) => true,
	set: ({get,set}, op) => {
		switch(op) {
			case "up":
			case "down":
				console.log('GOT UP OR DOWN OPERATION');
				break;
			case "left":
			case "right":
				(op === "left") ? console.log('hit recoil turn left') : (op === "right") ? console.log('hit recoil turn right') : '';
				
				break;
			default:
				break;	
		}
	}
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
