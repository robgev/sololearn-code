// React modules
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import Radium from 'radium';

// Material UI components
import { Paper, TextField, FlatButton } from 'material-ui';
import ChipInput from 'material-ui-chip-input';

// Redux modules
import { connect } from 'react-redux';
import { addQuestion } from 'actions/discuss';

// Service
import Service from 'api/service';

// Additional components
import LoadingOverlay from 'components/Shared/LoadingOverlay';

import { NewQuestionStyles as styles } from './styles';

const mapDispatchToProps = { addQuestion };

@connect(null, mapDispatchToProps)
@Radium
class NewQuestion extends Component {
	state = {
		title: '',
		titleErrorText: '',
		message: '',
		tags: [],
		tagsErrorText: '',
		suggestions: [],
		isLoading: false,
	};

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
	handleUpdateInput = async (query) => {
		if (query.length < 2) return;
		try {
			const { tags: suggestions } = await Service.request('Discussion/getTags', { query });
			this.setState({ suggestions });
		} catch (e) {
			console.log(e);
		}
	}

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
			try {
				const { id, alias } = await this.props.addQuestion(
					this.state.title,
					this.state.message,
					this.state.tags,
				);
				browserHistory.push(`/discuss/${id}/${alias}`);
			} catch (err) {
				console.log(err);
			}
		}
	}
	// Customly render tag
	renderChip = ({ value }, key) => (
		<div key={key} style={styles.tag}>{value}</div>
	)

	render() {
		return (
			<Paper id="new-question" style={styles.container}>
				{this.state.isLoading && <LoadingOverlay />}
				<h2 style={styles.heading}>New Question</h2>
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
							newChipKeyCodes={[ 13, 32 ]}
							chipRenderer={this.renderChip}
							onUpdateInput={this.handleUpdateInput}
							dataSource={this.state.suggestions}
							onChange={chips => this.handleTagsChange(chips)}
							fullWidth
							fullWidthInput
							floatingLabelText="Relevant Tags"
							errorText={this.state.tagsErrorText}
						/>
					</div>
					<div className="editor-actions" style={styles.editorActions}>
						<FlatButton type="submit" label="POST" primary />
					</div>
				</form>
			</Paper>
		);
	}
}

export default NewQuestion;
