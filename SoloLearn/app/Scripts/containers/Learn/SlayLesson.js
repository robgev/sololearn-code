import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import Comments from 'containers/Comments/CommentsBase';
import LessonLayout from 'components/Layouts/LessonLayout';

import { slayItemTypes } from 'constants/ItemTypes';
import {
	getLesson,
	getCourseLesson,
	getLessonsByAuthor,
} from 'actions/slay';

import QuizText from './QuizText';
import RelatedLessons from './RelatedLessons';

const mapStateToProps = state => ({
	activeLesson: state.slay.activeLesson,
	lessonsByUser: state.slay.lessonsByUser,
});

const mapDispatchToProps = {
	getLesson,
	getCourseLesson,
	getLessonsByAuthor,
};

@connect(mapStateToProps, mapDispatchToProps)
class SlayLesson extends PureComponent {
	constructor() {
		super();
		this.state = {
			loading: true,
			commentsOpened: false,
		};
	}

	async componentWillMount() {
		const { params, getCourseLesson, getLesson } = this.props;
		const { itemType, lessonId } = params;
		const parsedItemType = parseInt(itemType, 10);
		switch (parsedItemType) {
		case slayItemTypes.courseLesson:
			await getCourseLesson(lessonId);
			await this.getLessonsByAuthor();
			this.setState({ loading: false });
			break;
		case slayItemTypes.slayLesson:
			await getLesson(lessonId);
			await this.getLessonsByAuthor();
			this.setState({ loading: false });
			break;
		default:
			break;
		}
	}

	getLessonsByAuthor = async () => {
		const { activeLesson, getLessonsByAuthor } = this.props;
		const { id, userID } = activeLesson;
		await getLessonsByAuthor(id, userID, { index: 0, count: 10 });
	}

	toggleComments = async () => {
		this.setState({ commentsOpened: !this.state.commentsOpened });
	}

	render() {
		const { loading, commentsOpened } = this.state;
		const { lessonsByUser, activeLesson } = this.props;
		const {
			id,
			type,
			userID,
			content,
			language,
			comments,
			userName,
			avatarUrl,
			nextLesson,
			isBookmarked,
			relevantLessons,
			implementations,
		} = activeLesson || {};
		const userData = {
			userID,
			avatarUrl,
			userName,
		};
		return (
			<LessonLayout loading={loading}>
				{ !loading &&
					<div>
						<QuizText
							quizId={id}
							type={type}
							withToolbar
							userData={userData}
							textContent={content}
							courseLanguage={language}
							commentsCount={comments}
							isBookmarked={isBookmarked}
							openComments={this.toggleComments}
						/>
						<Comments
							id={id}
							commentsOpened={commentsOpened}
							closeComments={this.toggleComments}
						/>
						<RelatedLessons
							id={id}
							nextLesson={nextLesson}
							lessonsByUser={lessonsByUser}
							relevantLessons={relevantLessons}
							implementations={implementations}
						/>
					</div>
				}
			</LessonLayout>
		);
	}
}

export default SlayLesson;
