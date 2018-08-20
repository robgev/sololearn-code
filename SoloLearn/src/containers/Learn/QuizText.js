// React modules
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { translate } from 'react-i18next';

import Service from 'api/service';
import { updateDate } from 'utils';
import SlayLessonToolbar from './SlayLessonToolbar';
import Parser from './Parser';

const styles = {
	textContainer: {
		width: '100%',
		marginBottom: 10,
		overflow: 'hidden',
	},
};

class QuizText extends Component {
	constructor(props) {
		super(props);
		const { pathname } = browserHistory.getCurrentLocation();
		this.state = {
			pathname,
			isBookmarked: props.isBookmarked,
		};
	}

	toggleBookmark = async () => {
		const { quizId: id, type } = this.props;
		const { isBookmarked: bookmark } = this.state;
		const { isBookmarked } =
			await Service.request('/BookmarkLesson', { id, type, bookmark: !bookmark });
		this.setState({ isBookmarked });
	}

	render() {
		const { pathname, isBookmarked } = this.state;
		const {
			date,
			quizId,
			userData,
			withToolbar,
			courseLanguage,
		} = this.props;
		return (
			<div className="text-container" style={styles.textContainer}>
				<Parser
					pathname={pathname}
					courseLanguage={courseLanguage}
					text={this.props.textContent}
					glossary={this.props.glossary}
				/>
				{withToolbar &&
					<SlayLessonToolbar
						id={quizId}
						userData={userData}
						isBookmarked={isBookmarked}
						timePassed={updateDate(date)}
						toggleBookmark={this.toggleBookmark}
					/>
    		}
			</div>
		);
	}
}

export default translate()(QuizText);
