import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import Popover from 'material-ui/Popover';
import CircularProgress from 'material-ui/CircularProgress';
import Divider from 'material-ui/Divider';

import { setLikesList } from 'actions/likes';
import { numberFormatter } from 'utils';
import ProfileAvatar from './ProfileAvatar';
import InfiniteVirtualizedList from './InfiniteVirtualizedList';

class Likes extends PureComponent {
	state = {
		open: false,
		anchorEl: null,
	}
	openList = (e) => {
		if (this.props.likes != null) {
			this.props.setLikesList(null);
		}
		this.setState({ open: true, anchorEl: e.currentTarget });
		this.props.getLikes();
	}
	handleKeyPress = (e) => {
		if (e.key === 'Enter') { this.openList(e); }
	}
	closeList = () => {
		this.setState({ open: false });
		this.props.setLikesList(null);
	}
	renderOneLike = user => (
		<div>
			<div key={user.id} style={{ padding: 5 }}>
				<ProfileAvatar
					userID={user.id}
					userName={user.name}
					avatarUrl={user.avatarUrl}
				/>
			</div>
			<Divider />
		</div>
	);
	render() {
		const { votes, likes } = this.props;
		return (
			<div
				onClick={this.openList}
				onKeyPress={this.handleKeyPress}
				role="button"
				tabIndex={0}
				style={{ ...this.props.style, cursor: 'pointer' }}
			>
				{votes > 0 && '+'}{numberFormatter(votes)}
				<Popover
					open={this.state.open}
					anchorEl={this.state.anchorEl}
					anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
					targetOrigin={{ horizontal: 'left', vertical: 'top' }}
					onRequestClose={this.closeList}
					style={{ height: 300 }}
				>
					{
						likes == null ?
							(<div style={{ width: 300 }}><CircularProgress /></div>) :
							(<InfiniteVirtualizedList
								item={this.renderOneLike}
								list={likes}
								width={300}
								rowHeight={50}
								loadMore={this.props.getLikes}
							/>)
					}
				</Popover>
			</div>
		);
	}
}

const mapStateToProps = state => ({ likes: state.likes });
const mapDispatchToProps = { setLikesList };

export default connect(mapStateToProps, mapDispatchToProps)(Likes);
