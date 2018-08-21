import React, { PureComponent } from 'react';

import { Link } from 'react-router';
import AutoComplete from 'material-ui/AutoComplete';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
import SearchIcon from 'material-ui/svg-icons/action/search';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import BookmarkIcon from 'material-ui/svg-icons/action/bookmark';
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
			containerElementProps,
			searchButtoncontainer: Wrapper = 'div',
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
				<Wrapper {...containerElementProps}>
					<IconButton
						className={`search-button shift-left ${searchText ? 'hidden' : ''}`}
						iconStyle={{
							opacity: searchText ? 0 : 1,
							transition: 'opacity 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
						}}
					>
						<SearchIcon color={grey500} />
					</IconButton>
				</Wrapper>
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
				<Link to="/learn/bookmarks">
					<IconButton
						onClick={this.handleCancel}
						className="search-button"
					>
						<BookmarkIcon color={grey500} />
					</IconButton>
				</Link>
			</Paper>
		);
	}
}

export default SearchBar;
