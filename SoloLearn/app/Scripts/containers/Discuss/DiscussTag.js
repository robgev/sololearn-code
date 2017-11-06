import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import { noStyleLink } from './QuestionItem';
import { getQuestionsInternal, emptyQuestions, changeDiscussQuery } from '../../actions/discuss';
import { browserHistory } from 'react-router';

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
};

class DiscussTag extends Component {
    loadQuestions = () => {
    	this.props.emptyQuestions()
    		.then(() => {
    			this.props.changeDiscussQuery(this.props.tag);
    			this.props.getQuestionsInternal(0);
    		})
    		.catch((e) => {
    			console.log(e);
    		});
    }
    render() {
    	const { tag, index } = this.props;
    	return (
    		<div
		style={index == 0 ? styles.base : { ...styles.base, ...styles.margin }}
	>
    			<Link to="/discuss" style={noStyleLink} onClick={this.loadQuestions}>
    				{tag}
 </Link>
 </div>
    	);
    }
}

const mapDispatchToProps = dispatch =>
	bindActionCreators({
		getQuestionsInternal,
		changeDiscussQuery,
		emptyQuestions,
	}, dispatch);

export default connect(null, mapDispatchToProps)(DiscussTag);
