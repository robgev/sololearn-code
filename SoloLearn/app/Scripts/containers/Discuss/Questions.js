// React modules
import React, { Component } from 'react';
import Radium from 'radium';

// Redux modules
import { connect } from 'react-redux';
import { getQuestionsInternal, emptyQuestions } from '../../actions/discuss';

// Additional components
import LoadingOverlay from '../../components/Shared/LoadingOverlay';
import InfiniteVirtualizedList from '../../components/Shared/InfiniteVirtualizedList';
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
	state = { isLoading: false }
	componentWillMount() {
		const { query, ordering } = this.props;
		this.loadQuestions({ query, ordering });
	}
	componentDidUpdate(prevProps) {
		if (prevProps.query !== this.props.query ||
			prevProps.ordering !== this.props.ordering) {
			this.loadQuestionByState();
		}
	}
	componentWillUnmount() {
		this.props.emptyQuestions();
	}
	loadQuestions = async () => {
		const {
			questions, userId, query, ordering,
		} = this.props;
		this.setState({ isLoading: true }); // if (this.props.questions.length > 0)
		const index = questions ? questions.length : 0;
		try {
			await this.props.getQuestionsInternal({
				index, userId, query, ordering,
			});
			this.setState({ isLoading: false });
		} catch (e) {
			console.log(e);
		}
	}
	// Load questions when condition changes
	loadQuestionByState = async () => {
		try {
			await this.props.emptyQuestions();
			this.loadQuestions();
		} catch (e) {
			console.log(e);
		}
	}
	renderQuestion = question => (<QuestionItem question={question} />)
	render() {
		const { isLoaded, questions, isUserProfile } = this.props;

		return (
			<div>
				{((!isLoaded || questions.length === 0) && !isUserProfile)
					&& <LoadingOverlay />}
				{(isLoaded && questions.length > 0) && (
					<InfiniteVirtualizedList
						rowHeight={100}
						item={this.renderQuestion}
						list={this.props.questions}
						loadMore={this.loadQuestions}
						width={1000}
						window
					/>
				)}
				{
					((isUserProfile || questions.length > 0)) &&
					<div
						style={!this.state.isLoading ?
							styles.bottomLoading.base :
							[ styles.bottomLoading.base, styles.bottomLoading.active ]}
					>
						<LoadingOverlay size={30} />
					</div>
				}
			</div>
		);
	}
}

const mapDispatchToProps = {
	getQuestionsInternal,
	emptyQuestions,
};

export default connect(null, mapDispatchToProps, null, { withRef: true })(Radium(Questions));
