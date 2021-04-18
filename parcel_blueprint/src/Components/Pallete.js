import React, { useState } from 'react';
import styled from 'styled-components';
import { CopyToClipboard } from 'react-copy-to-clipboard';


/*
	#dbb7ab  rgba(219, 183, 171, 1)
	#b88f88  rgba(184, 143, 136, 1) 
	#966b68  rgba(150, 107, 104, 1)
	#734b4d  rgba(115, 75, 77, 1)
	#513136  rgba(81, 49, 54, 1)
	#2e1a1f  rgba(46, 26, 31, 1)
	#0c0608  rgba(12, 6, 8, 1)
*/

const StyledPallete = styled.div`
	position: relative;
	
	width: 30rem;
	height: 40rem;
	
	border-radius: .4rem;
	background: rgba(12,6,8,.6);
	
	padding: .5rem;
	
	display: flex;
	flex-direction: column;	
	
	.pallete-color {
		position: relative;
		min-height: 2rem;
		border-radius: .2rem;
		display: flex;
		align-items: center;
		justify-content: center;	
		margin-top: .2rem;
		&:hover { cursor: pointer; }
	}
`;

const StyledPalleteColor = styled.span`
	color: ${(props) => props.fg};
	background: ${(props) => props.bg};	
`;

export function Pallete({classes}) {
	const [ colors, setColors ] = useState([
		{ hex: "#dbb7ab", rgba: "rgba(219, 183, 171, 1)", action: () => { console.log('Color Picked') } },
		{ hex: "#b88f88", rgba: "rgba(184, 143, 136, 1)", action: () => { console.log('Color Picked') } },
		{ hex: "#966b68", rgba: "rgba(150, 107, 104, 1)", action: () => { console.log('Color Picked') }},
		{ hex: "#734b4d", rgba: "rgba(115, 75, 77, 1)", action: () => { console.log('Color Picked') } },
		{ hex: "#513136", rgba: "rgba(81, 49, 54, 1)", action: () => { console.log('Color Picked') } },
		{ hex: "#2e1a1f", rgba: "rgba(46, 26, 31, 1)", forground: "rgba(115, 75, 77, 1)", action: () => { console.log('Color Picked') } },
		{ hex: "#0c0608", rgba: "rgba(12, 6, 8, 1)", forground: "rgba(115, 75, 77, 1)",action: () => { console.log('Color Picked') } },
	]);	
		
	const [ dragItem, setDragItem ] = useState(null);
	const handleDrag = (e,i) => {
		setDragItem(colors[i]);
		e.dataTransfer.effectAllowed = "move";
		e.dataTransfer.setData('text/html', e.target);
		e.dataTransfer.setDragImage(e.target, 20,20);	
	}	
	const handleDragOver = (e,i) => {
		e.preventDefault();
		
		//data object index
		const doi = colors[i];
		if (doi === dragItem) {
			return
		}
		const items = colors.filter(item => item !== dragItem )
		items.splice(i,0, dragItem)
		setColors(items)
	} 
	const handleDrop = (e) => {
		e.preventDefault();
	} 
		
	return(
		<StyledPallete className={`${classes}`}>
			{ colors.map((c,i) => (
				<CopyToClipboard text={c.rgba} key={`pallete-color-${i}`}>
					<StyledPalleteColor className={`pallete-color`} bg={c.rgba} fg={c.forground ? c.forground : '#000'} draggable
						onDrop={(e) => handleDrop(e)}
						onDragStart={(e) => handleDrag(e,i)}
						onDragOver={(e) => handleDragOver(e,i)}
						onClick={(e) => ('action' in c) ? c.action() : ''}
					>{c.hex} - {c.rgba}</StyledPalleteColor>
				</CopyToClipboard>
			))}
		</StyledPallete>	
	)
}