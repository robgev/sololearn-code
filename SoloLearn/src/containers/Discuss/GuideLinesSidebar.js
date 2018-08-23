import React from 'react';
import 'styles/Discuss/DiscussSidebar.scss';

const DiscussSidebar = () => (
	<div
		style={{
			padding: '15px 20px',
			width: '100%',
			boxSizing: 'border-box',
		}}
	>
		<div className="sidebar-title">
			<p className="title">Guidelines</p>
		</div>
		<p className="discuss-guidelines">- Post only programming-related QUESTIONS and ANSWERS;</p>

		<p className="discuss-guidelines">- SEARCH for similar QUESTIONS or ANSWERS before posting;</p>

		<p className="discuss-guidelines">- Include relevant TAGS;</p>

		<p className="discuss-guidelines">- Follow community RULES: https://www.sololearn.com/Content-Creation-Guidelines/</p>

		<p className="discuss-guidelines">
			DO NOT
			- Post spam/advertisement;
			- Use inappropriate language.
		</p>
	</div>
);

export default DiscussSidebar;
