import React from 'react';

const UploadImageInput = ({ inputRef, handleChange }) => (
	<input
		type="file"
		style={{ display: 'none' }}
		ref={inputRef}
		onChange={handleChange}
		accept=".png, .jpg, .jpeg"
	/>
);

export default UploadImageInput;
