import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Link } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import { sidebarCodesSelector } from 'reducers/codes.reducer';
import SidebarShimmer from 'components/Shimmers/SidebarShimmer';
import AddCodeButton from 'components/AddCodeButton';

import { CodeItem } from './components';

const mapStateToProps = state => ({
	userID: state.userProfile.id,
	sidebarItems: sidebarCodesSelector(state),
});

const PlaygroundSidebar = ({ t, sidebarItems, userID }) => (
	<div style={{ padding: 15 }} >
		<div className="sidebar-title">
			<p className="title">{t('code.filter.my-codes')}</p>
		</div>
		{sidebarItems === null
			? <SidebarShimmer round noTitle />
			:	sidebarItems.length === 0
				?	(
					<div style={{ padding: '15px 0' }} className="flex-centered column">
						<p style={{ textTransform: 'capitalize', paddingBottom: 5 }}>{t('code.no-saved-code-title')}</p>
						<p style={{ fontSize: 11, color: '#78909c', paddingBottom: 5 }}>{t('code.no-saved-code-message')}</p>
						<AddCodeButton>
							{({ togglePopup }) =>
								(<RaisedButton
									secondary
									onClick={togglePopup}
									label={t('code.no-saved-code-action-title')}
								/>)
							}
						</AddCodeButton>
					</div>
				)
				: sidebarItems.map(code => <CodeItem key={code.id} code={code} />)
		}
		{ sidebarItems && sidebarItems.length > 0 &&
			<div style={{ color: 'rgba(0, 0, 0, .87)' }}>
				<Link className="load-more-button" to={`/profile/${userID}/codes`} >
					{t('common.loadMore')}
				</Link>
			</div>
		}
	</div>
);

export default connect(mapStateToProps)(translate()(PlaygroundSidebar));
