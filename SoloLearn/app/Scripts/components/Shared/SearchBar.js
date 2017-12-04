import React, { PureComponent } from 'react';

import { AutoComplete, IconButton, Paper } from 'material-ui';
import SearchIcon from 'material-ui/svg-icons/action/search';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import { grey500 } from 'material-ui/styles/colors';

import 'styles/searchBar.scss';

class SearchBar extends PureComponent {
	handleCancel = () => {
		this.props.onChange('');
	}

	handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			this.props.onRequestSearch();
		}
	}

	render() {
		const {
			style,
			onChange,
			searchText,
			onRequestSearch,
		} = this.props;

		return (
			<Paper style={style} className="search-container">
				<div className="search-wrapper">
					<AutoComplete
						fullWidth
						dataSource={[]}
						hintText="Search"
						underlineShow={false}
						searchText={searchText}
						className="search-field"
						onUpdateInput={onChange}
						onKeyPress={this.handleKeyPress}
					/>
				</div>
				<IconButton
					onClick={onRequestSearch}
					className={`search-button shift-left ${searchText ? 'hidden' : ''}`}
					iconStyle={{
						opacity: searchText ? 0 : 1,
						transition: 'opacity 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
					}}
				>
					<SearchIcon color={grey500} />
				</IconButton>
				<IconButton
					onClick={this.handleCancel}
					className={`search-button ${!searchText ? 'hidden' : ''}`}
					iconStyle={{
						opacity: searchText ? 1 : 0,
						transition: 'opacity 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
					}}
				>
					<CloseIcon color={grey500} />
				</IconButton>
			</Paper>
		);
	}
}

export default SearchBar;
