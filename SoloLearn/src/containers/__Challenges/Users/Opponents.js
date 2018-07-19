// React modules
import React, { Component } from 'react';

// Additional components
import Opponent from './Opponent';
import LoadingOverlay from '../../../components/LoadingOverlay';

const styles = {
	opponents: {
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

class Opponents extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoading: false,
			fullyLoaded: false,
		};
	}

	loadOpponents = () => {
		const { opponents } = this.props;

		this.setState({ isLoading: true }); // if (this.props.codes.length > 0)

		const index = opponents ? opponents.length : 0;
		this.props.getOpponents(index).then((count) => {
			if (count < 20) this.setState({ fullyLoaded: true });

			this.setState({ isLoading: false });
		}).catch((error) => {
			console.log(error);
		});
	}

	// Check scroll state
	handleScroll = () => {
		const scollingArea = document.getElementById('opponents');
		if (scollingArea.scrollTop === (scollingArea.scrollHeight - scollingArea.offsetHeight) && !this.state.fullyLoaded && !this.props.notFollowers) {
			if (!this.state.isLoading && !this.state.fullyLoaded) {
				this.loadOpponents();
			}
		}
	}

	renderOpponents = () => this.props.opponents.map(opponent => (
		<Opponent key={opponent.id} opponent={opponent} />
	))

	render() {
		const { isLoaded, opponents } = this.props;
		const { isLoading, fullyLoaded } = this.state;

		return (
			<div id="opponents" style={styles.opponents}>
				{(isLoaded && opponents.length > 0) && this.renderOpponents()}
				{((!isLoaded || opponents.length === 0) && !fullyLoaded) && <LoadingOverlay />}
				{
					(opponents.length > 0 && !fullyLoaded) &&
					<div
						className="loading"
						style={{
							...styles.bottomLoading.base,
							...(isLoading ? styles.bottomLoading.active : {}),
						}}
					>
						<LoadingOverlay size={30} />
					</div>
				}
				{(fullyLoaded && opponents.length === 0) &&
					<div style={styles.noResults}>No Results Found</div>}
			</div>
		);
	}

	componentWillMount() {
		const { isLoaded } = this.props;

		if (!isLoaded) {
			this.loadOpponents();
		}
	}

	// Add event listeners after component mounts
	componentDidMount() {
		const scollingArea = document.getElementById('opponents');
		scollingArea.addEventListener('scroll', this.handleScroll);
	}

	// Remove event listeners after component unmounts
	componentWillUnmount() {
		const scollingArea = document.getElementById('opponents');
		scollingArea.removeEventListener('scroll', this.handleScroll);
	}
}

export default Opponents;
