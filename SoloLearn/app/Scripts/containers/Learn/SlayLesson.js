import React, { PureComponent } from 'react';
import ReactGA from 'react-ga';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';

import Comments from 'containers/Comments/CommentsBase';
import LessonLayout from 'components/Layouts/LessonLayout';

import { slayItemTypes } from 'constants/ItemTypes';
import Service from 'api/service';
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
			commentsCount: 0,
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

	loadCommentsCount = async () => {
		const { id, type } = this.props.activeLesson;
		const { count } = await Service.request('Discussion/GetLessonCommentCount', { quizId: id, type });
		return count;
	}

	loadLesson = async (lessonId) => {
		const { params, getCourseLesson, getLesson } = this.props;
		const { itemType } = params;
		const parsedItemType = parseInt(itemType, 10);
		this.setState({ loading: true });
		switch (parsedItemType) {
		case slayItemTypes.courseLesson: {
			await getCourseLesson(lessonId);
			await this.getLessonsByAuthor();
			const commentsCount = await this.loadCommentsCount();
			this.setState({ loading: false, commentsCount });
			break;
		}
		case slayItemTypes.slayLesson: {
			await getLesson(lessonId);
			await this.getLessonsByAuthor();
			const commentsCount = await this.loadCommentsCount();
			this.setState({ loading: false, commentsCount });
			break;
		}
		default:
			break;
		}
		document.title = `${this.props.activeLesson.name}`;
		if (this.props.activeLesson.parts) {
			ReactGA.ga('send', 'screenView', { screenName: 'Course Lesson Lesson Page' });
		} else {
			ReactGA.ga('send', 'screenView', { screenName: 'Lesson Page' });
		}
	}

	getLessonsByAuthor = async () => {
		const { activeLesson, getLessonsByAuthor } = this.props;
		const { id, userID } = activeLesson;
		await getLessonsByAuthor(id, userID, { index: 0, count: 10 });
	}

	render() {
		const { loading, commentsCount } = this.state;
		const { lessonsByUser, activeLesson, params } = this.props;
		const { pageNumber } = params;
		const {
			id,
			date,
			type,
			parts,
			badge,
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
			badge,
			userID,
			avatarUrl,
			userName,
		};
		return (
			<LessonLayout loading={loading}>
				{ !loading &&
					<div style={{ width: '100%' }}>
						<Paper style={{ padding: 15 }}>
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
							/>
							<Comments
								id={id}
								type={1}
								commentsType="userLesson"
								commentsCount={commentsCount}
								closeComments={this.toggleComments}
							/>
						</Paper>
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
