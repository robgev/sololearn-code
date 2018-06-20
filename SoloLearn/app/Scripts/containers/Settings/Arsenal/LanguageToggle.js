import React from 'react';
import Toggle from 'material-ui/Toggle';

const LanguageToggle = ({
	iconUrl,
	onToggle,
	languageName,
	isPlayEnabled,
}) => (
	<div className="language-card-container">
		<div className="language-data-container">
			<img
				src={iconUrl}
				alt="Language Icon"
				className="language-icon-image"
			/>
			<p>{languageName}</p>
		</div>
		<Toggle
			style={{ width: 50 }}
			onToggle={onToggle}
			toggled={isPlayEnabled}
		/>
	</div>
);

export default LanguageToggle;
