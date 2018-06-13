import React from 'react';
import { translate } from 'react-i18next';
import Layout from 'components/Layouts/GeneralLayout';
import OptionsCard from './OptionsCard';

const QuizFactory = ({ t }) => (
	<Layout>
		<OptionsCard
			header={t('factory.suggest_quiz')}
			image="assets/start_submission.png"
			info={t('factory.suggest_quiz_description')}
			to="/quiz-factory/suggest"
		/>
		<OptionsCard
			header={t('factory.rate_submissions')}
			image="assets/rate_submission.png"
			info={t('factory.rate_submissions_description')}
			to="/quiz-factory/rate"
		/>
		<OptionsCard
			header={t('factory.my_submissions')}
			image="assets/your_submissions.png"
			info={t('factory.my_submissions_description')}
			to="/quiz-factory/my-submissions"
		/>
	</Layout>
);

export default translate()(QuizFactory);
