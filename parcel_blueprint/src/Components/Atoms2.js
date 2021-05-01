import React from 'react';
import { atom, selector,selectorFamily } from 'recoil';
import { nanoid } from 'nanoid';


import { Wrapper } from './Wrapper.js';
import { FileSystem } from './FileSystem.js';

import { wind0w } from './Atoms.js';

export const UWCID = atom({
	key: 'UWCID',
	default: []
});

export const loadComponents = selectorFamily({
	key: 'load-components',
	get: (wid) => ({get}) => {
		let window_components = get(UWCID).filter(w => w.window_index === wid);
		return window_components
	},
	set: (what) => ({get,set}, component) => {
		let cuid = `wrapper-${nanoid()}`
		let new_component = null;
		switch(component) {
			case "file-system":
				new_component = <Wrapper key={cuid} wrapperId={cuid}><FileSystem /></Wrapper>
				break;
			default:
				break;
		}	
		set(UWCID, [...get(UWCID), { window_index: get(wind0w), wrapper_id: cuid, wrapper: new_component }]);	
	}
})