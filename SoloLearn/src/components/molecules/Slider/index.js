import React from 'react';
import Carousel from 'react-slick';
import './styles.scss';

const Slider = ({ className, ...props }) => (
	<Carousel
		arrows
		draggable
		dots={false}
		speed={750}
		swipeToSlide
		variableWidth
		infinite={false}
		className={`molecule_slider-root ${className}`}
		{...props}
	/>
);

export default Slider;
