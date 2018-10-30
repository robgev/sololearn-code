import React from 'react';
import { RadioButton } from 'components/atoms';
import {  RadioButtonGroup as Group } from 'material-ui/RadioButton';
import './styles.scss';

const RadioButtonGroup = ({ className, items, children, ...props }) => {
	let radioButtons = [];
	if (!children) {
		children = [];
	}
	if (items && items.length) {
		radioButtons = items.map((item) => {
			return (<RadioButton {...item}/>)
		});
	}
	return (
		<Group className={'molecule_radio-button-group ' + className} {...props}>
			{
				[...children, ...radioButtons]
			}
		</Group>
	);
}

RadioButtonGroup.defaultProps = {
	className: '',
};
export default RadioButtonGroup;