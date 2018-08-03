import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import ProfileAvatar from 'components/ProfileAvatar';
import { followSuggestion } from 'actions/discover';
import { numberFormatter } from 'utils';
import 'styles/Feed/FeedSidebar.scss';

const mapStateToProps = ({ discoverSuggestions }) => ({
	suggestions: discoverSuggestions,
});

const FeedSuggestions = ({ t, suggestions, followUser }) => (
	<div className="feed-sidebar-suggestions">
		<div className="sidebar-title">
			<p className="title">{t('discover_peers.title')}</p>
		</div>
		{suggestions.map(({
			id, name, avatarUrl, followers, level, isFollowing,
		}) => (
			<div className="suggestion-container">
				<ProfileAvatar
					size={50}
					userID={id}
					userName={name}
					avatarUrl={avatarUrl}
				/>
				<div className="user-info">
					<Link to={`/profile/${id}`} className="user-name hoverable">{name}</Link>
					<p className="user-meta-info">{numberFormatter(followers)} Followers | Level {level} </p>
					<FlatButton
						secondary={isFollowing}
						label={isFollowing ? 'Following' : 'Follow'}
						style={{
							height: 30,
							width: '60%',
							lineHeight: '30px',
							border: '1px solid #EFEFEF',
						}}
						onClick={() => followUser({ id, isFollowing })}
					/>
				</div>
			</div>
		))}
	</div>
);

export default connect(mapStateToProps, { followUser: followSuggestion })(FeedSuggestions);
