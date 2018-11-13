// General modules
import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { observer } from 'mobx-react';
import { connect } from 'react-redux';

// Material UI components
import Dialog from 'components/StyledDialog';

// Utils and defaults
import types from 'defaults/appTypes';
import FeedShimmer from 'components/Shimmers/FeedShimmer';
import FeedPin from './FeedPin';
import FeedItem from './FeedItem';
import {
	Container,
	Title,
	Popup,
	PopupContent,
} from 'components/atoms';
import { InfiniteScroll, } from 'components/molecules'

import 'styles/Feed/FeedList.scss';

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
			voteFeedItem,
			loading,
		} = this.props;
		const { coursePopupOpen, courseId } = this.state;
		return (
			<Container>
				{
					(feed.length === 0 && feedPins && feedPins.length === 0 && !hasMore)
						? <Title style={{ textAlign: 'center', display: 'block' }}>{t('common.empty-activity-message')}</Title>
						:
						(
							<Container>
								{
									hasMore && ( feedPins === null || feed.length === 0)
										? (
											<Container>
												{header}
												<FeedShimmer />
											</Container>
										)
										: (
											<Container>
												<Container>
													<Container className="feed-pins">
														{feedPins !== undefined && feedPins.length !== 0 &&
															<React.Fragment>
																{feedPins.map(pin => (
																	<FeedPin
																		pin={pin}
																		key={`pin${pin.id}`}
																	/>
																))}
																<Title className="sub-title" key="separator">{t('feed.most-recent-title')}</Title>
															</React.Fragment>
														}
													</Container>
												</Container>
												{ feed.length === 0 && !hasMore
													? <Title style={{ textAlign: 'center', height: 120 }}>{t('common.empty-activity-message')}</Title>
													:
													<InfiniteScroll
														hasMore={hasMore}
														loadMore={loadMore}
														isLoading={loading}
													>
														{feed.map(feedItem => (
															<FeedItem
																key={feedItem.type === types.mergedChallange ?
																	`feedGroup${feedItem.toId}` :
																	`feedItem${feedItem.id}`}
																feedItem={feedItem}
																voteFeedItem={voteFeedItem}
															/>
														))}
													</InfiniteScroll>
												}
											</Container>
										)}
							</Container>
						)
				}
			</Container>
		);
	}
}
export default FeedList;
