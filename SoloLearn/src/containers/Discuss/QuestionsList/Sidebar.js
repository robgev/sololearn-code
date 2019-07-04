import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { sidebarQuestionsSelector, isDiscussSidebarEmpty } from 'reducers/discuss.reducer';
import { FlexBox } from 'components/atoms';
import ProfileInfo from 'containers/Feed/FeedSidebar/ProfileInfo';
import HotToday from './HotToday';
import './styles.scss';

const mapStateToProps = state => ({
	questions: sidebarQuestionsSelector(state),
	isEmpty: isDiscussSidebarEmpty(state),
	userProfile: state.userProfile,
	levels: state.levels,
});

const DiscussSidebar = ({
	isEmpty, questions, t, userProfile, levels,
}) => (
	<FlexBox column justify className="discuss-sidebar">
		{userProfile && <ProfileInfo profile={userProfile} levels={levels} />}
		<HotToday isEmpty={isEmpty} questions={questions} t={t} />
	</FlexBox>
);

export default connect(mapStateToProps)(translate()(DiscussSidebar));
