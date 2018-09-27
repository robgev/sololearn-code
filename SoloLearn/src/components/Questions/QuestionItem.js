// React modules
import React, { PureComponent } from 'react';
import { Link } from 'react-router';
import UserTooltip from 'components/UserTooltip';
import Localize from 'components/Localize';
// Utils
import { removeDups, updateDate } from 'utils';

import 'styles/Discuss/QuestionItem.scss';
import DiscussTag from './DiscussTag';

const QuestionItem = ({ question }) => (
	<Localize>
		{({ t }) => (
			<div className="question-item-container">
				<Link to={`/discuss/${question.id}`} className="question-stats">
					<div className="question-item-wrapper">
						<div className="question-item-likes"> {question.votes} </div>
						<p className="question-item-label">{t('discuss.votes-title')}</p>
					</div>
					<div className="question-item-wrapper">
						<p className="question-item-answer-count">{question.answers > 99 ? '99+' : question.answers}</p>
						<p className="question-item-label">
							{question.answers === 1 ? t('discuss.answer-one-format') : t('discuss.answer-other-format')}
						</p>
					</div>
				</Link>
				<div className="question-item-details-wrapper">
					<div>
						<Link className="question-item-title-link hoverable" to={`/discuss/${question.id}`}>
							{question.title}
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
						<UserTooltip userData={question}>
							<span>
								{question.userName}
							</span>
						</UserTooltip>
					</div>
				</div>
			</div>
		)}
	</Localize>
);

export default QuestionItem;
