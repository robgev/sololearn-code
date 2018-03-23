// React modules
import React, { PureComponent } from 'react';
import { Link } from 'react-router';
import Radium from 'radium';
import { connect } from 'react-redux';

// Material UI components
import ChatBubble from 'material-ui/svg-icons/communication/chat-bubble-outline';
import { green500 } from 'material-ui/styles/colors';

// Utils
import { removeDups, updateDate, determineAccessLevel } from 'utils';

import Likes from 'components/Shared/Likes';
import getLikesAndDownvotesCurried from 'actions/likes';
import DiscussTag from './DiscussTag';

import { QuestionItemStyles as styles } from './styles';

export const noStyleLink = { textDecoration: 'none' };

const mapStateToProps = state => ({
	accessLevel: determineAccessLevel(state.userProfile.accessLevel),
});

const mapDispatchToProps = {
	getLikes: getLikesAndDownvotesCurried('postLikes'),
	getDownvotes: getLikesAndDownvotesCurried('postDownvotes'),
};

@connect(mapStateToProps, mapDispatchToProps)
@Radium
class QuestionItem extends PureComponent {
	getLikes = () => {
		this.props.getLikes(this.props.question.id);
	}
	getDownvotes = () => {
		this.props.getDownvotes(this.props.question.id);
	}
	render() {
		const { question, accessLevel } = this.props;
		return (
			<div style={styles.question}>

				<div style={styles.stats}>
					<Likes
						votes={question.votes}
						getLikes={this.getLikes}
						accessLevel={accessLevel}
						getDownvotes={this.getDownvotes}
					/>
					<div style={styles.answersCountWrapper}>
						<p style={styles.answersCount}>{question.answers > 99 ? '99+' : question.answers}</p>
						<ChatBubble color={green500} style={styles.chatBubble} />
					</div>
				</div>
				<div style={styles.detailsWrapper}>
					<div>
						<Link to={`/discuss/${question.id}`} style={noStyleLink}>
							<p style={styles.title}>{question.title}</p>
						</Link>
						<div>
							{
								removeDups(question.tags).map((tag, index) => (
									<DiscussTag
										key={`${question.id} ${tag}`}
										tag={tag}
										index={index}
									/>
								))
							}
						</div>
					</div>
					<div style={styles.authorDetails}>
						<span style={styles.date}>
							{updateDate(question.date)} by
						</span>
						<span> {question.userName}</span>
					</div>
				</div>
			</div>
		);
	}
}

export default QuestionItem;
