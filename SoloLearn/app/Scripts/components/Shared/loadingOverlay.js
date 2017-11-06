// React modules
import React, { Component } from 'react';
import Radium from 'radium';

// Material UI components
import CircularProgress from 'material-ui/CircularProgress';

// Utils
import getStyles from '../../utils/styleConverter';

const styles = {
	overlay: {
		base: {
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			textAlign: 'center',
			zIndex: 1000,
		},

		background: {
			background: 'rgba(255, 255, 255, 0.8)',
		},
	},

	circle: {
		base: {
			position: 'absolute',
			top: '50%',
			left: '50%',
		},
	},
};

class LoadingOverlay extends Component {
	render() {
		const defaultSize = 40;
		const defaultThickness = 3.5;

		const size = this.props.size || defaultSize;
		const thickness = this.props.thickness || defaultThickness;

		const marginTop = size / 2;
		const marginLeft = size / 2;

		const additionalStyle = {
			marginTop: `${-marginTop}px`,
			marginLeft: `${-marginLeft}px`,
		};

		return (
			<div className="loading-overlay" style={this.props.withBackground ? getStyles(styles.overlay.base, styles.overlay.background) : styles.overlay.base}>
				<CircularProgress
					size={size}
					thickness={thickness}
					style={getStyles(styles.circle.base, additionalStyle)}
				/>
			</div>
		);
	}
}

export default Radium(LoadingOverlay);
