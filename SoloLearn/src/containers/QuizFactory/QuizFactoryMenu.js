import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { browserHistory } from 'react-router';
import {
	Popup, PopupContent, PopupActions, PopupTitle,
} from 'components/atoms';
import { FlatButton } from 'components/molecules';
import LanguageSelector from 'components/LanguageSelector';
import { OptionsCard } from './components';
import Layout from './Layout';
import Suggest from './Suggest/Suggest';
import { getReviewCourseIds } from './api';

class QuizFactory extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLanguageSelectorOpen: false,
			courseIds: [],
			suggestDialogOpen: false,
			courseIdsLoading: false,
		};
		document.title = 'Sololearn | Quiz Factory';
		this._isMounted = true;
	}
	async componentWillMount() {
		this.setState({ courseIdsLoading: true });
		const courseIds = await getReviewCourseIds();
		this.setState({ courseIdsLoading: false });
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
		const {
			isLanguageSelectorOpen, courseIds, suggestDialogOpen, courseIdsLoading,
		} = this.state;
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
					loading={courseIdsLoading}
				/>
				<Popup
					open={suggestDialogOpen}
					onClose={this.toggleSuggest}
				>
					<PopupTitle>{t('factory.quiz-create-title')}</PopupTitle>
					<PopupContent><Suggest /></PopupContent>
					<PopupActions>
						<FlatButton
							onClick={this.toggleSuggest}
							autoFocus
							primary
						>
							{t('common.cancel-title')}
						</FlatButton>
					</PopupActions>
				</Popup>
			</Layout>
		);
	}
}

export default translate()(QuizFactory);
