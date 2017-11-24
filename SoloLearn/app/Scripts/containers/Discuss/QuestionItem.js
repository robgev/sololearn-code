// React modules
import React, { PureComponent } from 'react';
import { Link } from 'react-router';
import Radium from 'radium';
import { connect } from 'react-redux';

// Material UI components
import ChatBubble from 'material-ui/svg-icons/communication/chat-bubble-outline';
import { green500 } from 'material-ui/styles/colors';

import DiscussTag from './DiscussTag';
import Likes from '../../components/Shared/Likes';
import getLikesInternal from '../../actions/likes';

// Utils
import removeDups from '../../utils/removeDups';
import updateDate from '../../utils/dateFormatter';

export const noStyleLink = { textDecoration: 'none' };

const styles = {
	question: {
		padding: '10px',
		borderBottom: '1px solid #f3f3f3',
	},

	stats: {
		float: 'left',
		textAlign: 'center',
		width: '45px',
		fontSize: '14px',
	},

	answersCountWrapper: {
		position: 'relative',
	},

	answersCount: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		fontSize: '12px',
		padding: '0 0 5px 0',
	},

	chatBubble: {
		width: '32px',
		height: '32px',
	},

	detailsWrapper: {
		overflow: 'hidden',
		margin: '0 0 0 10px',
	},

	title: {
		fontSize: '15px',
		color: '#636060',
		margin: '0 0 5px 0',
	},

	tag: {
		base: {
			display: 'inline-block',
			verticalAlign: 'middle',
			backgroundColor: '#9CCC65',
			color: '#fff',
			fontSize: '12px',
			padding: '3px 5px',
			borderRadius: '3px',
		},

		margin: {
			margin: '0 0 0 5px',
		},
	},

	authorDetails: {
		float: 'right',
		fontSize: '12px',
	},

	date: {
		color: '#777',
	},
};

class QuestionItem extends PureComponent {
	getLikes = () => {
		this.props.getLikes(this.props.question.id);
	}
	render() {
		const { question } = this.props;
		return (
			<div style={styles.question}>

				<div style={styles.stats}>
					<Likes votes={question.votes} getLikes={this.getLikes} />
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

const mapDispatchToProps = { getLikes: getLikesInternal(2) };

export default connect(null, mapDispatchToProps)(Radium(QuestionItem));
