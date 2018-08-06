import React from 'react';

const DiscussSidebar = () => (
	<div
		style={{
			padding: 15,
			width: '100%',
			paddingBottom: 0,
			boxSizing: 'border-box',
		}}
	>
		<div className="sidebar-title">
			<p className="title">Guidelines</p>
		</div>
		<p>- Post only programming-related QUESTIONS and ANSWERS;</p>

		<p>- SEARCH for similar QUESTIONS or ANSWERS before posting;</p>

		<p>- Include relevant TAGS;</p>

		<p>- Follow community RULES: https://www.sololearn.com/Content-Creation-Guidelines/</p>

		<p>
			DO NOT
			- Post spam/advertisement;
			- Use inappropriate language.
		</p>
	</div>
);

export default DiscussSidebar;
