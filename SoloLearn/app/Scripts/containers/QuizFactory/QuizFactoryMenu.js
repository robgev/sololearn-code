import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { browserHistory } from 'react-router';

import Layout from 'components/Layouts/GeneralLayout';
import LanguageSelector from 'components/Shared/LanguageSelector';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { OptionsCard } from './components';
import Suggest from './Suggest/Suggest';
import { getReviewCourseIds } from './api';

class QuizFactory extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLanguageSelectorOpen: false,
			courseIds: [],
			suggestDialogOpen: false,
		};
		document.title = 'Sololearn | Quiz Factory';
		this._isMounted = true;
	}
	async componentWillMount() {
		const courseIds = await getReviewCourseIds();
		if (this._isMounted) {
			this.setState({ courseIds });
		}
	}
	componentWillUnmount() {
		this._isMounted = false;
	}
	toggleLanguageSelector = () => {
		this.setState(state => ({ isLanguageSelectorOpen: !state.isLanguageSelectorOpen }));
	}
	selectLanguage = (language) => {
		browserHistory.push(`/quiz-factory/rate/${language.id}`);
	}
	toggleSuggest = () => {
		this.setState(state => ({ suggestDialogOpen: !state.suggestDialogOpen }));
	}
	render() {
		const { isLanguageSelectorOpen, courseIds, suggestDialogOpen } = this.state;
		const { t } = this.props;
		return (
			<Layout>
				<OptionsCard
					header={t('factory.suggest_quiz')}
					image="/assets/start_submission.png"
					info={t('factory.suggest_quiz_description')}
					to="/quiz-factory/suggest"
					onClick={this.toggleSuggest}
				/>
				<OptionsCard
					header={t('factory.rate_submissions')}
					image="/assets/rate_submission.png"
					info={t('factory.rate_submissions_description')}
					to="/quiz-factory/rate"
					onClick={this.toggleLanguageSelector}
				/>
				<OptionsCard
					header={t('factory.my_submissions')}
					image="/assets/your_submissions.png"
					info={t('factory.my_submissions_description')}
					to="/quiz-factory/my-submissions"
				/>
				<LanguageSelector
					open={isLanguageSelectorOpen}
					onClose={this.toggleLanguageSelector}
					onChoose={this.selectLanguage}
					filter={course => courseIds.includes(course.id)}
				/>
				<Dialog
					open={suggestDialogOpen}
					title="Submit a New Quiz"
					onRequestClose={this.toggleSuggest}
					actions={[ <FlatButton label="Cancel" onClick={this.toggleSuggest} primary /> ]}
				>
					<Suggest />
				</Dialog>
			</Layout>
		);
	}
}

export default translate()(QuizFactory);
