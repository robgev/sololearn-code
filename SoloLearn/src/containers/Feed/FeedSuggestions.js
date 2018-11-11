// React modules
import React from 'react';
import { connect } from 'react-redux';
import { Slider } from 'components/molecules';
import { discoverIdsSelector, getEntitiesByIds } from 'reducers/discover.reducer';

// Additional data and components
import FeedSuggestion from './FeedSuggestion';

const mapStateToProps = (state, { number }) => ({
	suggestions: getEntitiesByIds(
		state,
		discoverIdsSelector(state).slice(number * 10, (number * 10) + 10),
	),
});

const generateBreakpoints = () => {
	const breakpointValues = [ 1224, 768, 320 ];
	const initialNumberOfShownItems = 3;
	return breakpointValues.map((currentPoint, index) => {
		const slidesToShow = initialNumberOfShownItems - (index + 1);
		return {
			breakpoint: currentPoint,
			settings: {
				slidesToShow,
				slidesToScroll: slidesToShow,
			},
		};
	});
};

const FeedSuggestions = ({ suggestions }) => (
	<div className="feed-suggestions" style={{ width: '97%', margin: '0 auto', marginBottom: 5 }}>
		<Slider
			slidesToShow={3}
			slidesToScroll={4}
			responsive={generateBreakpoints()}
		>
			{suggestions.map(suggestion => (
				<div
					key={`suggestion${suggestion.id}`}
				>
					<FeedSuggestion className="suggestion-wrapper" suggestion={suggestion} />
				</div>
			))}
		</Slider>
	</div>
);

export default connect(mapStateToProps)(FeedSuggestions);
