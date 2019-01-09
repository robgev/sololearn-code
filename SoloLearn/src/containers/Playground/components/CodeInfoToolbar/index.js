import React, { Component } from 'react';
import { connect } from 'react-redux';
import { observer } from 'mobx-react';
import { translate } from 'react-i18next';
import { browserHistory } from 'react-router';
import {
	FlexBox,
	Container,
	MenuItem,
	SwitchToggle,
	PaperContainer,
	SecondaryTextBlock,
} from 'components/atoms';
import {
	DateInfo,
	IconMenu,
	ProfileAvatar,
	RaisedButton,
	UsernameLink,
	ConsecutiveSnackbar,
} from 'components/molecules';
import { VoteActions } from 'components/organisms';
import { Delete } from 'components/icons';
import ReportPopup from 'components/ReportPopup';
import LanguageCard from 'components/LanguageCard';
import ReportItemTypes from 'constants/ReportItemTypes';

import { determineAccessLevel } from 'utils';
import { removeCode } from 'actions/playground';

import RemovalPopup from './RemovalPopup';
import DetailsPopup from './DetailsPopup';
import './styles.scss';

const mapStateToProps = state => ({
	accessLevel: determineAccessLevel(state.userProfile.accessLevel),
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
		const { t, accessLevel } = this.props;
		const {
			id,
			vote,
			votes,
			level,
			name,
			badge,
			userID,
			language,
			avatarUrl,
			userName = '',
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
			<PaperContainer className="top-toolbar">
				<Container className="toolbar-left">
					<FlexBox className="code-info-toolbar_code-data">
						<LanguageCard big language={language} />
						<FlexBox column>
							<SecondaryTextBlock>
								{name}
							</SecondaryTextBlock>
							<DateInfo date={this.props.playground.data.modifiedDate} />
						</FlexBox>
					</FlexBox>
					<VoteActions
						id={id}
						type="code"
						initialVote={vote}
						initialCount={votes}
					/>
				</Container>
				<Container className="toolbar-right">
					<FlexBox align className="my-code-actions">
						{/* {isMe &&
						<RaisedButton className="delete-button" onClick={this.togglePopup}>
							<Delete />
							{t('common.delete-title')}
						</RaisedButton>
						} */}
						{(isMe || accessLevel > 1) &&
						<SwitchToggle
							defaultChecked={this.props.playground.data.isPublic}
							onChange={this.togglePublic}
							labelPlacement="start"
							label={t('code_playground.popups.save-popup-public-toggle-title')}
						/>
						}
						<IconMenu>
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
					</FlexBox>
					<FlexBox align>
						<FlexBox column>
							<UsernameLink to={`/profile/${userID}`}>
								{userName}
							</UsernameLink>
						</FlexBox>
						<ProfileAvatar user={userData} />
					</FlexBox>
				</Container>
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
