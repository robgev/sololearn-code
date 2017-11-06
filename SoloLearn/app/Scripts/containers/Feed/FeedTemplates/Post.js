// React modules
import React, { Component } from 'react';
import { Link } from 'react-router';

// Material UI components
import QuoteIcon from 'material-ui/svg-icons/editor/format-quote';
import { grey700 } from 'material-ui/styles/colors';

// Utils
import getStyles from '../../../utils/styleConverter';

const styles = {
	post: {
		display: 'inline-flex',
		width: 'inherit',
		padding: '7px',
		backgroundColor: '#eee',
		position: 'relative',
		zIndex: 2,
		textDecoration: 'none',
	},

	quoteIcon: {
		base: {
			flex: 'none',
		},

		bottom: {
			transform: 'scale(-1, -1)',
			margin: '10px 0 0 0',
		},
	},

	postName: {
		fontSize: '13px',
		color: '#777',
		margin: '0 10px',
		flex: 2,
	},
};

class Post extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const post = this.props.post;

		return (
			<Link to={`/discuss/${post.id}`} className="post" style={styles.post}>
				<QuoteIcon className="bottom" color={grey700} style={getStyles(styles.quoteIcon.base, styles.quoteIcon.bottom)} />
				<p style={styles.postName}>{this.props.isQuestion ? post.title : post.message}</p>
				<QuoteIcon className="top" color={grey700} style={styles.quoteIcon.base} />
			</Link>
		);
	}
}

export default Post;
