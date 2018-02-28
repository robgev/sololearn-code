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

import RelatedLessons from './RelatedLessons';
import SlayLessonContent from './SlayLessonContent';

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

	componentWillMount() {
		const { lessonId } = this.props.params;
		this.loadLesson(lessonId);
	}

	componentWillReceiveProps(newProps) {
		const { params: newParams } = newProps;
		const { params } = this.props;
		if (newParams.lessonId !== params.lessonId) {
			this.loadLesson(newParams.lessonId);
		}
	}

	loadLesson = async (lessonId) => {
		const { params, getCourseLesson, getLesson } = this.props;
		const { itemType } = params;
		const parsedItemType = parseInt(itemType, 10);
		this.setState({ loading: true });
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
		const { lessonsByUser, activeLesson, params } = this.props;
		const { pageNumber } = params;
		const {
			id,
			date,
			type,
			parts,
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
					<div style={{ width: '100%' }}>
						<SlayLessonContent
							date={date}
							quizId={id}
							type={type}
							withToolbar
							parts={parts}
							userData={userData}
							textContent={content}
							pageNumber={pageNumber}
							courseLanguage={language}
							commentsCount={comments}
							isBookmarked={isBookmarked}
							openComments={this.toggleComments}
						/>
						<Comments
							id={id}
							type={1}
							commentsType="userLesson"
							commentsOpened={commentsOpened}
							closeComments={this.toggleComments}
						/>
						<RelatedLessons
							id={id}
							userID={userID}
							userName={userName}
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
