import React from 'react';
import { DropTarget } from 'react-dnd';
import SelectedAnswer from './SelectedAnswer';
import DRAG_TYPE from './dragType';

const fieldSource = {
	drop(props) {
		return { index: parseInt(props.index, 10) };
	},
};

const collect = (connect, monitor) => ({
	connectDropTarget: connect.dropTarget(),
	isOver: monitor.isOver,
});

const DroppableField = ({
	value, connectDropTarget, width, color, onClick, isDisabled, onDrop,
}) => connectDropTarget((
	<div className="placeholder-dnd-item-wrapper">
		<div
			className="placeholder-dnd-item fill-in-item"
			role="button"
			tabIndex={0}
			style={{
				width: `${width}em`,
				color,
				cursor: value === null ? 'default' : 'pointer',
			}}
		>
			{value !== null &&
				<SelectedAnswer
					onDrop={onDrop}
					onClick={onClick}
					answer={value}
					key={value.id}
					isSelected
					isDisabled={isDisabled}
				/>
			}
		</div>
	</div>
));

export default DropTarget(DRAG_TYPE, fieldSource, collect)(DroppableField);
