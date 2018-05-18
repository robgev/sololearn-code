import React from 'react';
import { translate } from 'react-i18next';
import Divider from 'material-ui/Divider';
import { Tabs, Tab } from 'material-ui/Tabs';
import ProfileAvatar from 'components/Shared/ProfileAvatar';
import InfiniteVirtualizedList from 'components/Shared/InfiniteVirtualizedList';

const 	renderOneLike = user => (
	<div>
		<div key={user.id} style={{ padding: 5 }}>
			<ProfileAvatar
				userID={user.id}
				withUserNameBox
				badge={user.badge}
				userName={user.name}
				avatarUrl={user.avatarUrl}
			/>
		</div>
		<Divider />
	</div>
);

const PopupContent = ({
	t,
	likes,
	getLikes,
	tabIndex,
	accessLevel,
	onTabChange,
	getDownvotes,
}) => (accessLevel > 2 ?
	<Tabs
		value={tabIndex}
		onChange={onTabChange}
	>
		<Tab label={t('upvotes.title')} value={0}>
			{ likes.length === 0 ?
				<p>{t('common.empty-list-message')}</p> :
				<InfiniteVirtualizedList
					list={likes}
					width={300}
					rowHeight={50}
					loadMore={getLikes}
					item={renderOneLike}
				/>
			}
		</Tab>
		<Tab label={t('downvotes.title')} value={1}>
			{ likes.length === 0 ?
				<p>{t('common.empty-list-message')}</p> :
				<InfiniteVirtualizedList
					list={likes}
					width={300}
					rowHeight={50}
					item={renderOneLike}
					loadMore={getDownvotes}
				/>
			}
		</Tab>
	</Tabs> :
	likes.length === 0 ?
		<p>{t('common.empty-list-message')}</p> :
		<InfiniteVirtualizedList
			list={likes}
			width={300}
			rowHeight={50}
			loadMore={getLikes}
			item={renderOneLike}
		/>);
export default translate()(PopupContent);
