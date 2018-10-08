import React from 'react';
import { DragSource } from 'react-dnd';
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
		return !props.isDisabled;
	},
	endDrag(props, monitor) {
		const dropField = monitor.getDropResult();
		props.onClick(props.answer.id);
		if (dropField !== null) {
			props.onDrop(props.answer.id, dropField.index);
		}
	},
};

const SelectedAnswer = ({
	connectDragSource, answer, onClick,
}) => connectDragSource(<span onClick={() => onClick(answer.id)}>{answer.text}</span>);

export default DragSource(
	DRAG_TYPE,
	specs,
	collect,
)(SelectedAnswer);
