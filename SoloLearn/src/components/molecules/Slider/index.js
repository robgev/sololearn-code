import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const Slider = props => (
	<Carousel
		centerMode
		showStatus={false}
		showThumbs={false}
		showIndicators={false}
		className="molecule_slider-root"
		{...props}
	/>
);

export default Slider;
