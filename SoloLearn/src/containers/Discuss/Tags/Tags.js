import React from 'react';
import PropTypes from 'prop-types';
import { FlexBox } from 'components/atoms';
import { removeDups } from 'utils';
import Tag from './Tag';
import './styles.scss';

// Need to remove duplicates due to old error in server
const Tags = ({ tags }) => (
	<FlexBox className="discuss_tags">
		{
			removeDups(tags).map(tag => (
				<Tag key={tag} tag={tag} />
			))
		}
	</FlexBox>
);

Tags.propTypes = {
	tags: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Tags;
