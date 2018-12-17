import React, { PureComponent, Fragment } from 'react';
import ReactGA from 'react-ga';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { browserHistory } from 'react-router';

import { toSeoFriendly } from 'utils';
import Comments from 'containers/Comments/CommentsBase';
import { PaperContainer, Container, FlexBox } from 'components/atoms';
import { ContainerLink, LayoutWithSidebar, RaisedButton, EmptyCard } from 'components/molecules';

import Service from 'api/service';
import {
	getLesson,
	getCourseLesson,
	getLessonsByAuthor,
} from 'actions/slay';

import RelatedLessons from './components/RelatedLessons';
import SlayLessonContent from './SlayLessonContent';

import './SlayLesson.scss';

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
			loading: false,
			commentsCount: null,
		};
	}

	componentWillMount() {
		const { lessonId } = this.props.params;
		this.loadLesson(lessonId);
	}

	async componentWillReceiveProps(newProps) {
		const { params: newParams } = newProps;
		const { params } = this.props;
		if (newParams.lessonId !== params.lessonId) {
			this.loadLesson(newParams.lessonId);
		} else if (newParams.pageNumber !== params.pageNumber) {
			this.setState({ commentsCount: null });
			this.loadCommentsCount();
		}
	}

	loadCommentsCount = async () => {
		switch (this.props.params.itemType) {
		case 'course-lesson':
			this.setState({ commentsCount: await this.loadCourseLessonCommentsCount() });
			break;
		case 'user-lesson':
			this.setState({ commentsCount: await this.loadUserLessonCommentsCount() });
			break;
		default:
			throw new Error('Could not find lesson type');
		}
	}

	loadUserLessonCommentsCount = async () => {
		const { id } = this.props.activeLesson;
		const { count } = await Service.request('Discussion/GetUserLessonCommentCount', { lessonId: id });
		return count;
	}

	loadCourseLessonCommentsCount = async () => {
		const { id } = this.props.activeLesson.parts[this.props.params.pageNumber - 1];
		const { count } = await Service.request('Discussion/GetLessonCommentCount', { quizId: id });
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
			this.setState({ loading: false });
			break;
		}
		case 'user-lesson': {
			await getLesson(lessonId);
			await this.getLessonsByAuthor();
			this.setState({ loading: false });
			break;
		}
		default:
			break;
		}
		const { name } = this.props.activeLesson;
		this.loadCommentsCount();
		document.title = `${name}`;
		if (this.props.activeLesson.parts) {
			ReactGA.ga('send', 'screenView', { screenName: 'Course Lesson Lesson Page' });
		} else {
			ReactGA.ga('send', 'screenView', { screenName: 'Lesson Page' });
		}
	}

	getCommentsId = () => {
		const { params, activeLesson } = this.props;
		switch (params.itemType) {
		case 'course-lesson':
			return activeLesson.parts[params.pageNumber - 1].id;
		case 'user-lesson':
			return activeLesson.id;
		default:
			throw new Error('Unkown lesson type');
		}
	}

	getCommentsType = () => {
		switch (this.props.params.itemType) {
		case 'course-lesson':
			return 'lesson';
		case 'user-lesson':
			return 'userLesson';
		default:
			throw new Error('Unkown lesson type');
		}
	}

	getLessonsByAuthor = async () => {
		const { activeLesson, getLessonsByAuthor } = this.props;
		const { id, userID } = activeLesson;
		await getLessonsByAuthor(id, userID, { index: 0, count: 10 });
	}

	goToNextLesson = () => {
		const {activeLesson, params} = this.props;
		const {pageNumber} = params;
		const {id, name, parts, nextLesson} = activeLesson;
		const url = `/learn/lesson/${nextLesson.itemType === 3 ? 'course-lesson' : 'user-lesson'}`;
		if (parts && pageNumber < parts.length) {
			browserHistory.push(`${url}/${this.props.activeLesson.id}/${toSeoFriendly(this.props.activeLesson.name, 100)}/${Number(pageNumber)+1}`);
		} else {
			browserHistory.push(`${url}/${nextLesson.id}/${toSeoFriendly(nextLesson.name, 100)}/1`);
		}
	}

	handleStepClick = (index) => {
		const { params, activeLesson } = this.props; 
		const url = `/learn/lesson/${params.itemType}`;
		browserHistory.push(`${url}/${activeLesson.id}/${toSeoFriendly(activeLesson.name, 100)}/${Number(index)+1}`);
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
		} = activeLesson || {};
		const userData = {
			level,
			badge,
			userID,
			avatarUrl,
			name: userName,
			id: userID,
		};
		const hasNext = loading ? false : parts && pageNumber < parts.length || nextLesson;
		return (
			<LayoutWithSidebar
				sidebar={loading
					? <EmptyCard loading />
					:
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
				<Container>
					{loading
						? <EmptyCard loading paper />
						: (
							<Fragment>
								<PaperContainer>
									<FlexBox column fullWidth className="slay-lesson-container">
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
											handleStepClick={this.handleStepClick}
										/>
										{hasNext &&
											<RaisedButton 
												color="secondary"
												onClick={this.goToNextLesson}
											>
												{t('learn.buttons-continue')}
											</RaisedButton>
										}
									</FlexBox>
								</PaperContainer>
								{commentsCount !== null &&
									<Comments
										key={this.getCommentsId()}
										id={this.getCommentsId()}
										type={1}
										commentsType={this.getCommentsType()}
										commentsCount={commentsCount}
									/>
								}
							</Fragment>
						)
					}

				</Container>
			</LayoutWithSidebar>
		);
	}
}

export default SlayLesson;
