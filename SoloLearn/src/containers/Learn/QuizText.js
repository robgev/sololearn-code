// React modules
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory, withRouter } from 'react-router';
import { translate } from 'react-i18next';

import Service from 'api/service';
import { toggleLessonBookmark } from 'actions/slay';
import { updateDate } from 'utils';
import Snackbar from 'material-ui/Snackbar';
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

@connect(null, { toggleLessonBookmark })
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
			snackbarOpened: false,
			isBookmarked: props.isBookmarked,
		};
	}

	toggleBookmark = async () => {
		const { activeLesson, itemType = 3 } = this.props;
		const { isBookmarked: bookmark } = this.state;
		const isBookmarked =
			await this.props.toggleLessonBookmark({ activeLesson, type: itemType, bookmark: !bookmark });
		this.setState({ isBookmarked, snackbarOpened: true });
	}

	handleSnackBarClose = (reason) => {
		if (reason !== 'clickaway') {
			this.setState({ snackbarOpened: false });
		}
	}

	render() {
		const { basePath, isBookmarked, snackbarOpened } = this.state;
		const {
			t,
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
				<Snackbar
					open={snackbarOpened}
					autoHideDuration={1500}
					onRequestClose={this.handleSnackbarClose}
					message={isBookmarked ? t('lesson.bookmark-added') : t('lesson.bookmark-removed')}
				/>
			</div>
		);
	}
}

export default withRouter(translate()(QuizText));
