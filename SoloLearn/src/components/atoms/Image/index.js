import React from 'react';

import './styles.scss';

const Image = ({ className, ...props }) => (
	<img className={'atom_image ' + className} alt="" {...props} />
);

Image.defaultProps = {
	className: '',
};

export default Image;
