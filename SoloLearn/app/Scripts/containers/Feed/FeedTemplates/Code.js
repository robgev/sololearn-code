// React modules
import React, { Component } from 'react';
import { Link } from 'react-router';

// Utils
import getStyles from '../../../utils/styleConverter';
import getLanguageColor from '../../../utils/getLanguageColor';
import truncate from '../../../utils/textTruncate';

const styles = {
	code: {
		display: 'flex',
		padding: '7px',
		backgroundColor: '#eee',
		position: 'relative',
		zIndex: 2,
		textDecoration: 'none',
	},

	languageIcon: {
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		width: '30px',
		height: '30px',
		fontSize: '12px',
		color: '#fff',
	},

	codeSnippet: {
		fontSize: '13px',
		color: '#777',
		whiteSpace: 'pre',
		flex: 2,
	},

};

class Code extends Component {
	render() {
		const { code } = this.props;
		return (
			<Link to={`/playground/${code.publicID}`} className="code" style={styles.code}>
				<p style={styles.codeSnippet}>{truncate(code.sourceCode, 500, 6, true)}</p>
				<div className="language" style={getStyles(styles.languageIcon, { backgroundColor: getLanguageColor(code.language) })}>{code.language}</div>
			</Link>
		);
	}
}

export default Code;
