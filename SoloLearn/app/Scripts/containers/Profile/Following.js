// General modules
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// Redux modules
import { getFollowingInternal } from 'actions/profile';
import { isLoaded } from 'reducers';

// Additional data and components
import LoadingOverlay from 'components/Shared/LoadingOverlay';
import Follower from './FollowerItem';

const styles = {
	container: {
		position: 'relative',
		height: '500px',
		overflowY: 'scroll',
	},

	bottomLoading: {
		base: {
			position: 'relative',
			width: '100%',
			height: '50px',
			visibility: 'hidden',
			opacity: 0,
			transition: 'opacity ease 300ms, -webkit-transform ease 300ms',
		},

		active: {
			visibility: 'visible',
			opacity: 1,
			transform: 'translateY(0)',
		},

		fullyLoaded: {
			display: 'none',
		},
	},

	noResults: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%,-50%)',
		fontSize: '20px',
		color: '#777',
	},
};

class Following extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoading: false,
			fullyLoaded: false,
		};

		this.handleScroll = this.handleScroll.bind(this);
	}

	loadFollowing(index, userId) {
		this.setState({ isLoading: true });

		return this.props.getFollowing(index, userId).then((count) => {
			if (count < 20) {
				this.setState({ fullyLoaded: true });
			}

			this.setState({ isLoading: false });
		}).catch((error) => {
			console.log(error);
		});
	}

	// Check scroll state
	handleScroll() {
		const scollingArea = document.getElementById('following');
		const neededScrollTop = scollingArea.scrollHeight - scollingArea.offsetHeight;
		if (scollingArea.scrollTop === neededScrollTop && !this.state.fullyLoaded) {
			if (!this.state.isLoading && !this.state.fullyLoaded) {
				this.loadFollowing(this.props.following.length, this.props.userId);
			}
		}
	}

	renderFollowers = () => this.props.following.map(follower => (
		<Follower key={follower.id} follower={follower} fromFollowers={false} />
	))

	render() {
		const { isLoadedFollowing, following } = this.props;
		const { fullyLoaded, isLoading } = this.state;

		return (
			<div id="following" style={styles.container}>
				{(isLoadedFollowing && following.length > 0) && this.renderFollowers()}
				{
					((!isLoadedFollowing || following.length === 0) && !fullyLoaded) &&
					<LoadingOverlay />
				}
				{
					following.length > 0 &&
					<div
						className="loading"
						style={{
							...(isLoading ? {}
								: { ...styles.bottomLoading.base, ...styles.bottomLoading.active }),
							...(fullyLoaded ? styles.bottomLoading.fullyLoaded : styles.bottomLoading.base),
						}}
					>
						<LoadingOverlay size={30} />
					</div>
				}
				{
					(fullyLoaded && following.length === 0) &&
					<div style={styles.noResults}>No Results Found</div>
				}
			</div>
		);
	}

	componentWillMount() {
		if (!this.props.isLoadedFollowing) {
			this.loadFollowing(0, this.props.userId);
		}
	}

	// Add event listeners after component mounts
	componentDidMount() {
		const scollingArea = document.getElementById('following');
		scollingArea.addEventListener('scroll', this.handleScroll);
	}

	// Remove event listeners after component unmounts
	componentWillUnmount() {
		const scollingArea = document.getElementById('following');
		scollingArea.removeEventListener('scroll', this.handleScroll);
	}
}

function mapStateToProps(state) {
	return {
		following: state.profile.following,
		isLoadedFollowing: isLoaded(state, 'following'),
	};
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({
		getFollowing: getFollowingInternal,
	}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Following);
