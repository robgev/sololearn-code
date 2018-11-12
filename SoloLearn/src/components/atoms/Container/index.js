import React, { forwardRef } from 'react';

const Container = forwardRef((props, ref) => (
	<div ref={ref} {...props} />
));

export default Container;
