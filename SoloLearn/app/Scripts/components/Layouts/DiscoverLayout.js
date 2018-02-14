import React, { PureComponent } from 'react';
import { Link, browserHistory } from 'react-router';
import InfiniteScroll from 'react-infinite-scroller';
import SearchBar from 'components/Shared/SearchBar';
import BusyWrapper from 'components/Shared/BusyWrapper';
import CircularProgress from 'material-ui/CircularProgress';
import UserCard from 'components/Shared/UserCard';

import 'styles/components/Layouts/DiscoverLayout.scss';

class Layout extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
            loading: true
		};
    }
    
    async componentWillMount() {
        await this.props.getDiscoverSuggestions();
        this.setState({
            loading: false,
        });
    }

	render() {
        const { searchText, loading } = this.state;
        const { discoverSuggestions } = this.props;
        console.log(discoverSuggestions);
		return (
			<div className="slay-container">
				<div className="main-content">
					<BusyWrapper
						isBusy={loading}
						style={{ minHeight: '60vh' }}
					>
                        {discoverSuggestions.map(collection => (
                            <UserCard
                                {...collection}
                                key={collection.name}
                            />
                        ))}
					</BusyWrapper>
				</div>
				<div className="sidebar" />
			</div>
		);
	}
}

export default Layout;
