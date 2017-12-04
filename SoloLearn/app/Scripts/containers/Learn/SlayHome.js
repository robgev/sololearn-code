import React, { PureComponent } from 'react';

import SearchBar from 'components/Shared/SearchBar';

class SlayHome extends PureComponent {
	constructor() {
		super();
		this.state = {
			searchText: '',
		};
	}

	onChange = (searchText) => {
		this.setState({ searchText });
	}

	render() {
		const { searchText } = this.state;
		return (
			<div>
				<SearchBar
					searchText={searchText}
					onChange={this.onChange}
					onRequestSearch={() => console.log(searchText)}
				/>
			</div>
		);
	}
}

export default SlayHome;
