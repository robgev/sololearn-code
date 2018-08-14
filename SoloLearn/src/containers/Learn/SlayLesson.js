import React, { PureComponent } from 'react';
import ReactGA from 'react-ga';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { translate } from 'react-i18next';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

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
@translate()
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

	getParsedItemType = () => {
		const { itemType } = this.props.params;
		switch (itemType) {
		case 'course-lesson':
			return slayItemTypes.courseLesson;
		case 'user-lesson':
			return slayItemTypes.slayLesson;
		default:
			return slayItemTypes.slayLesson;
		}
	}

	loadLesson = async (lessonId) => {
		const { getCourseLesson, getLesson } = this.props;
		const parsedItemType = this.getParsedItemType();
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
		const {
			t, lessonsByUser, activeLesson, params,
		} = this.props;
		const { pageNumber } = params;
		const {
			id,
			date,
			type,
			parts,
			level,
			badge,
			userID,
			content,
			language,
			itemType,
			comments,
			userName,
			avatarUrl,
			nextLesson,
			isBookmarked,
			relevantLessons,
			implementations,
		} = activeLesson || {};
		const userData = {
			level,
			badge,
			userID,
			avatarUrl,
			userName,
		};
		return (
			<LessonLayout
				loading={loading}
				sidebarContent={
					<RelatedLessons
						id={id}
						userID={userID}
						userName={userName}
						nextLesson={nextLesson}
						lessonsByUser={lessonsByUser}
						relevantLessons={relevantLessons}
					/>
				}
			>
				{!loading &&
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
							{nextLesson &&
								<Link to={`/learn/lesson/${nextLesson.itemType === 3 ? 'course-lesson' : 'user-lesson'}/${nextLesson.id}/1`}>
									<RaisedButton
										labelColor="#fff"
										backgroundColor="#8bc34a"
										label={t('learn.buttons-continue')}
									/>
								</Link>
							}
							<Comments
								id={id}
								type={1}
								commentsType="userLesson"
								commentsCount={commentsCount}
							/>
						</Paper>
						<RelatedLessons
							id={id}
							userID={userID}
							userName={userName}
							implementations={implementations}
						/>
					</div>
				}
			</LessonLayout>
		);
	}
}

export default SlayLesson;
