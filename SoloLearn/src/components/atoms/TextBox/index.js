import React from 'react';
import './styles.scss';

const TextBox = ({ className, ...props }) =>
	<textarea className={`atom_text-box ${className}`} {...props} />;

TextBox.defaultProps = {
	className: '',
};
export default TextBox;
