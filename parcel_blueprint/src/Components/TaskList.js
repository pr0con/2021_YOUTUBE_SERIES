import React, { useRef, useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { atom, atomFamily, selector, useRecoilState, useRecoilValue, useRecoilCallback } from 'recoil';

const StyledTaskList = styled.div`
	position: relative;
	
	width: 30rem;
	height: 40rem;
	
	border-radius: .4rem;
	background: rgba(12,6,8,.6);
	
	padding: .5rem;
	
	display: flex;
	flex-direction: column;	
	
	#task-list-stats {
		position: relative;
		background: rgba(219, 183, 171, 1);
		height: 2rem;
		
		display: flex;
		align-items: center;
		justify-content: space-between;
		
		color: rgba(81, 49, 54, 1);
		padding: 0 1rem 0 1rem;
	}
	#task-list-tasks {
		position: relative;
		flex-grow: 1;
		
		padding: .5rem 0 .5rem 0;
	}
	
	#task-list-actions {
		#task-list-action-buttons {
			position: relative;
			margin-top: .5rem;
			display: flex;
			flex-direction: row-reverse;
			
			.task-list-btn {
				padding: 0 .3rem 0 .3rem;
				color: rgba(115, 75, 77, 1);
				border: 1px solid rgba(115, 75, 77, 1);
				border-radius: .2rem;
			}
		}	
	}	
`;

import { Task } from './Task.js';
import { MaterialInput } from './MaterialInput.js';
import { MaterialButton } from './MaterialButton.js';

const tasks = atom({
	key: 'tasks',
	default: []
})

export const taskFamily = atomFamily({
	key: 'task-family',
	default: {
		label: '',
		completed: false
	}
});

const taskListStats = selector({
	key: 'task-list-stats',
	get: ({get}) => {
		let ts = get(tasks);
		let tf = ts.map((id) => {
			return get(taskFamily(id))
		});
		return {  completed: tf.filter((t) => t.completed).length,  incomplete: tf.filter((t) => !t.completed).length}
	}
});

export function TaskList() {
	const [ newTask, setNewTask ] = useState('');
	const [ tasks_, setTaks ] = useRecoilState(tasks);

	const completedTasks = useRecoilValue(taskListStats); //or destructure {completed, incomplete}

	const insertTask = useRecoilCallback(({set}) => {
		return(label) => {
		
			let tid = tasks_.length;
			set(tasks, [...tasks_, tid]);
			
			set(taskFamily(tid), {
				label,
				completed: false
			});
			
			setNewTask('');
		}	
	});

	const handleKeyUp = ({keyCode}) => {
		if(keyCode === 13) {
			insertTask(newTask);
		}
	}
	
	const insertClicked = () => {
		insertTask(newTask);
	}
	
	return(
		<StyledTaskList>
			<div id="task-list-stats" className="br-2">
				<span>{completedTasks.incomplete}</span>
				<span>|</span>
				<span>{completedTasks.completed}</span>
			</div>
			<div id="task-list-tasks">
				{ tasks_.map((i) => (
					<Task key={`task-${i}`} id={i} />
				))}
			</div>
			<div id="task-list-actions">
				<MaterialInput type="text" label="New Task" v={newTask} onChange={(v) => setNewTask(v)} classes="task-list-input" onKeyUp={(e) => handleKeyUp(e)} />
				
				<div id="task-list-action-buttons">
					<MaterialButton classes="task-list-btn" onClick={(e) => insertClicked(e)}><span>Insert</span></MaterialButton>
					<MaterialButton classes="task-list-btn mr-5" onClick={(e) => setNewTask('')}><span>Clear</span></MaterialButton>
				</div>
			</div>
		</StyledTaskList>	
	)
}