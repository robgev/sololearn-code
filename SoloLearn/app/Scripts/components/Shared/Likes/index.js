import React, { PureComponent } from 'react';
import ReactGA from 'react-ga';
import { connect } from 'react-redux';

import Dialog from 'material-ui/Dialog';
import CircularProgress from 'material-ui/CircularProgress';

import { setLikesList } from 'actions/likes';
import { numberFormatter } from 'utils';

import PopupContent from './PopupContent';

const mapStateToProps = state => ({ likes: state.likes });
const mapDispatchToProps = { setLikesList };

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
		this.setState({ tabIndex }, this.openList);
	}

	openList = () => {
		const {
			likes,
			getLikes,
			setLikesList,
			getDownvotes,
		} = this.props;
		const { tabIndex } = this.state;
		if (likes != null) {
			setLikesList(null);
		}
		this.setState({ open: true });
		if (tabIndex) {
			getDownvotes();
		} else {
			getLikes();
		}
	}

	closeList = () => {
		this.setState({ open: false });
		this.props.setLikesList(null);
	}

	render() {
		const {
			likes,
			votes,
			getLikes,
			accessLevel,
			getDownvotes,
		} = this.props;
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
					style={{ paddingTop: 0 }}
				>
					<div style={{ height: 300 }}>
						{
							likes == null ?
								<CircularProgress /> :
								<PopupContent
									likes={likes}
									getLikes={getLikes}
									accessLevel={accessLevel}
									getDownvotes={getDownvotes}
									onTabChange={this.changeTab}
									tabIndex={this.state.tabIndex}
								/>
						}
					</div>
				</Dialog>
			</div>
		);
	}
}

export default Likes;
