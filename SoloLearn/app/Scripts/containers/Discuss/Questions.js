// React modules
import React, { Component } from 'react';
import Radium, { Style } from 'radium';

// Redux modules
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadDefaults } from '../../actions/defaultActions';
import { getQuestionsInternal, emptyQuestions } from '../../actions/discuss';
import { defaultsLoaded } from '../../reducers';

// Additional components
import LoadingOverlay from '../../components/Shared/LoadingOverlay';
import QuestionItem from './QuestionItem';

const styles = {
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

class Questions extends Component {
    state = {
    	isLoading: false,
    	fullyLoaded: false,
    }
    componentWillMount() {
    	if (!this.props.isLoaded) {
    		this.loadQuestions();
    	}
    }
    componentDidMount() {
    	window.addEventListener('scroll', this.handleScroll);
    }

    // Remove event listeners after component unmounts
    componentWillUnmount() {
    	window.removeEventListener('scroll', this.handleScroll);
    }

    // Check scroll state
    handleScroll = () => {
    	if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
    		if (!this.state.isLoading && !this.state.fullyLoaded) {
    			this.loadQuestions();
    		}
    	}
    }
    loadQuestions = () => {
    	const { questions, userId } = this.props;
    	this.setState({ isLoading: true }); // if (this.props.questions.length > 0)
    	const index = questions ? questions.length : 0;
    	this.props.getQuestionsInternal(index, userId)
    		.then((count) => {
    			if (count < 20) this.setState({ fullyLoaded: true });
    			this.setState({ isLoading: false });
    		})
    		.catch(e => console.log(e));
    }
    // Load questions when condition changes
    loadQuestionByState = () => {
    	this.props.emptyQuestions()
    		.then(() => {
    			this.loadQuestions();
    		}).catch((e) => {
    			console.log(e);
    		});
    }
    renderQuestions = () => this.props.questions.map(quesiton => (
    	<QuestionItem question={quesiton} key={quesiton.id} />
    ))
    render() {
    	const { isLoaded, questions, isUserProfile } = this.props;

    	return (
    		<div>
    			{((!isLoaded || questions.length == 0) && !this.state.fullyLoaded && !isUserProfile) && <LoadingOverlay />}
		{(isLoaded && questions.length > 0) && this.renderQuestions()}
		{
    				((isUserProfile || questions.length > 0) && !this.state.fullyLoaded) &&
    <div
    	style={!this.state.isLoading ?
                    		styles.bottomLoading.base :
                    		[ styles.bottomLoading.base, styles.bottomLoading.active ]}
    >
    	<LoadingOverlay size={30} />
    </div>
    			}
    			{(this.state.fullyLoaded && questions.length == 0) && <div style={styles.noResults}>No Results Found</div>}
	</div>
    	);
    }
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({
		getQuestionsInternal,
		emptyQuestions,
	}, dispatch);
}

export default connect(null, mapDispatchToProps, null, { withRef: true })(Radium(Questions));
