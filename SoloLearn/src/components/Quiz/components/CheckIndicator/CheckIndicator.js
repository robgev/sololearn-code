import React from 'react';
import PropTypes from 'prop-types';
import Localize from 'components/Localize';
import Paper from 'material-ui/Paper';
import Done from 'material-ui/svg-icons/action/done';
import Clear from 'material-ui/svg-icons/content/clear';
import { red500, green500 } from 'material-ui/styles/colors';
import './CheckIndicator.scss';

const CheckIndicator = ({ status }) => (status !== null ? (
	<Localize>
		{({ t }) => (
			<Paper className="check-indicator">
				{status ? <Done color={green500} /> : <Clear color={red500} />}
				<span>{status ? t('play.answers.correct-answer') : t('play.answers.wrong-answer')}</span>
			</Paper>
		)}
	</Localize>
) : null);

CheckIndicator.defaultProps = {
	status: null,
};

CheckIndicator.propTypes = {
	status: PropTypes.bool,
};

export default CheckIndicator;
