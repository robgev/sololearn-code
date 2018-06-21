import React from 'react';
import PropTypes from 'prop-types';
import { Paper, FlatButton } from 'material-ui';
import { translate } from 'react-i18next';

import './TopBar.scss';

const TopBar = ({
	onUnlock, onHint, hintable, t,
}) => (
	<Paper>
		{hintable && <FlatButton onClick={onHint} label={t('learn.buttons-hint-answer')} />}
		<FlatButton onClick={onUnlock} label={t('learn.buttons-unlock-answer')} />
	</Paper>
);

TopBar.defaultProps = {
	onHint: () => { }, // noop
	hintable: false,
};

TopBar.propTypes = {
	onUnlock: PropTypes.func.isRequired,
	onHint: PropTypes.func,
	hintable: PropTypes.bool,
};

export default translate()(TopBar);
