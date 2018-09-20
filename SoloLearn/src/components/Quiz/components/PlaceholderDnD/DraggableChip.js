import React, { Component } from 'react';
import { DragSource } from 'react-dnd';
import Chip from 'material-ui/Chip';
import DRAG_TYPE from './dragType';

const collect = (connect, monitor) => ({
	connectDragSource: connect.dragSource(),
	isDragging: monitor.isDragging(),
});

const specs = {
	beginDrag() {
		return {};
	},
	canDrag(props) {
		return !props.isSelected;
	},
	endDrag(props, monitor) {
		const dropField = monitor.getDropResult();
		if (dropField !== null) {
			props.onDrop(props.answer.id, dropField.index);
		}
	},
};

class DraggableChip extends Component {
	render() {
		const {
			connectDragSource, isSelected, answer, onClick, style,
		} = this.props;
		return connectDragSource(
			<div>
				<Chip
					labelColor={isSelected ? '#8BC34A' : 'black'}
					style={style}
					onClick={() => onClick(answer.id)}
				>
					{answer.text}
				</Chip>
			</div>
		);
	}
}

export default DragSource(
	DRAG_TYPE,
	specs,
	collect,
)(DraggableChip);
