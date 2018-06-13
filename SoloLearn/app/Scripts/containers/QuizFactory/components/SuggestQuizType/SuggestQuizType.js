import React from 'react';
import PropTypes from 'prop-types';

import { ListItem, Divider } from 'material-ui';

const SuggestQuizType = ({ text, icon, divider }) => (
	<div>
		<ListItem primaryText={text} leftIcon={<img src={icon} alt="" />} />
		{divider ? <Divider inset /> : null}
	</div>
);

SuggestQuizType.defaultProps = {
	divider: true,
};

SuggestQuizType.propTypes = {
	text: PropTypes.string.isRequired,
	icon: PropTypes.string.isRequired,
	divider: PropTypes.bool,
};

export default SuggestQuizType;
