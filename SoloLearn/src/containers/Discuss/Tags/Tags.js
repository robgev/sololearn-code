import React from 'react';
import PropTypes from 'prop-types';
import { removeDups } from 'utils';
import Tag from './Tag';

const Tags = ({ tags }) => (
	// Need to remove duplicates due to old error in server
	removeDups(tags).map(tag => (
		<Tag key={tag} tag={tag} />
	))
);

Tags.propTypes = {
	tags: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Tags;
