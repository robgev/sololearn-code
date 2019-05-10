// General modules
import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { observer } from 'mobx-react';
import { connect } from 'react-redux';
import {
	WindowScroller,
	AutoSizer,
	List,
	CellMeasurer,
	CellMeasurerCache,
	InfiniteLoader,
} from 'react-virtualized';

// Utils and defaults
import types from 'defaults/appTypes';
import {
	Container,
	Title,
} from 'components/atoms';
import { EmptyCard } from 'components/molecules';
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

	_cache = new CellMeasurerCache({
		minHeight: 97,
		defaultWidth: 699,
		fixedWidth: true,
	});

	_windowScroller = React.createRef();

	componentDidMount() {
		window.scrollTo(0, 0);
		setTimeout(() => this.setState({ shouldShowFeed: true }), 0);
	}

	toggleCoursePopup = (courseId = null) => {
		this.setState(state => ({ coursePopupOpen: !state.coursePopupOpen, courseId }));
	}

	updatePosition = () => {
		if (this._windowScroller) {
			this._windowScroller.current.updatePosition();
		}
	}

	_rowRenderer = ({
		key,
		style,
		index,
		parent,
	}) => {
		const { feed, voteFeedItem, loading } = this.props;
		const { shouldShowFeed } = this.state;
		const feedItem = feed[index];

		if (loading && index >= feed.length) {
			return (
				<EmptyCard loading />
			);
		}

		return (
			<CellMeasurer
				cache={this._cache}
				columnIndex={0}
				key={key}
				rowIndex={index}
				parent={parent}
			>
				{({ measure }) => (
					<React.Fragment>
						{(index > 20 && !shouldShowFeed
							? null : (
								<FeedItem
									key={key}
									style={style}
									measure={measure}
									feedItem={feedItem}
									voteFeedItem={voteFeedItem}
									updatePosition={this.updatePosition}
								/>
							))
						}
					</React.Fragment>
				)}
			</CellMeasurer>
		);
	};

	isRowLoaded = index => !!this.props.feed[index];

	render() {
		const {
			t,
			feed,
			hasMore,
			feedPins,
			header = null,
			loading,
		} = this.props;
		const loadMore = this.props.loading
			? () => {}
			: this.props.loadMore;
		const rowCount = loading ? feed.length + 1 : feed.length;

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
														<Container className="infinite-loader_container" style={{ margin: '0 -5px' }}>
															<InfiniteLoader
																isRowLoaded={this.isRowLoaded}
																loadMoreRows={loadMore}
																rowCount={rowCount}
															>
																{({ onRowsRendered, registerChild }) => (
																	<WindowScroller ref={this._windowScroller}>
																		{({
																			height, isScrolling, onChildScroll, scrollTop,
																		}) => (
																			<div>
																				<AutoSizer disableHeight>
																					{({ width }) => (
																						<List
																							ref={registerChild}
																							autoHeight
																							height={height}
																							deferredMeasurementCache={this._cache}
																							isScrolling={isScrolling}
																							onScroll={onChildScroll}
																							overscanRowCount={15}
																							rowCount={feed.length}
																							rowHeight={this._cache.rowHeight}
																							onRowsRendered={onRowsRendered}
																							rowRenderer={this._rowRenderer}
																							scrollTop={scrollTop}
																							width={width}
																						/>
																					)}
																				</AutoSizer>
																			</div>
																		)}
																	</WindowScroller>
																)}
															</InfiniteLoader>
														</Container>
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
