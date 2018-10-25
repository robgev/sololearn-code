import React from 'react';
import Linkify from 'react-linkify';

const style = { color: '#607D8B' };

/* eslint-disable */

export const ExternalLink = props => <a style={style} target="_blank" rel="noopener noreferrer" {...props} />;

export const ExternalLinkify = props => 
  <Linkify properties={{ target: '_blank', rel: 'noopener noreferrer', style }} {...props} />;

export default ExternalLink;
