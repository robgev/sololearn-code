// General modules
import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { observer } from 'mobx-react';
import { connect } from 'react-redux';

import {
	Container,
	Title,
} from 'components/atoms';
import { InfiniteVirtualizedList } from 'components/organisms';
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

	_rowRenderer = ({
		style,
		index,
		measure,
		updatePosition,
	}) => {
		const { feed, voteFeedItem } = this.props;
		const { shouldShowFeed } = this.state;
		const feedItem = feed[index];

		return (
			<React.Fragment>
				{(index > 20 && !shouldShowFeed
					? null : (
						<FeedItem
							style={style}
							measure={measure}
							feedItem={feedItem}
							voteFeedItem={voteFeedItem}
							updatePosition={updatePosition}
						/>
					))
				}
			</React.Fragment>
		);
	};

	isRowLoaded = index => !!this.props.feed[index];

	hasMore = index => index >= this.props.feed.length;

	render() {
		const {
			t,
			feed,
			hasMore,
			loadMore,
			feedPins,
			header = null,
			loading,
		} = this.props;

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
													: (
														<InfiniteVirtualizedList
															rowRenderer={this._rowRenderer}
															loading={loading}
															hasMore={this.hasMore}
															isRowLoaded={this.isRowLoaded}
															loadMore={loadMore}
															rowCount={Number.MAX_SAFE_INTEGER}
															listRowCount={feed.length}
														/>
													)
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
