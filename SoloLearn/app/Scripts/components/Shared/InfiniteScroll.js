import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import Paper from 'material-ui/Paper';
import InfiniteScroll from 'react-infinite-scroller';

class InfiniteScrollWrapper extends React.Component {
	static defaultProps = {
		element: Paper,
	}
	render() {
		const {
			children, element: Element, ...rest
		} = this.props;
		return (
			<div>
				<Element>
					<InfiniteScroll
						{...rest}
						loader={null}
					>
						{children}
					</InfiniteScroll>
				</Element>
				{
					rest.hasMore &&
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
