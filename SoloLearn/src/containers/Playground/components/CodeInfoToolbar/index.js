import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { browserHistory } from 'react-router';
import {
	FlexBox,
	Container,
	SwitchToggle,
	PaperContainer,
	SecondaryTextBlock,
} from 'components/atoms';
import {
	ProfileAvatar,
	RaisedButton,
	UsernameLink,
	LanguageIndicator,
} from 'components/molecules';
import { VoteActions } from 'components/organisms';
import { Delete } from 'components/icons';

import { determineAccessLevel } from 'utils';
import { removeCode } from 'actions/playground';

import RemovalPopup from './RemovalPopup';
import './styles.scss';

const mapStateToProps = state => ({
	accessLevel: determineAccessLevel(state.userProfile.accessLevel),
});

const mapDispatchToProps = {
	removeCode,
};

@translate()
@connect(mapStateToProps, mapDispatchToProps)
class CodeInfoToolbar extends PureComponent {
	state = {
		isDeleteModalOpen: false,
	};

	deleteCurrentCode = async () => {
		this.props.removeCode(this.props.playground.data.id);
		browserHistory.goBack();
	}

	togglePopup = () => {
		this.setState(state => ({ isDeleteModalOpen: !state.isDeleteModalOpen }));
	}

	render() {
		const { isDeleteModalOpen } = this.state;
		const { t, accessLevel } = this.props;
		const {
			id,
			vote,
			votes,
			name,
			userID,
			language,
			userName,
		} = this.props.playground.data;
		const isMe = userID === this.props.playground.userId;
		return (
			<PaperContainer className="top-toolbar">
				<Container className="toolbar-left">
					<FlexBox align>
						<ProfileAvatar user={this.props.playground.data} />
						<FlexBox column>
							<SecondaryTextBlock>
								{name} <LanguageIndicator language={language} />
							</SecondaryTextBlock>
							<UsernameLink to={`/profile/${userID}`}>
								{userName}
							</UsernameLink>
						</FlexBox>
					</FlexBox>
				</Container>
				<Container className="toolbar-right">
					<FlexBox align className="my-code-actions">
						{isMe &&
						<RaisedButton className="delete-button" onClick={this.togglePopup}>
							<Delete />
							{t('common.delete-title')}
						</RaisedButton>
						}
						{(isMe || accessLevel > 1) &&

						<SwitchToggle
							defaultChecked={this.props.playground.isPublic}
							onChange={this.props.playground.togglePublic}
							labelPlacement="start"
							label={t('code_playground.popups.save-popup-public-toggle-title')}
						/>
						}
					</FlexBox>
					<VoteActions
						id={id}
						type="code"
						initialVote={vote}
						initialCount={votes}
					/>
				</Container>
				<RemovalPopup
					open={isDeleteModalOpen}
					onClose={this.togglePopup}
					onDelete={this.deleteCurrentCode}
				/>
			</PaperContainer>
		);
	}
}

export default CodeInfoToolbar;
