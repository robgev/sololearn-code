// React modules
import React, { PureComponent } from 'react';
import { Link } from 'react-router';
import ToolTip from 'react-portal-tooltip';
// Utils
import { removeDups, updateDate } from 'utils';

import Likes from 'components/Likes';
import UserCard from 'components/UserCard';

import 'styles/Discuss/QuestionItem.scss';
import DiscussTag from './DiscussTag';

class QuestionItem extends PureComponent {
	state = {
		isTooltipActive: false,
	}
	toggleTooltip = () => {
		this.setState(state => ({ isTooltipActive: !state.isTooltipActive }));
	}
	render() {
		const { isTooltipActive } = this.state;
		const { question } = this.props;
		return (
			<div className="question-item-container">
				<div className="question-stats">
					<div className="question-item-wrapper">
						<Likes
							hasPlus={false}
							votes={question.votes}
							id={question.id}
							type="post"
							className="question-item-likes"
						/>
						<p className="question-item-label">Votes</p>
					</div>
					<div className="question-item-wrapper">
						<p className="question-item-answer-count">{question.answers > 99 ? '99+' : question.answers}</p>
						<p className="question-item-label">Answers</p>
					</div>
				</div>
				<div className="question-item-details-wrapper">
					<div>
						<Link className="question-item-title-link" to={`/discuss/${question.id}`}>
							<p className="question-item-title">{question.title}</p>
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
					<div className="question-item-author-details">
						<span className="question-item-date">
							{updateDate(question.date)} by {' '}
						</span>
						<span
							id={`question-item-${question.id}`}
							onMouseEnter={this.toggleTooltip}
							onMouseLeave={this.toggleTooltip}
						>
							{question.userName}
						</span>
					</div>
				</div>
				<ToolTip
					align="center"
					position="top"
					arrow="left"
					active={isTooltipActive}
					parent={`#question-item-${question.id}`}
				>
					<UserCard
						id={question.userID}
						level={question.level}
						name={question.userName}
						avatarUrl={question.avatarUrl}
						className="profile-avatar-user-card profile-avatar-reset"
					/>
				</ToolTip>
			</div>
		);
	}
}

export default QuestionItem;
