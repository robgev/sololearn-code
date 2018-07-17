import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import Paper from 'material-ui/Paper';
import InfiniteScroll from 'react-infinite-scroller';

class InfiniteScrollWrapper extends React.Component {
	static defaultProps = {
		useWindow: true,
		element: Paper,
	}
	componentDidMount() {
		this.props.loadMore();
	}
	render() {
		const {
			loadMore, hasMore, children, useWindow, element: Element,
		} = this.props;
		return (
			<div>
				<Element>
					<InfiniteScroll
						loadMore={loadMore}
						hasMore={hasMore}
						loader={null}
						useWindow={useWindow}
					>
						{children}
					</InfiniteScroll>
				</Element>
				{
					hasMore &&
					<CircularProgress
						size={40}
						style={{ display: 'flex', alignItems: 'center', margin: '10px auto' }}
					/>
				}
			</div>
		);
	}
}

export default InfiniteScrollWrapper;
