// React modules
import React, { PureComponent } from 'react';
import { browserHistory } from 'react-router';
import moment from 'moment';

// Material UI components
import { ListItem } from 'material-ui/List';

// App defaults and utils
import { updateDate, getChallengeStatus } from 'utils';
import contestTypes from 'defaults/contestTypes';
import ProfileAvatar from 'components/Shared/ProfileAvatar';

const styles = {
	content: {
		display: 'flex',
		alignItems: 'center',
		padding: '10px',
		// borderBottom: '1px solid #e0e0e0'
	},

	wrapper: {
		margin: '0 0 0 8px',
		flexGrow: 1,
	},

	userName: {
		fontSize: '13px',
		color: '#545454',
	},

	statusesWrapper: {
		display: 'flex',
		alignItems: 'center',
	},

	languageName: {
		fontSize: '10px',
		fontWeight: 500,
		padding: '3px 5px',
		margin: '0 5px 0 0',
		color: '#fff',
		backgroundColor: '#607D8B',
	},

	resultsWrapper: {
		width: '50px',
		textAlign: 'center',
		margin: '0 0 0 15px',
	},

	score: {
		fontSize: '15px',
		fontWeight: 500,
		color: '#545454',
	},

	rewardXp: {
		fontSize: '14px',
		color: '#9CCC65',
	},

	date: {
		fontSize: '11px',
	},
};

class ContestItemBase extends PureComponent {
	setContest = () => {
		const { contestId } = this.props;
		browserHistory.push(`/challenge/${contestId}`);
	}

	getDateDifference = (expireDate) => {
		const dateNow = moment();
		const expiryDate = moment.utc(expireDate);
		const duration = moment.duration(dateNow.diff(expiryDate));
		const hours = Math.floor(duration.asHours());
		const minutes = Math.floor(duration.asMinutes());
		return hours < 1 ?
			`Expires in ${minutes} min` :
			`Expires in ${hours} hr`;
	}

	render() {
		const { courseName, contest } = this.props;
		const {
			date,
			player,
			opponent,
			expireDate,
		} = contest;
		const { status } = player;
		const isCompleted = status !== contestTypes.Started &&
																				status !== contestTypes.Challenged &&
																				status !== contestTypes.GotChallenged;

		return (
			<ListItem
				className="content"
				containerElement="div"
				onClick={this.setContest}
				innerDivStyle={styles.content}
			>
				<ProfileAvatar
					userID={opponent.id}
					userName={opponent.name}
					avatarUrl={opponent.avatarUrl}
				/>
				<div className="wrapper" style={styles.wrapper}>
					<p style={styles.userName}>{opponent.name}</p>
					<p style={styles.date}>
						{isCompleted ?
							updateDate(date) :
							this.getDateDifference(expireDate)
						}
					</p>
				</div>
				<div style={styles.statusesWrapper}>
					<p style={styles.languageName}>{courseName.toUpperCase()}</p>
					{status !== contestTypes.GotChallenged
						&& getChallengeStatus(status)
					}
				</div>
				<div style={styles.resultsWrapper}>
					{
						isCompleted ?
							<p className="score" style={styles.score}>
								<span>{player.score}</span>
								<span> : </span>
								<span>{opponent.score}</span>
							</p>
							:
							<p style={styles.rewardXp}>{player.rewardXp} XP</p>
					}
				</div>
			</ListItem>
		);
	}
}

export default ContestItemBase;
