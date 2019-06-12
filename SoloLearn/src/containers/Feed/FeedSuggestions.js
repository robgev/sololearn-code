// React modules
import React from 'react';
import { connect } from 'react-redux';
import { Container, FlexBox } from 'components/atoms';
import { discoverIdsSelector, getEntitiesByIds } from 'reducers/discover.reducer';

// Additional data and components
import FeedSuggestion from './FeedSuggestion';

const mapStateToProps = (state, { number }) => ({
	suggestions: getEntitiesByIds(
		state,
		discoverIdsSelector(state).slice(number * 10, (number * 10) + 10),
	).slice(0, 5),
});

// const generateBreakpoints = () => {
// 	const breakpointValues = [1224, 768, 320];
// 	const initialNumberOfShownItems = 3;
// 	return breakpointValues.map((currentPoint, index) => {
// 		const slidesToShow = initialNumberOfShownItems - (index + 1);
// 		return {
// 			breakpoint: currentPoint,
// 			settings: {
// 				slidesToShow,
// 				slidesToScroll: slidesToShow,
// 			},
// 		};
// 	});
// };

const FeedSuggestions = ({ suggestions }) => (
	<FlexBox className="feed-suggestions">
		{suggestions.map(suggestion => (
			<Container
				key={`suggestion${suggestion.id}`}
			>
				<FeedSuggestion className="suggestion-wrapper" suggestion={suggestion} />
			</Container>
		))}
	</FlexBox>
);

export default connect(mapStateToProps)(FeedSuggestions);
