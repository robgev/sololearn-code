import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import Dialog from 'material-ui/Dialog';
import CircularProgress from 'material-ui/CircularProgress';
import Divider from 'material-ui/Divider';

import { setLikesList } from 'actions/likes';
import { numberFormatter } from 'utils';
import ProfileAvatar from './ProfileAvatar';
import InfiniteVirtualizedList from './InfiniteVirtualizedList';

const mapStateToProps = state => ({ likes: state.likes });
const mapDispatchToProps = { setLikesList };

@connect(mapStateToProps, mapDispatchToProps)
class Likes extends PureComponent {
	state = {
		open: false,
	}
	openList = () => {
		if (this.props.likes != null) {
			this.props.setLikesList(null);
		}
		this.setState({ open: true });
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
					withUserNameBox
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
				<Dialog
					open={this.state.open}
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
				</Dialog>
			</div>
		);
	}
}

export default Likes;
