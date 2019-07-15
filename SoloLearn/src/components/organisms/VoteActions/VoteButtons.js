import React from 'react';
import { observer } from 'mobx-react';
import { IconButton, FlexBox, SecondaryTextBlock } from 'components/atoms';
import { ArrowUp, ArrowDown, ThumbUpSmall, ThumbDownSmall } from 'components/icons';
import PropTypes from 'prop-types';

import { numberFormatter } from 'utils';

const VoteActionsView = ({
	small,
	likes,
	vertical,
	onUpvote,
	className,
	onDownvote,
	onLabelClick,
	...props
}) => (
	<FlexBox
		align
		justify
		className={`organism_vote-actions ${vertical ? 'vertical' : 'horizontal'} ${className}`}
		{...props}
	>
		<IconButton active={likes.userVote === 1} onClick={onUpvote}>
			{ small
				? <ThumbUpSmall />
				: <ArrowUp />
			}
		</IconButton>
		<SecondaryTextBlock size="small" className="organism_vote-actions-label" onClick={onLabelClick}>
			{likes.voteCount > 0 && '+'}{numberFormatter(likes.voteCount)}
		</SecondaryTextBlock>
		<IconButton active={likes.userVote === -1} onClick={onDownvote}>
			{ small
				? <ThumbDownSmall />
				: <ArrowDown />
			}
		</IconButton>
	</FlexBox>
);

VoteActionsView.propTypes = {
	vertical: PropTypes.bool,
	className: PropTypes.string,
	onLabelClick: PropTypes.func,
	onUpvote: PropTypes.func.isRequired,
	onDownvote: PropTypes.func.isRequired,
};

VoteActionsView.defaultProps = {
	className: '',
	vertical: false,
	onLabelClick: () => { },
};

export default observer(VoteActionsView);
