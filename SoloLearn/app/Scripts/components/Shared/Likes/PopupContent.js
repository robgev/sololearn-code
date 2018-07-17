import React, { Component } from 'react';
import { translate } from 'react-i18next';
import Divider from 'material-ui/Divider';
import { Tabs, Tab } from 'material-ui/Tabs';
import CircularProgress from 'material-ui/CircularProgress';
import ProfileAvatar from 'components/Shared/ProfileAvatar';
import InfiniteScroll from 'react-infinite-scroller';
import './popupContent.scss';

const Like = ({ user }) => (
	<div>
		<div key={user.id} style={{ padding: 5 }}>
			<ProfileAvatar
				withTooltip
				userID={user.id}
				withUserNameBox
				level={user.level}
				badge={user.badge}
				userName={user.name}
				avatarUrl={user.avatarUrl}
				tooltipId={`likes-${user.id}`}
			/>
		</div>
		<Divider />
	</div>
);

class PopupContent extends Component {
	state = {
		hasMore: true,
	}

	loadMore = async () => {
		const length = await this.props.loadMore();
		if (length === 0) {
			this.setState({ hasMore: false });
		}
	}

	render() {
		const {
			t,
			likes,
			tabIndex,
			accessLevel,
			onTabChange,
		} = this.props;
		const { hasMore } = this.state;
		return (accessLevel > 2 ?
			<Tabs
				value={tabIndex}
				onChange={onTabChange}
			>
				<Tab label={t('upvotes.title')} value={0}>
					{likes.length === 0 && !hasMore ?
						<p>{t('common.empty-list-message')}</p> :
						<div className="popup-likes-height"> {/* need for infinite scroll parent component */}
							<InfiniteScroll
								useWindow={false}
								loadMore={this.loadMore}
								hasMore={hasMore}
								loader={<CircularProgress
									style={{ display: 'flex', alignItems: 'center', margin: 'auto' }}
									key="circular-progress"
									size={40}
								/>}
							>
								{likes.map(user => <Like key={user.id} user={user} />)}
							</InfiniteScroll>
						</div>
					}
				</Tab>
				<Tab label={t('downvotes.title')} value={1}>
					{likes.length === 0 && !hasMore ?
						<p>{t('common.empty-list-message')}</p> :
						<div className="popup-likes-height">
							<InfiniteScroll
								useWindow={false}
								loadMore={this.loadMore}
								hasMore={hasMore}
								loader={<CircularProgress
									style={{ display: 'flex', alignItems: 'center', margin: 'auto' }}
									key="circular-progress"
									size={40}
								/>}
							>
								{likes.map(user => <Like key={user.id} user={user} />)}
							</InfiniteScroll>
						</div>
					}
				</Tab>
			</Tabs> :
			likes.length === 0 && !hasMore ?
				<p>{t('common.empty-list-message')}</p > :
				<div className="popup-likes-height">
					<InfiniteScroll
						useWindow={false}
						loadMore={this.loadMore}
						hasMore={hasMore}
						loader={<CircularProgress
							style={{ display: 'flex', alignItems: 'center', margin: 'auto' }}
							key="circular-progress"
							size={40}
						/>}
					>
						{likes.map(user => <Like key={user.id} user={user} />)}
					</InfiniteScroll>
				</div >
		);
	}
}

export default translate()(PopupContent);
