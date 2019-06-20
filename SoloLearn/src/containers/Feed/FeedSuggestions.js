// React modules
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Container, FlexBox } from 'components/atoms';
import { discoverIdsSelector, getEntitiesByIds } from 'reducers/discover.reducer';

// Additional data and components
import FeedSuggestion from './FeedSuggestion';

const mapStateToProps = (state, { number }) => ({
	suggestions: getEntitiesByIds(
		state,
		discoverIdsSelector(state).slice(number * 6, (number * 6) + 6),
	),
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

const FeedSuggestions = ({ suggestions }) => {
	const [ windowWidth, setWindowWidth ] = useState(document.body.clientWidth);
	const [ suggestionsList, setSuggestionsList ] = useState(suggestions);

	useEffect(() => {
		const resizeFunc = () => {
			setWindowWidth(document.body.clientWidth);
		};
		window.addEventListener('resize', resizeFunc);
		return () => {
			window.removeEventListener('resize', resizeFunc);
		};
	}, []);

	useEffect(() => {
		if (windowWidth < 1238 && windowWidth >= 998) {
			setSuggestionsList(suggestions.slice(0, 5));
		} else if (windowWidth < 998 && windowWidth >= 936) {
			setSuggestionsList(suggestions.slice(0, 4));
		} else if (windowWidth < 863 && windowWidth >= 725) {
			setSuggestionsList(suggestions.slice(0, 5));
		} else if (windowWidth < 725 && windowWidth >= 587) {
			setSuggestionsList(suggestions.slice(0, 4));
		} else if (windowWidth < 587 && windowWidth >= 449) {
			setSuggestionsList(suggestions.slice(0, 3));
		} else if (windowWidth < 449 && windowWidth >= 311) {
			setSuggestionsList(suggestions.slice(0, 2));
		} else {
			setSuggestionsList(suggestions);
		}
	}, [ windowWidth ]);

	return (
		<FlexBox className="feed-suggestions">
			{suggestionsList.map(suggestion => (
				<Container
					className="feed-suggestion-container"
					key={`suggestion${suggestion.id}`}
				>
					<FeedSuggestion className="suggestion-wrapper" suggestion={suggestion} />
				</Container>
			))}
		</FlexBox>
	);
};

export default connect(mapStateToProps)(FeedSuggestions);
