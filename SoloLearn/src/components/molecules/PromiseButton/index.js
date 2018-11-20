import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import Async from 'components/Async';
import FlatButton from '../FlatButton';
import RaisedButton from '../RaisedButton';

const PromiseButton = ({
	t, fire, raised, children, mouseDown, ...props
}) => {
	const Button = raised ? RaisedButton : FlatButton;
	return (
		<Async fire={fire}>
			{({ fire: _fire, pending }) => (
				<Button
					disabled={pending}
					{...(mouseDown
						? { onMouseDown: _fire }
						: { onClick: _fire })
					}
					{...props}
				>
					{pending ? t('common.loading') : children}
				</Button>
			)}
		</Async>
	);
};

PromiseButton.propTypes = {
	fire: PropTypes.func.isRequired,
	raised: PropTypes.bool,
	mouseDown: PropTypes.bool,
};

PromiseButton.defaultProps = {
	raised: false,
	mouseDown: false,
};

export default translate()(PromiseButton);
