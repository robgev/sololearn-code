// React modules
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import Radium from 'radium';

// Redux modules
import { connect } from 'react-redux';
import { loadDefaults } from 'actions/defaultActions';
import { editQuestion, loadPostInternal } from 'actions/discuss';
import { isLoaded, defaultsLoaded } from 'reducers';

// Material UI components
import { Paper, TextField, FlatButton } from 'material-ui';
import ChipInput from 'material-ui-chip-input';

// Service
import Service from 'api/service';

// Additional components
import LoadingOverlay from 'components/Shared/LoadingOverlay';

import { EditQuestionStyles as styles } from './styles';

const mapStateToProps = state => ({
	defaultsLoaded: defaultsLoaded(state),
	isLoaded: isLoaded(state, 'discussPost'),
	post: state.discussPost,
});

const mapDispatchToProps = {
	loadPostInternal,
	editQuestion,
	loadDefaults,
};

@connect(mapStateToProps, mapDispatchToProps)
@Radium
class EditQuestion extends Component {
	constructor(props) {
		super(props);
		const { isLoaded, post } = props;
		this.state = {
			title: isLoaded ? post.title : '',
			titleErrorText: '',
			message: isLoaded ? post.message : '',
			tags: isLoaded ? post.tags : [],
			tagsErrorText: '',
			suggestions: [],
			isLoading: false,
			editorLoaded: isLoaded,
		};
		document.title = 'Edit your question';
	}

	async componentWillMount() {
		const { params } = this.props;
		if (!this.props.isLoaded) {
			// Loading post data
			await this.props.loadPostInternal(params.id);
			const { post } = this.props;
			this.setState({
				title: post.title,
				message: post.message,
				tags: post.tags,
				editorLoaded: true,
			});
		}
	}

	// Detect title change
	onTitleChange = (e) => {
		this.setState({ title: e.target.value });
	}

	// Detect title change
	onMessageChange = (e) => {
		this.setState({ message: e.target.value });
	}

	// Collect tags into one array
	handleTagsChange = (chips) => {
		this.setState({ tags: chips });
	}

	// Get search suggestions
	handleUpdateInput = async (searchText) => {
		if (searchText.length < 2) return;
		const { tags } = await Service.request('Discussion/getTags', { query: searchText });
		this.setState({ suggestions: tags });
	}

	// Customly render tag
	renderChip = ({ value }, key) => (
		<div key={key} style={styles.tag}>{value}</div>
	)

	// Add question form submit
	handleSubmit = async (e) => {
		e.preventDefault();
		const allowSubmit = this.state.title.length !== 0 && this.state.tags.length !== 0;
		if (!allowSubmit) {
			this.setState({
				titleErrorText: this.state.title.length === 0 ? 'Question is required' : '',
				tagsErrorText: this.state.tags.length === 0 ? 'Add at least one tag' : '',
			});
		} else {
			this.setState({ isLoading: true });

			const { id, alias } = await this.props.editQuestion(
				this.props.post.id,
				this.state.title, this.state.message,
				this.state.tags,
			);
			browserHistory.push(`/discuss/${id}/${alias}`);
		}
	}

	render() {
		const { defaultsLoaded, isLoaded, post } = this.props;

		if (!defaultsLoaded || !isLoaded || !this.state.editorLoaded) {
			return <LoadingOverlay />;
		}

		return (
			<Paper id="new-question" style={styles.container}>
				{this.state.isLoading && <LoadingOverlay />}
				<h2 style={styles.heading}>Edit Question</h2>
				<form onSubmit={this.handleSubmit}>
					<div className="question-data" style={styles.questionData}>
						<TextField
							floatingLabelText="Question"
							fullWidth
							defaultValue={this.state.title}
							errorText={this.state.titleErrorText}
							onChange={e => this.onTitleChange(e)}
							style={styles.textField}
						/>
						<span
							style={styles.textFieldCoutner}
						>
							{128 - this.state.title.length} characters remaining
						</span>
					</div>
					<div className="question-data" style={styles.questionData}>
						<TextField
							floatingLabelText="Description"
							multiLine
							rowsMax={4}
							fullWidth
							defaultValue={this.state.message}
							onChange={e => this.onMessageChange(e)}
							style={styles.textField}
						/>
						<span
							style={styles.textFieldCoutner}
						>
							{512 - this.state.message.length} characters remaining
						</span>
					</div>
					<div className="question-data" style={styles.questionData}>
						<ChipInput
							chipRenderer={this.renderChip}
							onUpdateInput={this.handleUpdateInput}
							dataSource={this.state.suggestions}
							defaultValue={this.state.tags}
							onChange={chips => this.handleTagsChange(chips)}
							fullWidth
							fullWidthInput
							floatingLabelText="Relevant Tags"
							errorText={this.state.tagsErrorText}
						/>
					</div>
					<div className="editor-actions" style={styles.editorActions}>
						<FlatButton type="submit" label="EDIT" primary />
					</div>
				</form>
			</Paper>
		);
	}
}

export default EditQuestion;
