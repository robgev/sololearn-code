import React from 'react';
import RLinkify from 'react-linkify';

import './styles.scss';

/* eslint-disable */

export const Linkify = props =>
  <RLinkify properties={{ target: '_blank', rel: 'noopener noreferrer', className: "molecule_ref-link atom_link" }} {...props} />;

export default Linkify;
