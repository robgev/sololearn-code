import React from 'react';
import FeedPin from './FeedPin';

const FeedPins = ({ pins, openPopup }) => (
	<div className="feed-pins">
		{	pins.map(pin => <FeedPin key={`pin${pin.id}`} pin={pin} openPopup={openPopup} />)}
	</div>
);

export default FeedPins;
