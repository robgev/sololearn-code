import React from 'react';
import PropTypes from 'prop-types';
import { Link, Container } from 'components/atoms';
import { TagLabel } from 'components/molecules';
import { removeDups } from 'utils';

const DiscussTags = ({ tags }) => (
	<Container className="discuss-tags-base">
		{
			// Need to remove duplicates due to old error in server
			removeDups(tags).map(tag => (
				<div key={tag} className="tag">
					<Link
						to={{ pathname: '/discuss', query: { query: tag } }}
						className="link"
					>
						{tag}
					</Link>
				</div>
			))
		}
	</Container>
);

DiscussTags.propTypes = {
	tags: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default DiscussTags;
