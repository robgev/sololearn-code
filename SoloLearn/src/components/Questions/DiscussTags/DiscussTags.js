import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { removeDups } from 'utils';
import './DiscussTags.scss';

const DiscussTags = ({ tags }) => (
	<div className="discuss-tags-base">
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
	</div>
);

DiscussTags.propTypes = {
	tags: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default DiscussTags;
