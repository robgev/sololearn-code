import React, { Component } from 'react';
import { connect } from 'react-redux';
import { observer } from 'mobx-react';
import { translate } from 'react-i18next';
import { browserHistory } from 'react-router';
import {
	FlexBox,
	TextBlock,
	MenuItem,
	IconButton,
	PaperContainer,
} from 'components/atoms';
import {
	IconMenu,
	ModBadge,
	ViewStats,
	ProfileAvatar,
	UsernameLink,
	ConsecutiveSnackbar,
} from 'components/molecules';
import { VoteActions } from 'components/organisms';
import { Globe, Lock } from 'components/icons';
import ReportPopup from 'components/ReportPopup';
import ReportItemTypes from 'constants/ReportItemTypes';

import { determineAccessLevel, updateDate } from 'utils';
import { removeCode } from 'actions/playground';

import RemovalPopup from './RemovalPopup';
import DetailsPopup from './DetailsPopup';
import './styles.scss';

const mapStateToProps = state => ({
	accessLevel: state.userProfile && determineAccessLevel(state.userProfile.accessLevel),
});

const mapDispatchToProps = {
	removeCode,
};

@translate()
@connect(mapStateToProps, mapDispatchToProps)
@observer
class CodeInfoToolbar extends Component {
	state = {
		isDeletePopupOpen: false,
		isDetailsPopupOpen: false,
		isReportPopupOpen: false,
		isSnackbarOpen: false,
	};

	deleteCurrentCode = async () => {
		this.props.removeCode(this.props.playground.data.id);
		browserHistory.goBack();
	}

	togglePopup = () => {
		this.setState(state => ({ isDeletePopupOpen: !state.isDeletePopupOpen }));
	}

	toggleDetailsPopup = () => {
		this.setState(state => ({ isDetailsPopupOpen: !state.isDetailsPopupOpen }));
	}

	toggleReportPopup = () => {
		this.setState(state => ({ isReportPopupOpen: !state.isReportPopupOpen }));
	}

	togglePublic = () => {
		this.setState({ isSnackbarOpen: true });
		this.props.playground.togglePublic();
	}

	handleSnackbarClose = () => {
		this.setState({ isSnackbarOpen: false });
	}

	render() {
		const {
			isDeletePopupOpen,
			isDetailsPopupOpen,
			isReportPopupOpen,
			isSnackbarOpen,
		} = this.state;
		const { t, accessLevel,toggleSigninPopup } = this.props;
		const {
			id,
			vote,
			votes,
			level,
			name,
			badge,
			userID,
			avatarUrl,
			userName = '',
			publicID,
		} = this.props.playground.data;
		const isMe = userID === this.props.playground.userId;
		const userData = {
			level,
			badge,
			userID,
			avatarUrl,
			name: userName,
			id: userID,
		};

		return (
			<PaperContainer className={`top-toolbar ${this.props.playground.isFullscreen ? 'fullscreen' : ''}`}>
				<FlexBox align>
					<ProfileAvatar user={userData} />
					<FlexBox column className="code-info-toolbar_main-info">
						<TextBlock className="code-info-toolbar_code-name">
							{name}
						</TextBlock>
						<FlexBox align>
							<UsernameLink to={`/profile/${userID}`} className="code-info-toobar_user-name">
								{userName}
							</UsernameLink>
							<ModBadge
								className="badge"
								badge={badge}
							/>
						</FlexBox>
					</FlexBox>
				</FlexBox>
				<FlexBox align className="code-info-toolbar_secondary-info">
					<VoteActions
						id={id}
						type="code"
						toggleSigninPopup={toggleSigninPopup}
						initialVote={vote}
						initialCount={votes}
						className="code-info-toolbar_vote-actions"
					/>
					<ViewStats views={this.props.playground.data.viewCount} />
					<FlexBox align className="code-info-toolbar_date-info">
						<TextBlock className="code-info-toolbar_date-text">
							{updateDate(this.props.playground.data.modifiedDate)}
						</TextBlock>
						{(isMe || accessLevel > 1) &&
						<IconButton onClick={this.togglePublic}>
							{this.props.playground.data.isPublic
								? <Globe />
								:	<Lock />
							}
						</IconButton>
						}
					</FlexBox>
				</FlexBox>
				<IconMenu iconClassName="code-info-toolbar_menu">
					{isMe &&
					<MenuItem key={`remove-${id}`} onClick={this.togglePopup}>
						{t('common.delete-title')}
					</MenuItem>
					}
					{!isMe &&
					<MenuItem onClick={this.toggleReportPopup}>
						{t('common.report-action-title')}
					</MenuItem>
					}
					<MenuItem onClick={this.toggleDetailsPopup}>
						{t('code_playground.details.title')}
					</MenuItem>
				</IconMenu>
				<ReportPopup
					itemId={id}
					open={isReportPopupOpen}
					itemType={ReportItemTypes.code}
					onClose={this.toggleReportPopup}
				/>
				<DetailsPopup
					open={isDetailsPopupOpen}
					onClose={this.toggleDetailsPopup}
					playground={this.props.playground}
				/>
				<RemovalPopup
					open={isDeletePopupOpen}
					onClose={this.togglePopup}
					onDelete={this.deleteCurrentCode}
				/>
				<ConsecutiveSnackbar
					open={isSnackbarOpen}
					onClose={this.handleSnackbarClose}
					message={this.props.playground.data.isPublic
						? t('code_playground.alert.public-title')
						: t('code_playground.alert.private-title')
					}
				/>
			</PaperContainer>
		);
	}
}

export default CodeInfoToolbar;
