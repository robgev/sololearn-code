import React from 'react';

export default Component =>
	({ idle, IdleComponent, ...props }) =>
		(idle ? (IdleComponent || null) : <Component {...props} />);

export const Optional = ({
	idle, IdleComponent, style, children,
}) =>
	(idle ? (IdleComponent || null) : <div style={style}>{ children }</div>);
