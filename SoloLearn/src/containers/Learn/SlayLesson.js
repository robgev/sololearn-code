import React, { PureComponent } from 'react';
import ReactGA from 'react-ga';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { translate } from 'react-i18next';

import { toSeoFriendly } from 'utils';
import Comments from 'containers/Comments/CommentsBase';
import { PaperContainer, Container, Loading } from 'components/atoms';
import { ContainerLink, LayoutWithSidebar, RaisedButton } from 'components/molecules';

import Service from 'api/service';
import {
	getLesson,
	getCourseLesson,
	getLessonsByAuthor,
} from 'actions/slay';

import RelatedLessons from './components/RelatedLessons';
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
		const { id } = this.props.activeLesson;
		const { count } = await Service.request('Discussion/GetUserLessonCommentCount', { lessonId: id });
		return count;
	}

	loadLesson = async (lessonId) => {
		const { getCourseLesson, getLesson } = this.props;
		const {
			itemType = 1,
		} = this.props.params;
		this.setState({ loading: true });
		switch (itemType) {
		case 'course-lesson': {
			await getCourseLesson(lessonId);
			await this.getLessonsByAuthor();
			const commentsCount = await this.loadCommentsCount();
			this.setState({ loading: false, commentsCount });
			break;
		}
		case 'user-lesson': {
			await getLesson(lessonId);
			await this.getLessonsByAuthor();
			const commentsCount = await this.loadCommentsCount();
			this.setState({ loading: false, commentsCount });
			break;
		}
		default:
			break;
		}
		const { name } = this.props.activeLesson;
		document.title = `${name}`;
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
			name,
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
			id: userID,
		};
		return loading
			? <Loading />
			: (
				<LayoutWithSidebar
					sidebar={
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
					<Container style={{ width: '100%' }}>
						<PaperContainer style={{ padding: 15 }}>
							<SlayLessonContent
								t={t}
								date={date}
								type={type}
								name={name}
								parts={parts}
								withAuthorInfo
								userData={userData}
								itemType={itemType}
								textContent={content}
								pageNumber={pageNumber}
								activeLesson={activeLesson}
								courseLanguage={language}
								commentsCount={comments}
								isBookmarked={isBookmarked}
							/>
							{nextLesson &&
								<ContainerLink to={`/learn/lesson/${nextLesson.itemType === 3 ? 'course-lesson' : 'user-lesson'}/${nextLesson.id}/${toSeoFriendly(nextLesson.name, 100)}/1`}>
									<RaisedButton
										labelColor="#fff"
										backgroundColor="#8bc34a"
									>
										{t('learn.buttons-continue')}
									</RaisedButton>
								</ContainerLink>
							}
							<Comments
								id={id}
								type={1}
								commentsType="userLesson"
								commentsCount={commentsCount}
							/>
						</PaperContainer>
						<RelatedLessons
							id={id}
							userID={userID}
							userName={userName}
							implementations={implementations}
						/>
					</Container>
					}
				</LayoutWithSidebar>
			);
	}
}

export default SlayLesson;
