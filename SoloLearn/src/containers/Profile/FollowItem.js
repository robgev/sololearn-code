import React, { Component } from 'react';
import { connect } from 'react-redux';
import { observer } from 'mobx-react';
import {
	Container,
	TextBlock,
	SecondaryTextBlock,
	PaperContainer,
} from 'components/atoms';
import {
	ProfileAvatar,
	UsernameLink,
	RaisedButton,
} from 'components/molecules';
import { translate } from 'react-i18next';

import './FollowItem.scss';

const mapStateToProps = state => ({ userID: state.userProfile && state.userProfile.id });

@connect(mapStateToProps)
@translate()
@observer
class FollowItem extends Component {

	handleFollowClick = () => {
			this.props.onFollowClick(this.props.follow.id);
	}

render() {
	const {
		t, follow,
	} = this.props;

	return (
		<Container className="follower">
			<Container className="details">
				<ProfileAvatar user={follow} />
				<Container className="username-container" >
					<UsernameLink className="username" to={`/profile/${follow.id}`}>
						{follow.name}
					</UsernameLink>
					<SecondaryTextBlock>{follow.followers} {t('common.user-followers')} | {t('common.user-level')} {follow.level}</SecondaryTextBlock>
				</Container>
			</Container>
			{
				this.props.userID !== follow.id &&
					<RaisedButton
						color={follow.isFollowing ? 'secondary' : 'primary'}
						onClick={this.handleFollowClick}
					>
						{follow.isFollowing ? t('common.user-following') : t('common.follow-user')}
					</RaisedButton>
			}
		</Container>
	);
}
}

export default FollowItem;
