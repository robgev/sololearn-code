// React modules
import React, { Component } from 'react';
import ReactGA from 'react-ga';
import Radium from 'radium';

// Redux modules
import { connect } from 'react-redux';
import { getQuestionsInternal, emptyQuestions } from 'actions/discuss';

// Additional components
import BusyWrapper from 'components/Shared/BusyWrapper';
import DiscussShimmer from 'components/Shared/Shimmers/DiscussShimmer';
import InfiniteVirtualizedList from 'components/Shared/InfiniteVirtualizedList';

import 'styles/Discuss/Questions.scss';
import QuestionItem from './QuestionItem';

const mapDispatchToProps = { getQuestionsInternal, emptyQuestions };

@connect(null, mapDispatchToProps, null, { withRef: true })
@Radium
class Questions extends Component {
	state = { isLoading: false }
	componentWillMount() {
		this.loadQuestions();
		document.title = 'Sololearn | Discuss';
		ReactGA.ga('send', 'screenView', { screenName: 'Discussion Page' });
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
			questions, userId: profileId, query, ordering,
		} = this.props;
		this.setState({ isLoading: true }); // if (this.props.questions.length > 0)
		const index = questions ? questions.length : 0;
		await this.props.getQuestionsInternal({
			index, profileId, query, ordering,
		});
		this.setState({ isLoading: false });
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
		const { isLoading } = this.state;
		const {
			isLoaded, questions, t,
		} = this.props;

		return (
			<BusyWrapper
				isBusy={isLoading}
				className="discuss-busy-container"
				wrapperClassName="discuss-wrapper"
				loadingComponent={<DiscussShimmer />}
			>
				{(isLoaded && questions.length > 0) && (
					<InfiniteVirtualizedList
						rowHeight={100}
						item={this.renderQuestion}
						list={this.props.questions}
						loadMore={this.loadQuestions}
						width={950}
						window
					/>
				)}
				{ questions.length === 0 &&
					<p>{t('common.empty-list-message')}</p>
				}
			</BusyWrapper>
		);
	}
}

export default Questions;
