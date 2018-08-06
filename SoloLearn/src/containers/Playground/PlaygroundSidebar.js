import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { translate } from 'react-i18next';
import { sidebarCodesSelector } from 'reducers/codes.reducer';

import CodeItem from './CodeItem';

const mapStateToProps = state => ({
	sidebarItems: sidebarCodesSelector(state),
});

const PlaygroundSidebar = ({ t, sidebarItems }) => (
	<div className="feed-sidebar-suggestions">
		<div className="sidebar-title">
			<p className="title">{t('code.filter.my-codes')}</p>
		</div>
		{sidebarItems.map(code => <CodeItem key={code.id} code={code} />)}
	</div>
);

export default connect(mapStateToProps)(translate()(PlaygroundSidebar));
