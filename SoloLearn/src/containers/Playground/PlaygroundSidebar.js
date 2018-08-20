import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Link } from 'react-router';
import { sidebarCodesSelector } from 'reducers/codes.reducer';

import CodeItem from './CodeItem';

const mapStateToProps = state => ({
	userID: state.userProfile.id,
	sidebarItems: sidebarCodesSelector(state),
});

const PlaygroundSidebar = ({ t, sidebarItems, userID }) => (
	<div className="feed-sidebar-suggestions">
		<div className="sidebar-title">
			<p className="title">{t('code.filter.my-codes')}</p>
		</div>
		{sidebarItems.map(code => <CodeItem key={code.id} code={code} />)}
		<div style={{ color: 'rgba(0, 0, 0, .87)' }}>
			<Link className="load-more-button" to={`/profile/${userID}/codes`} >
				{t('common.loadMore')}
			</Link>
		</div>
	</div>
);

export default connect(mapStateToProps)(translate()(PlaygroundSidebar));
