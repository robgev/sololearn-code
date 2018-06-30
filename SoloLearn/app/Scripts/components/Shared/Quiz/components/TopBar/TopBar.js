import React from 'react';
import PropTypes from 'prop-types';
import { Paper, FlatButton } from 'material-ui';
import { translate } from 'react-i18next';
import ConditionalPaper from '../ConditionalPaper';

import './TopBar.scss';

const TopBar = ({
	onUnlock, onHint, hintable, t, disabled, isPaper,
}) => (
	<ConditionalPaper isPaper={isPaper} className="bar">
		{hintable && <FlatButton
			disabled={disabled}
			onClick={onHint}
			label={t('learn.buttons-hint-answer')}
		/>}
		<FlatButton
			disabled={disabled}
			onClick={onUnlock}
			label={t('learn.buttons-unlock-answer')}
		/>
	</ConditionalPaper>
);

TopBar.defaultProps = {
	onHint: () => { }, // noop
	hintable: false,
	disabled: false,
};

TopBar.propTypes = {
	onUnlock: PropTypes.func.isRequired,
	onHint: PropTypes.func,
	hintable: PropTypes.bool,
	disabled: PropTypes.bool,
};

export default translate()(TopBar);
