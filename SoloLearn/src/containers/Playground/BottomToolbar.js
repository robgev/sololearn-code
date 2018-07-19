import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { browserHistory } from 'react-router';
import Service from 'api/service';
import Toggle from 'material-ui/Toggle';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import { red500 } from 'material-ui/styles/colors';
import DeleteIcon from 'material-ui/svg-icons/action/delete-forever';
import ProfileAvatar from 'components/Shared/ProfileAvatar';
import VoteControls from 'components/Shared/VoteControls';

import { determineAccessLevel } from 'utils';
import { removeCode } from 'actions/playground';
import getLikesAndDownvotesCurried from 'actions/likes';

import 'styles/Playground/bottomToolbar.scss';

const mapStateToProps = state => ({
	userId: state.userProfile.id,
	accessLevel: determineAccessLevel(state.userProfile.accessLevel),
});

const mapDispatchToProps = {
	removeCode,
	getLikes: getLikesAndDownvotesCurried('codeLikes'),
	getDownvotes: getLikesAndDownvotesCurried('codeDownvotes'),
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

	getVotes = () => this.props.getLikes(this.props.codeData.id)

	getDownvotes = () => this.props.getDownvotes(this.props.codeData.id)

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
			openComments,
		} = this.props;
		const {
			id,
			vote,
			votes,
			level,
			name,
			badge,
			userID,
			publicID,
			language,
			userName,
			avatarUrl,
		} = codeData;
		return (
			<div className="bottom-toolbar">
				<div className="toolbar-left">
					<div className="user-data">
						<ProfileAvatar
							size={40}
							withTooltip
							level={level}
							badge={badge}
							userID={userID}
							userName={userName}
							avatarUrl={avatarUrl}
							tooltipId={`challenge-user-${publicID}`}
						/>
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
							getVotes={this.getVotes}
							accessLevel={accessLevel}
							getDownvotes={this.getDownvotes}
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
