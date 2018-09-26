import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { translate } from 'react-i18next';
import { sidebarQuestionsSelector, isDiscussSidebarEmpty } from 'reducers/discuss.reducer';
import QAIcon from 'material-ui/svg-icons/action/question-answer';
import { grey600 } from 'material-ui/styles/colors';
import SidebarShimmer from 'components/Shimmers/SidebarShimmer';
import 'styles/Discuss/DiscussSidebar.scss';

const mapStateToProps = state => ({
	items: sidebarQuestionsSelector(state),
	isEmpty: isDiscussSidebarEmpty(state),
});

const DiscussSidebar = ({ isEmpty, items, t }) => (
	<div style={{ padding: '15px 15px 0' }}>
		<div className="sidebar-title">
			<p className="title">{t('discuss.filter.hot-today')}</p>
		</div>
		{isEmpty
			? <SidebarShimmer noTitle />
			: items.map(question => (
				<Fragment key={question.id}>
					<p style={{ padding: '15px 0' }}>
						<Link
							to={`/discuss/${question.id}`}
							style={{
								display: 'flex', alignItems: 'center', color: grey600, fontSize: 15,
							}}
						>
							<QAIcon style={{ flexShrink: 0, paddingRight: 5 }} color={grey600} />
							{question.title}
						</Link>
					</p>
				</Fragment>
			))}
	</div>
);

export default connect(mapStateToProps)(translate()(DiscussSidebar));
