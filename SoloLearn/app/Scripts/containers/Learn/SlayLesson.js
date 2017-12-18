import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { slayItemTypes } from 'constants/ItemTypes';
import { getLesson, getCourseLesson } from 'actions/slay';
import Comments from 'containers/Comments/CommentsBase';
import LessonLayout from 'components/Layouts/LessonLayout';

import QuizText from './QuizText';

const mapStateToProps = state => ({
	activeLesson: state.slay.activeLesson,
});

const mapDispatchToProps = { getLesson, getCourseLesson };

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
			this.setState({ loading: false });
			break;
		case slayItemTypes.slayLesson:
			await getLesson(lessonId);
			this.setState({ loading: false });
			break;
		default:
			break;
		}
	}

	toggleComments = async () => {
		this.setState({ commentsOpened: !this.state.commentsOpened });
	}

	render() {
		const { loading, commentsOpened } = this.state;
		const {
			id,
			type,
			userID,
			content,
			language,
			comments,
			userName,
			avatarUrl,
			isBookmarked,
		} = this.props.activeLesson || {};
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
					</div>
				}
			</LessonLayout>
		);
	}
}

export default SlayLesson;
