import React, { PureComponent } from 'react';
import { Link, browserHistory } from 'react-router';
import InfiniteScroll from 'react-infinite-scroller';
import SearchBar from 'components/Shared/SearchBar';
import BusyWrapper from 'components/Shared/BusyWrapper';
import CircularProgress from 'material-ui/CircularProgress';

import 'styles/components/Layouts/DiscoverLayout.scss';

class Layout extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
            searchText: props.searchValue || '',
            loading: true
		};
    }
    
    async componentWillMount() {
        await this.props.getDiscoverSuggestions();
        this.setState({
            loading: false,
        });
    }
    
	onChange = (searchText) => {
		if (searchText) {
			this.setState({ searchText });
		}
    }

	onRequestSearch = () => {
		const { searchText } = this.state;
	}

	render() {
		const { searchText, loading } = this.state;
		return (
			<div className="slay-container">
				<div className="main-content">
					<SearchBar
						searchText={searchText}
						onChange={this.onChange}
						onRequestSearch={this.onRequestSearch}
					/>
					<BusyWrapper
						isBusy={loading}
						style={{ minHeight: '60vh' }}
					>
					</BusyWrapper>
				</div>
				<div className="sidebar" />
			</div>
		);
	}
}

export default Layout;
