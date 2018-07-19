import React from 'react';
import Toggle from 'material-ui/Toggle';
import texts from 'texts';

const FeedSettingToggle = ({
	name,
	onToggle,
	isSettingOn,
}) => (
	<div className="content-card-container">
		<p>{texts.feedItemNames[name]}</p>
		<Toggle
			style={{ width: 50 }}
			onToggle={onToggle}
			toggled={isSettingOn}
		/>
	</div>
);

export default FeedSettingToggle;
