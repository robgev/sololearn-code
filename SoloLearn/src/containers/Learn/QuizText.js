// React modules
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory, withRouter } from 'react-router';
import { translate } from 'react-i18next';

import { toggleLessonBookmark } from 'actions/slay';
import { updateDate } from 'utils';
// import Snackbar from 'material-ui/Snackbar';
import SlayLessonToolbar from './SlayLessonToolbar';
import { Parser } from './components';
import { Container, Snackbar } from 'components/atoms';

const styles = {
	textContainer: {
		width: '100%',
		marginBottom: 10,
		overflow: 'hidden',
	},
};

@translate()
@connect(null, { toggleLessonBookmark })
class QuizText extends Component {
	constructor(props) {
		super(props);
		this.state = {
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
		// if (reason !== 'clickaway') {
		this.setState({ snackbarOpened: false });
		// }
	}

	render() {
		const { isBookmarked, snackbarOpened } = this.state;
		const {
			t,
			date,
			quizId,
			userData,
			withAuthorInfo,
			courseLanguage,
			textContent,
		} = this.props;
		return (
			<Container className="text-container" style={styles.textContainer}>
				<Parser
					courseLanguage={courseLanguage}
					text={textContent}
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
					onClose={this.handleSnackBarClose}
					message={isBookmarked ? t('lesson.bookmark-added') : t('lesson.bookmark-removed')}
				/>
			</Container>
		);
	}
}

export default QuizText;
