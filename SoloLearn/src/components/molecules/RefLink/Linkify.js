import React from 'react';
import RLinkify from 'linkifyjs/react';

import './styles.scss';

const replaceSoloLinks = value => value.replace(/code.sololearn.com/, 'beta.sololearn.com/playground')
	.replace(/www.sololearn.com/, 'beta.sololearn.com');

export const Linkify = props =>
	(<RLinkify

		options={{
			attributes: {
				rel: 'noopener noreferrer',
			},
			target: '_blank',
			className: 'molecule_ref-link atom_link',
			validate: {
				url: value => !/^\/\//.test(value), // prevent comments (//comment) from becoming link
			},
			format: {
				url: replaceSoloLinks,
			},
			formatHref: {
				url: replaceSoloLinks,
			},

		}}
		{...props}

	/>);

export default Linkify;
