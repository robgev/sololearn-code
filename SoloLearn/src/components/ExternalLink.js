import React from 'react';
import Linkify from 'react-linkify';

/* eslint-disable */

export const ExternalLink = props => <a target="_blank" rel="noopener noreferrer" {...props} />;

export const ExternalLinkify = props => 
  <Linkify properties={{ target: '_blank', rel: 'noopener noreferrer' }} {...props} />;

export default ExternalLink;
