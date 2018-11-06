import React from 'react';
import { IconButton, Container, SecondaryTextBlock } from 'components/atoms';
import { ArrowUp, ArrowDown } from 'components/icons';
import PropTypes from 'prop-types';

import { numberFormatter } from 'utils';

const VoteActionsView = ({
	vertical,
	userVote,
	onUpvote,
	voteCount,
	className,
	onDownvote,
	onLabelClick,
	...props
}) => (
	<Container
		className={`organism_vote-actions ${vertical ? 'vertical' : 'horizontal'} ${className}`}
		{...props}
	>
		<IconButton active={userVote === 1} onClick={onUpvote}>
			<ArrowUp />
		</IconButton>
		<SecondaryTextBlock size="small" className="organism_vote-actions-label" onClick={onLabelClick}>
			{voteCount > 0 && '+'}{numberFormatter(voteCount)}
		</SecondaryTextBlock>
		<IconButton active={userVote === -1} onClick={onUpvote}>
			<ArrowDown />
		</IconButton>
	</Container>
);

VoteActionsView.propTypes = {
	vertical: PropTypes.bool,
	className: PropTypes.string,
	onLabelClick: PropTypes.func,
	onUpvote: PropTypes.func.isRequired,
	onDownvote: PropTypes.func.isRequired,
	voteCount: PropTypes.number.isRequired,
};

VoteActionsView.defaultProps = {
	className: '',
	vertical: false,
	onLabelClick: () => {},
};

export default VoteActionsView;
