import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { browserHistory } from 'react-router';
import Service from 'api/service';
import Toggle from 'material-ui/Toggle';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'components/StyledDialog';
import { red500 } from 'material-ui/styles/colors';
import DeleteIcon from 'material-ui/svg-icons/action/delete-forever';
import ProfileAvatar from 'components/ProfileAvatar';
import VoteControls from 'components/VoteControls';
import UserTooltip from 'components/UserTooltip';

import { determineAccessLevel } from 'utils';
import { removeCode } from 'actions/playground';

import 'styles/Playground/topToolbar.scss';

const mapStateToProps = state => ({
	userId: state.userProfile.id,
	accessLevel: determineAccessLevel(state.userProfile.accessLevel),
});

const mapDispatchToProps = {
	removeCode,
};

@translate()
@connect(mapStateToProps, mapDispatchToProps)
class TopToolbar extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			isPublic: props.codeData.isPublic,
			isDeleteModalOpen: false,
		};
	}

	togglePublicState = async () => {
		const { isPublic } = this.state;
		const { codeData: { id } } = this.props;
		this.setState({ isPublic: !isPublic });
		await Service.request('Playground/ToggleCodePublic', { id, isPublic: !isPublic });
	}

	deleteCurrentCode = async () => {
		const { codeData: { id }, removeCode } = this.props;
		removeCode(id);
		browserHistory.goBack();
	}

	toggleDeleteModal = () => {
		this.setState(state => ({ isDeleteModalOpen: !state.isDeleteModalOpen }));
	}

	render() {
		const { isPublic } = this.state;
		const {
			t,
			userId,
			voteCode,
			codeData,
			accessLevel,
		} = this.props;
		const {
			id,
			vote,
			votes,
			level,
			name,
			badge,
			userID,
			language,
			userName,
			avatarUrl,
		} = codeData;
		return (
			<Paper className="top-toolbar">
				<div className="toolbar-left">
					<div className="user-data">
						<UserTooltip userData={codeData}>
							<ProfileAvatar
								size={40}
								level={level}
								badge={badge}
								userID={userID}
								userName={userName}
								avatarUrl={avatarUrl}
							/>
						</UserTooltip>
						<div className="user-text-data">
							<p className="code-name">
								{name} <span className="language-tag">{language}</span>
							</p>
							<p className="user-name">
								{userName}
							</p>
						</div>
					</div>
				</div>
				<div className="toolbar-right">
					<div className="toggle-container">
						<div className="my-code-actions">
							{userID === userId &&
								<RaisedButton
									labelColor="white"
									icon={<DeleteIcon />}
									style={{ marginRight: 5 }}
									backgroundColor={red500}
									label={t('common.delete-title')}
									onClick={this.toggleDeleteModal}
								/>
							}
							{(userID === userId || accessLevel > 1) &&
								<Toggle
									style={{ width: 50 }}
									defaultToggled={isPublic}
									onToggle={this.togglePublicState}
									trackStyle={{ backgroundColor: '#BDBDBD' }}
									thumbStyle={{ backgroundColor: '#E0E0E0' }}
									trackSwitchedStyle={{ backgroundColor: '#9CCC65' }}
									thumbSwitchedStyle={{ backgroundColor: '#AED581' }}
									label={t('code_playground.popups.save-popup-public-toggle-title')}
								/>
							}
						</div>
					</div>
					{!!id &&
						<VoteControls
							userVote={vote}
							totalVotes={votes}
							key="voteControls"
							id={codeData.id}
							type="code"
							onUpvote={() => voteCode(codeData, 1)}
							onDownvote={() => voteCode(codeData, -1)}
						/>
					}
				</div>
				<Dialog
					title={t('code_playground.popups.delete-code-description')}
					actions={[
						<RaisedButton
							secondary
							label={t('common.cancel-title')}
							onClick={this.toggleDeleteModal}
						/>,
						<RaisedButton
							primary
							label={t('common.delete-title')}
							onClick={this.deleteCurrentCode}
						/>,
					]
					}
					modal={false}
					open={this.state.isDeleteModalOpen}
					onRequestClose={this.toggleDeleteModal}
				/>
			</Paper>
		);
	}
}

export default TopToolbar;
