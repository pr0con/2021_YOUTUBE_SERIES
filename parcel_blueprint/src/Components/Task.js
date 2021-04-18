import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';

const StyledTask = styled.div`
	label {
		display: flex;
		position: relative;
		
		color: rgba(184, 143, 136, 1);
		align-items: center;
		&:hover { cursor: pointer; }	
		
		input[type="checkbox"] {
			position: relative;	
			width: 1rem;
			height: 1rem;
			
			-webkit-appearance: none;
			-moz-appearance: none;
			appearance: none;
			
			background: transparent;
			border: 1px solid rgba(184, 143, 136, 1);
			
			margin-right: 1rem;
		}
		
		span {
			
		}
	}
	
	label.strikethrough input[type='checkbox']{
		background: rgba(184, 143, 136, 1);
	}
	label.strikethrough span {
		text-decoration: line-through;
	}
`;

import { taskFamily } from './TaskList.js';

export function Task({id}) {
	const [{label, completed}, setTask ] = useRecoilState(taskFamily(id));
	
	return(
		<StyledTask>
			<label className={`task ${completed ? 'strikethrough' : ''}`}>
				<input type="checkbox" checked={completed} onChange={(e) => setTask({label, completed: !completed })} />
				<span>{label}</span>
			</label>
		</StyledTask>
	)
}