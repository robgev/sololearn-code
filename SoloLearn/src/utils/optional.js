import React from 'react';

export default ({
	idle, IdleComponent, style, children,
}) =>
	(idle ? (IdleComponent || null) : <div style={style}>{ children }</div>);
