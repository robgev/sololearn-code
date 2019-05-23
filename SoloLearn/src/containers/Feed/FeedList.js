// General modules
import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { observer } from 'mobx-react';
import { connect } from 'react-redux';

import {
	Container,
	Title,
	Popup,
} from 'components/atoms';
import { FloatingActionButton } from 'components/molecules';
import { InfiniteVirtualizedList } from 'components/organisms';
import { Add } from 'components/icons';
import FeedShimmer from 'components/Shimmers/FeedShimmer';
import types from 'defaults/appTypes';

import FeedPin from './FeedPin';
import FeedItem from './FeedItem';
import UserPostEditor from 'containers/UserPostEditor';

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
		shouldShowFeed: false,
		openIds: [],
		isCreatePostPopupOpen: false,
	}

	componentDidMount() {
		window.scrollTo(0, 0);
		setTimeout(() => this.setState({ shouldShowFeed: true }), 0);
	}

	toggleCoursePopup = (courseId = null) => {
		this.setState(state => ({ coursePopupOpen: !state.coursePopupOpen, courseId }));
	}

	openItem = (id, callback) => {
		console.log('Opening');
		this.setState(s => ({ openIds: [ ...s.openIds, id ] }), callback);
	}

	closeItem = (id, callback) => {
		this.setState(s => ({ openIds: s.openIds.filter(i => i !== id) }), callback);
	}

	_rowRenderer = ({
		style,
		index,
		measure,
		updatePosition,
	}) => {
		const { feed, voteFeedItem } = this.props;
		const { shouldShowFeed, openIds } = this.state;
		const feedItem = feed[index];
		const open = feedItem.type === types.mergedChallange && openIds.includes(feedItem.id);
		return (
			<React.Fragment>
				{(index > 20 && !shouldShowFeed
					? null : (
						<FeedItem
							style={style}
							open={open}
							measure={measure}
							feedItem={feedItem}
							openItem={this.openItem}
							closeItem={this.closeItem}
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
			showFab = false,
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
												{feed.length === 0 && !hasMore
													? <Title className="empty-feed">{t('common.empty-activity-message')}</Title>
													: (
														<Container className="feed-list-virtualized-list-and-fab-container">
															<InfiniteVirtualizedList
																rowRenderer={this._rowRenderer}
																loading={loading}
																hasMore={this.hasMore}
																isRowLoaded={this.isRowLoaded}
																loadMore={loadMore}
																rowCount={Number.MAX_SAFE_INTEGER}
																listRowCount={feed.length}
															/>
															{showFab &&
																<FloatingActionButton
																	color="secondary"
																	alignment="right"
																	onClick={() => this.setState({ isCreatePostPopupOpen: true })}
																>
																	<Add />
																</FloatingActionButton>
															}
														</Container>
													)
												}
											</Container>
										)}
							</Container>
						)
				}
				<Popup
					open={this.state.isCreatePostPopupOpen}
				// onClose={() => this.setState({ isCreatePostPopupOpen: false })}
				>
					<UserPostEditor closePopup={() => this.setState({ isCreatePostPopupOpen: false })} />
				</Popup>
			</Container>
		);
	}
}
export default FeedList;
