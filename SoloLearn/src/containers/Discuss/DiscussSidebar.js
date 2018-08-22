import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { translate } from 'react-i18next';
import { sidebarQuestionsSelector } from 'reducers/discuss.reducer';
import Divider from 'material-ui/Divider';
import 'styles/Discuss/DiscussSidebar.scss';

const mapStateToProps = state => ({
	items: sidebarQuestionsSelector(state),
});

const DiscussSidebar = ({ items, t }) => (
	<div style={{ padding: '15px 15px 0' }}>
		<div className="sidebar-title">
			<p className="title">{t('discuss.filter.hot-today')}</p>
		</div>
		{items.map((question, idx) => (
			<Fragment key={question.id}>
				<p style={{ padding: '15px 0' }}>
					<Link
						to={`/discuss/${question.id}`}
						style={{ color: '#636060', fontSize: 15 }}
					>
						{question.title}
					</Link>
				</p>
				{idx !== items.length - 1 && <Divider />}
			</Fragment>
		))}
	</div>
);

export default connect(mapStateToProps)(translate()(DiscussSidebar));
