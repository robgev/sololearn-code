// General modules
import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { observer } from 'mobx-react';
import { connect } from 'react-redux';

// Utils and defaults
import types from 'defaults/appTypes';
import {
	Container,
	Title,
} from 'components/atoms';
import { InfiniteScroll } from 'components/molecules';
import FeedShimmer from 'components/Shimmers/FeedShimmer';

import 'styles/Feed/FeedList.scss';
import FeedPin from './FeedPin';
import FeedItem from './FeedItem';

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
		shouldShowFeed: false,
	}

	componentDidMount() {
		window.scrollTo(0, 0);
		setTimeout(() => this.setState({ shouldShowFeed: true }), 0);
	}

	toggleCoursePopup = (courseId = null) => {
		this.setState(state => ({ coursePopupOpen: !state.coursePopupOpen, courseId }));
	}

	render() {
		const {
			t,
			feed,
			hasMore,
			feedPins,
			loadMore,
			header = null,
			voteFeedItem,
			loading,
		} = this.props;
		const { shouldShowFeed } = this.state;

		return (
			<Container>
				{
					(feed.length === 0 && feedPins && feedPins.length === 0 && !hasMore)
						? <Title className="empty-feed">{t('common.empty-activity-message')}</Title>
						:
						(
							<Container>
								{
									hasMore && (feedPins === null || feed.length === 0)
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
														{feedPins && feedPins.length !== 0 &&
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
													? <Title className="empty-feed">{t('common.empty-activity-message')}</Title>
													:
													<InfiniteScroll
														hasMore={hasMore}
														loadMore={loadMore}
														isLoading={loading}
													>
														{feed.map((feedItem, index) => (index > 20 && !shouldShowFeed
															? null : (
																<FeedItem
																	key={feedItem.type === types.mergedChallange
																		?	`feedGroup${feedItem.toId}`
																		:	`feedItem${feedItem.id}`
																	}
																	feedItem={feedItem}
																	voteFeedItem={voteFeedItem}
																/>
															)))}
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
