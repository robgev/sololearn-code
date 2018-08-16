import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { browserHistory } from 'react-router';
import Service from 'api/service';
import Toggle from 'material-ui/Toggle';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import { red500 } from 'material-ui/styles/colors';
import DeleteIcon from 'material-ui/svg-icons/action/delete-forever';
import ProfileAvatar from 'components/ProfileAvatar';
import VoteControls from 'components/VoteControls';
import UserTooltip from 'components/UserTooltip';

import { determineAccessLevel } from 'utils';
import { removeCode } from 'actions/playground';

import 'styles/Playground/bottomToolbar.scss';

const mapStateToProps = state => ({
	userId: state.userProfile.id,
	accessLevel: determineAccessLevel(state.userProfile.accessLevel),
});

const mapDispatchToProps = {
	removeCode,
};

@translate()
@connect(mapStateToProps, mapDispatchToProps)
class BottomToolbar extends PureComponent {
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
			<div className="bottom-toolbar">
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
									label="Delete this code"
									style={{ marginRight: 5 }}
									backgroundColor={red500}
									onClick={this.toggleDeleteModal}
								/>
							}
							{(userID === userId || accessLevel > 1) &&
								<Toggle
									label="Public:"
									style={{ width: 50 }}
									defaultToggled={isPublic}
									onToggle={this.togglePublicState}
									trackStyle={{ backgroundColor: '#BDBDBD' }}
									thumbStyle={{ backgroundColor: '#E0E0E0' }}
									trackSwitchedStyle={{ backgroundColor: '#9CCC65' }}
									thumbSwitchedStyle={{ backgroundColor: '#AED581' }}
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
					title="Are you sure?"
					actions={[
						<RaisedButton
							label="Cancel"
							secondary
							onClick={this.toggleDeleteModal}
						/>,
						<RaisedButton
							label="Delete"
							primary
							onClick={this.deleteCurrentCode}
						/>,
					]
					}
					modal={false}
					open={this.state.isDeleteModalOpen}
					onRequestClose={this.toggleDeleteModal}
				/>
			</div>
		);
	}
}

export default BottomToolbar;
