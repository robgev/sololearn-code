import React from 'react';

import './styles.scss';

const UploadImageInput = ({ inputRef, handleChange }) => (
	<input
		type="file"
		className="upload-image-native-input"
		ref={inputRef}
		onChange={handleChange}
		accept="image/*"
	/>
);

export default UploadImageInput;
