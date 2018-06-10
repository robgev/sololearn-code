import React from 'react';

const Entry = (props) => {
	const {
		mention,
		theme,
		searchValue, // eslint-disable-line no-unused-vars
		isFocused, // eslint-disable-line no-unused-vars
		...parentProps
	} = props;

	return (
		<div {...parentProps}>
			<div className="mentionSuggestionsEntryContainer">
				<div className="mentionSuggestionsEntryContainerLeft">
					<img
						src={mention.avatarUrl}
						className="mentionSuggestionsEntryAvatar"
						alt=""
					/>
				</div>
				<div className="mentionSuggestionsEntryContainerRight">
					{mention.name}
				</div>
			</div>
		</div>
	);
};

export default Entry;
