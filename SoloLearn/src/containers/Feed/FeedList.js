// General modules
import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { observer } from 'mobx-react';
import { connect } from 'react-redux';

// Material UI components
import Dialog from 'material-ui/Dialog';

// Utils and defaults
import types from 'defaults/appTypes';
import InfiniteScroll from 'components/InfiniteScroll';
import FeedShimmer from 'components/Shimmers/FeedShimmer';

import 'styles/Feed/FeedList.scss';

import FeedPin from './FeedPin';
import FeedItem from './FeedItem';
import CoursePopup from './CoursePopup';

const mapStateToProps = state => ({
	skills: state.userProfile.skills,
	courses: state.courses,
});

@translate()
@connect(mapStateToProps)
@observer
class FeedList extends Component {
	state = {
		courseId: null,
		coursePopupOpen: false,
	}

	toggleCoursePopup = (courseId = null) => {
		this.setState(state => ({ coursePopupOpen: !state.coursePopupOpen, courseId }));
	}

	render() {
		const {
			t,
			feed,
			skills,
			courses,
			hasMore,
			feedPins,
			loadMore,
			header = null,
		} = this.props;
		const { coursePopupOpen, courseId } = this.state;
		return (
			<div>
				{
					feed.length === 0 && !hasMore
						? <p style={{ textAlign: 'center', height: 120 }}>No Activity</p>
						:
						(
							<div>
								{
									feed.length === 0 &&
									<div style={{ height: '90vh', overflow: 'hidden' }}>
										{header}
										<FeedShimmer />
									</div>
								}
								{
									(feedPins && feedPins.length > 0) && (
										<div>
											<div className="feed-pins">
												{feedPins.map(pin => (
													<FeedPin
														pin={pin}
														key={`pin${pin.id}`}
														openCoursePopup={this.toggleCoursePopup}
													/>
												))}
											</div>
											<p className="sub-title" style={{ paddingTop: 5 }} key="separator">{t('feed.most-recent-title')}</p>
										</div>
									)
								}
								<InfiniteScroll
									element="div"
									hasMore={hasMore}
									loadMore={loadMore}
									header={feed.length !== 0 ? header : null}
									style={{
										display: 'flex',
										flexDirection: 'column',
									}}
								>
									{feed.map(feedItem => (
										<FeedItem
											key={feedItem.type === types.mergedChallange ?
												`feedGroup${feedItem.toId}` :
												`feedItem${feedItem.id}`}
											feedItem={feedItem}
											openCoursePopup={this.toggleCoursePopup}
										/>
									))}
								</InfiniteScroll>
								<Dialog
									open={coursePopupOpen}
									bodyStyle={{ padding: 15 }}
									onRequestClose={this.toggleCoursePopup}
								>
									<CoursePopup
										t={t}
										skills={skills}
										courses={courses}
										courseId={courseId}
									/>
								</Dialog>
							</div>
						)
				}
			</div>
		);
	}
}
export default FeedList;
