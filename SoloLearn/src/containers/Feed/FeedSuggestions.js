// React modules
import React from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';

// Additional data and components
import FeedSuggestion from './FeedSuggestion';

const mapStateToProps = ({ discoverSuggestions }, { number }) => ({
	suggestions: discoverSuggestions.slice(number * 10, (number * 10) + 10),
});

const generateBreakpoints = (numberOfItems) => {
	const breakpointValues = [ 1224, 768, 320 ];
	const initialNumberOfShownItems = 4;
	return breakpointValues.map((currentPoint, index) => {
		const slidesToShow = initialNumberOfShownItems - (index + 1);
		return {
			breakpoint: currentPoint,
			settings: {
				infinite: numberOfItems > slidesToShow,
				slidesToShow,
				slidesToScroll: slidesToShow,
			},
		};
	});
};

const FeedSuggestions = ({ suggestions }) => (
	<div className="feed-suggestions" style={{ marginBottom: 10 }}>
		<Slider
			arrows
			draggable
			dots={false}
			speed={500}
			swipeToSlide
			slidesToShow={4}
			slidesToScroll={4}
			infinite={suggestions.length > 4}
			responsive={generateBreakpoints(suggestions.length)}
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
