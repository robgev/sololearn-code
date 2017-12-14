import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { slayItemTypes } from 'constants/ItemTypes';
import { getLesson, getCourseLesson } from 'actions/slay';
import BusyWrapper from 'components/Shared/BusyWrapper';
import LessonLayout from 'components/Layouts/LessonLayout';

import QuizText from './QuizText';

// import 'styles/slayHome.scss';

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

	render() {
		const { loading } = this.state;
		const { id, content, language } = this.props.activeLesson || {};
		return (
			<LessonLayout loading={loading}>
				{ !loading &&
					<QuizText
						type={1}
						quizId={id}
						textContent={content}
						courseLanguage={language}
					/>
				}
			</LessonLayout>
		);
	}
}

export default SlayLesson;
