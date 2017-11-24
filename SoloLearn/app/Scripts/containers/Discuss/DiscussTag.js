import React, { Component } from 'react';
import { Link } from 'react-router';

const styles = {
	base: {
		display: 'inline-block',
		verticalAlign: 'middle',
		backgroundColor: '#9CCC65',
		color: '#fff',
		fontSize: '12px',
		padding: '3px 5px',
		borderRadius: '3px',
	},
	margin: {
		margin: '0 0 0 5px',
	},
	none: {
		textDecoration: 'none',
		color: 'white',
	},
};

class DiscussTag extends Component {
	render() {
		const { tag, index } = this.props;
		return (
			<div
				style={index === 0 ? styles.base : { ...styles.base, ...styles.margin }}
			>
				<Link to={`/discuss/filter/${tag}`} style={styles.none} onClick={this.changeQuerys}>
					{tag}
				</Link>
			</div>
		);
	}
}

export default DiscussTag;
