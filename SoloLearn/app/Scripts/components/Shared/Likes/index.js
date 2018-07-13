import React, { PureComponent } from 'react';
import ReactGA from 'react-ga';
import { connect } from 'react-redux';

import Dialog from 'material-ui/Dialog';

import { emptyLikesList } from 'actions/likes';
import { numberFormatter } from 'utils';

import PopupContent from './PopupContent';

const mapStateToProps = state => ({ likes: state.likes });
const mapDispatchToProps = { emptyLikesList };

@connect(mapStateToProps, mapDispatchToProps)
class Likes extends PureComponent {
	state = {
		open: false,
		tabIndex: 0,
	}

	componentWillMount() {
		ReactGA.ga('send', 'screenView', { screenName: 'Upvotes Page' });
	}

	handleKeyPress = (e) => {
		if (e.key === 'Enter') { this.openList(); }
	}

	changeTab = (tabIndex) => {
		this.props.emptyLikesList();
		this.setState({ tabIndex });
	}

	loadMore = () => {
		const { getLikes, getDownvotes } = this.props;
		const { tabIndex } = this.state;
		if (tabIndex === 1) {
			return getDownvotes();
		}
		return getLikes();
	}

	openList = () => {
		this.props.emptyLikesList();
		this.setState({ open: true });
	}

	closeList = () => {
		this.setState({ open: false });
		this.props.emptyLikesList();
	}

	render() {
		const {
			likes,
			votes,
			accessLevel,
		} = this.props;
		const { tabIndex } = this.state;
		return (
			<div
				onClick={this.openList}
				onKeyPress={this.handleKeyPress}
				role="button"
				tabIndex={0}
				style={{
					...this.props.style,
					cursor: 'pointer',
					fontSize: 14,
					fontWeight: 600,
					color: '#607D8B',
				}}
			>
				{votes > 0 && '+'}{numberFormatter(votes)}
				<Dialog
					open={this.state.open}
					onRequestClose={this.closeList}
					style={{ paddingTop: 0 }}
				>
					<div style={{ height: 300 }}>
						<PopupContent
							key={tabIndex}
							loadMore={this.loadMore}
							likes={likes}
							accessLevel={accessLevel}
							onTabChange={this.changeTab}
							tabIndex={tabIndex}
						/>
					</div>
				</Dialog>
			</div>
		);
	}
}

export default Likes;
