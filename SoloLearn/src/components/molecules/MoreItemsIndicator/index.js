import React from 'react';
import PropTypes from 'prop-types';
import { FlexBox, TextBlock } from 'components/atoms';
import { ChevronUp, ChevronDown } from 'components/icons';

import './styles.scss';

const MoreItemsIndicator = ({
	open,
	onClick,
	condition,
	openText,
	closedText,
	className,
	...props
}) => (condition
	? (
		<FlexBox
			{...props}
			align
			justify
			className={`molecule_more-items-indicator ${className}`}
			onClick={onClick}
		>
			<TextBlock className="molecule_more-items-indicator_show-more-text">
				{
					open
						? openText
						: closedText
				}
			</TextBlock>
			{
				open
					? <ChevronUp className="molecule_more-items-indicator_icon" />
					: <ChevronDown className="molecule_more-items-indicator_icon" />
			}
		</FlexBox>
	)
	: null);

MoreItemsIndicator.propTypes = {
	open: PropTypes.bool.isRequired,
	onClick: PropTypes.func.isRequired,
	condition: PropTypes.bool.isRequired,
	openText: PropTypes.string,
	closedText: PropTypes.string,
	className: PropTypes.string,
};

MoreItemsIndicator.defaultProps = {
	openText: 'See Less',
	closedText: 'See More',
	className: '',
};

export default MoreItemsIndicator;
