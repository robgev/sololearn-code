// React modules
import React from 'react';
import { connect } from 'react-redux';

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

const mapStateToProps = ({ discoverSuggestions }, { number }) => ({
	suggestions: discoverSuggestions.slice(number * 10, (number * 10) + 10),
});

const FeedSuggestions = ({ number, suggestions }) => (
	<div className="feed-suggestions">
		<GridList
			style={styles.gridList}
			cols={2}
			cellHeight={150}
			padding={8}
		>
			{suggestions.map(suggestion => (
				<GridTile
					key={`suggestion${suggestion.id}`}
					style={styles.tileStyle}
				>
					<FeedSuggestion className="suggestion-wrapper" suggestion={suggestion} />
				</GridTile>
			))}
		</GridList>
	</div>
);

export default connect(mapStateToProps)(FeedSuggestions);
