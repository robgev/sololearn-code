import React, { Component } from 'react';
import { connect } from 'react-redux';
import { observer } from 'mobx-react';
import { translate } from 'react-i18next';
import { browserHistory } from 'react-router';
import {
	FlexBox,
	Snackbar,
	Container,
	MenuItem,
	SwitchToggle,
	PaperContainer,
	SecondaryTextBlock,
} from 'components/atoms';
import {
	IconMenu,
	ProfileAvatar,
	RaisedButton,
	UsernameLink,
	LanguageIndicator,
} from 'components/molecules';
import { VoteActions } from 'components/organisms';
import { Delete } from 'components/icons';
import ReportPopup from 'components/ReportPopup';
import ReportItemTypes from 'constants/ReportItemTypes';

import { determineAccessLevel, updateDate } from 'utils';
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

	handleSnackbarClose = (_, reason) => {
		if (reason !== 'clickaway') {
			this.setState({ isSnackbarOpen: false });
		}
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
					<VoteActions
						id={id}
						type="code"
						initialVote={vote}
						initialCount={votes}
					/>
					<SecondaryTextBlock>
						{updateDate(this.props.playground.data.createdDate)}
					</SecondaryTextBlock>
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
				<Snackbar
					open={isSnackbarOpen}
					onClose={this.handleSnackbarClose}
					message={this.props.playground.isPublic
						? t('code_playground.alert.private-title')
						: t('code_playground.alert.public-title')
					}
				/>
			</PaperContainer>
		);
	}
}

export default CodeInfoToolbar;
