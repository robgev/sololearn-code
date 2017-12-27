import React, { PureComponent } from 'react';
import { Link, browserHistory } from 'react-router';
import InfiniteScroll from 'react-infinite-scroller';
import SearchBar from 'components/Shared/SearchBar';
import BusyWrapper from 'components/Shared/BusyWrapper';

import 'styles/slayBase.scss';

class Layout extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			searchText: props.searchValue || '',
		};
	}

	onChange = (searchText) => {
		if (searchText) {
			this.setState({ searchText });
		} else {
			browserHistory.replace('/learn');
		}
	}

	onRequestSearch = () => {
		const { searchText } = this.state;
		browserHistory.push(`/learn/search/${searchText}`);
	}

	render() {
		const {
			items,
			loading,
			children,
			hasMore,
			loadMore,
			cardComponent: CardComponent,
		} = this.props;
		const { searchText } = this.state;
		return (
			<div className="slay-container">
				<div className="main-content">
					<SearchBar
						searchText={searchText}
						onChange={this.onChange}
						searchButtoncontainer={Link}
						onRequestSearch={this.onRequestSearch}
						containerElementProps={{ to: `/learn/search/${searchText}` }}
					/>
					<BusyWrapper
						isBusy={loading}
						style={{ minHeight: '60vh' }}
					>
						<InfiniteScroll
							pageStart={0}
							hasMore={hasMore}
							loadMore={loadMore}
							style={{ width: '100%' }}
							loader={loading ? null : <div>Loading...</div>}
							// Loading specifies initial load.
							// We don't want infinite scroll loading thing on inital load
						>
							{items.map(collection => (
								<CardComponent
									{...collection}
									key={collection.name}
								/>
							))}
						</InfiniteScroll>
						{children}
					</BusyWrapper>
				</div>
				<div className="sidebar" />
			</div>
		);
	}
}

export default Layout;
