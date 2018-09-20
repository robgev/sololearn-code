import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import DraggableChip from './DraggableChip';
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

class DroppableField extends Component {
	render() {
		const {
			value, connectDropTarget, width, color, onClick,
		} = this.props;
		return connectDropTarget(
			<div style={{ display: 'inline-block' }}>
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
						<div onClick={() => onClick(value.id)}>{value.text}</div>}
				</div>
			</div>
		);
	}
}

export default DropTarget(DRAG_TYPE, fieldSource, collect)(DroppableField);
