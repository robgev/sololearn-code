import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import ProfileAvatar from 'components/ProfileAvatar';
import SidebarShimmer from 'components/Shimmers/SidebarShimmer';
import { numberFormatter } from 'utils';
import 'styles/Feed/FeedSidebar.scss';

const mapStateToProps = ({ discoverSuggestions }) => ({
	suggestions: discoverSuggestions,
});

const FeedSuggestions = ({ t, suggestions }) => (
	<div className="feed-sidebar-suggestions">
		<div className="sidebar-title">
			<p className="title">{t('discover_peers.title')}</p>
		</div>
		{suggestions === null
			? <SidebarShimmer round noTitle />
			: suggestions.slice(0, 7).map(({
				id, name, avatarUrl, followers, level,
			}) => (
				<div className="suggestion-container">
					<ProfileAvatar
						size={50}
						userID={id}
						userName={name}
						avatarUrl={avatarUrl}
						avatarStyle={{ marginRight: 10 }}
					/>
					<div className="user-info">
						<Link to={`/profile/${id}`} className="user-name hoverable">{name}</Link>
						<p className="user-meta-info">{numberFormatter(followers)} Followers | Level {level} </p>
					</div>
				</div>
			))}
		{ suggestions && suggestions.length > 0 &&
			<Link className="load-more" to="/discover">
				<FlatButton
					label={t('common.loadMore')}
					style={{
						height: 30,
						lineHeight: '30px',
					}}
				/>
			</Link>
		}
	</div>
);

export default connect(mapStateToProps)(FeedSuggestions);
