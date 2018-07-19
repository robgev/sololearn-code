// React modules
import React from 'react';

// Additional data and components
import FeedSuggestion from './FeedSuggestion';
import { GridList, GridTile } from 'material-ui/GridList';

const styles = {
	gridList: {
		display: 'flex',
		flexWrap: 'nowrap',
		overflowX: 'auto',
	},

	tileStyle: {
		display: 'inline-flex',
		justifyContent: 'center',
		alignItems: 'center',
		overflow: 'visible',
	},
};

const FeedSuggestions = ({ feedItem }) => (
	<div className="feed-suggestions">
		<GridList
			style={styles.gridList}
			cols={2}
			cellHeight={150}
			padding={8}
		>
			{feedItem.suggestions.map(suggestion => (
				<GridTile
					key={`suggestion${suggestion.id}`}
					style={styles.tileStyle}
				>
					<FeedSuggestion className="suggestion-wrapper" feedId={feedItem.id} suggestion={suggestion} />
				</GridTile>
			))}
		</GridList>
	</div>
);

export default FeedSuggestions;
