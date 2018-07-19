import React from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import { translate } from 'react-i18next';

import './TopBar.scss';

const TopBar = ({
	onUnlock, onHint, hintable, t, disabled,
}) => (
	<div className="bar">
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
	</div>
);

TopBar.defaultProps = {
	onHint: () => { }, // noop
	hintable: false,
};

TopBar.propTypes = {
	onUnlock: PropTypes.func.isRequired,
	disabled: PropTypes.bool.isRequired,
	onHint: PropTypes.func,
	hintable: PropTypes.bool,
};

export default translate()(TopBar);
