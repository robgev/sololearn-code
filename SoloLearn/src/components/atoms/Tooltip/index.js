import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MUITooltip from '@material-ui/core/Tooltip';
import './styles.scss';

class Tooltip extends Component {
state = {
	arrowRef: null,
};

handleArrowRef = (node) => {
	this.setState({
		arrowRef: node,
	});
};

render() {
	const {
		children,
		className,
		tooltipContent,
		...rest
	} = this.props;

	return (
		<div>
			<MUITooltip
				interactive
				title={
					<React.Fragment>
						{tooltipContent}
						<span className="atom_tooltip-arrow" ref={this.handleArrowRef} />
					</React.Fragment>
				}
				className={`atom_tooltip-root ${className}`}
				classes={{ tooltip: 'atom_tooltip', popper: 'atom_tooltip-popper' }}
				PopperProps={{
					popperOptions: {
						modifiers: {
							arrow: {
								enabled: Boolean(this.state.arrowRef),
								element: this.state.arrowRef,
							},
						},
					},
				}}
				{...rest}
			>
				{children}
			</MUITooltip>
		</div>
	);
}
}

Tooltip.defaultProps = {
	className: '',
};

Tooltip.propTypes = {
	className: PropTypes.string,
	tooltipContent: PropTypes.node.isRequired,
};

export default Tooltip;
