// React modules
import React, { Component } from 'react';
import { browserHistory, withRouter } from 'react-router';
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

const constructBasePathname = (pathname, params) => {
	if (params.primary || params.secondary) {
		return pathname.replace(new RegExp(`/${params.primary}/${params.secondary}$`), '');
	}
	return pathname;
};

class QuizText extends Component {
	constructor(props) {
		super(props);
		const { pathname } = props.location;
		const basePath = constructBasePathname(pathname, props.params);
		if (pathname !== basePath) {
			browserHistory.replace(basePath);
		}
		this.state = {
			basePath,
			isBookmarked: props.isBookmarked,
		};
	}

	toggleBookmark = async () => {
		const { lessonId: id, itemType = 3 } = this.props;
		const { isBookmarked: bookmark } = this.state;
		const { isBookmarked } =
			await Service.request('BookmarkLesson', { id, type: itemType, bookmark: !bookmark });
		this.setState({ isBookmarked });
	}

	render() {
		const { basePath, isBookmarked } = this.state;
		const {
			date,
			quizId,
			userData,
			withAuthorInfo,
			courseLanguage,
		} = this.props;
		return (
			<div className="text-container" style={styles.textContainer}>
				<Parser
					basePath={basePath}
					courseLanguage={courseLanguage}
					text={this.props.textContent}
					glossary={this.props.glossary}
				/>
				<SlayLessonToolbar
					id={quizId}
					userData={userData}
					isBookmarked={isBookmarked}
					timePassed={updateDate(date)}
					withAuthorInfo={withAuthorInfo}
					toggleBookmark={this.toggleBookmark}
				/>
			</div>
		);
	}
}

export default withRouter(translate()(QuizText));
