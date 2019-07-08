import React from 'react';
import { Popup, PopupTitle, PopupActions, Link } from 'components/atoms';
import { RaisedButton } from 'components/molecules';

const SignInPopup = ({ url, open, onClose }) => (
	<Popup open={open} onClose={onClose}>
		<PopupTitle>
            You must sing in
		</PopupTitle>
		<PopupActions>
			<Link to={`/signin?url=${url}`}>
				<RaisedButton onClick>
                Sign In
				</RaisedButton>
			</Link>
		</PopupActions>
	</Popup>
);

export default SignInPopup;
