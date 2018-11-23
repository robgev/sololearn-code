import React, { Component } from 'react';
import { translate } from 'react-i18next';
import Autosuggest from 'react-autosuggest';
import { MenuItem, PaperContainer } from 'components/atoms';
import MUIChipInput from 'material-ui-chip-input';
import Service from 'api/service';

@translate()
class TagsInput extends Component {
	state = {
		suggestions: [],
		value: '',
	};

	static SuggestionsContainer = ({ containerProps, children }) => (
		<PaperContainer {...containerProps}>
			{children}
		</PaperContainer>
	);

	static Input = ({
		placeholder, classes, autoFocus, value, onChange, onAdd, onDelete, tags, ref, ...other
	}) => (
		<MUIChipInput
			allowDuplicates
			fullWidth
			blurBehavior="add"
			newChipKeyCodes={[ 13, 32 ]}
			label={placeholder}
			onUpdateInput={onChange}
			onAdd={onAdd}
			onDelete={onDelete}
			value={tags}
			inputRef={ref}
			InputProps={{
				value,
			}}
			{...other}
		/>
	);

	static Suggestion = suggestion => (
		<MenuItem>
			{suggestion}
		</MenuItem>
	);

	static getSuggestionValue = suggestion => suggestion

	getSuggestions = ({ value }) => {
		if (value.length > 1) {
			Service.request('Discussion/GetTags', { query: value })
				.then(({ tags }) => {
					this.setState({ suggestions: tags.slice(0, 5) });
				});
		}
	};

	clearSuggestions = () => {
		this.setState({ suggestions: [] });
	};

	addTag = (tag) => {
		if (this.props.addTag(tag)) {
			this.setState({ value: '' });
		}
	};

	selectSuggestion = (e, { suggestionValue }) => {
		this.addTag(suggestionValue);
		e.preventDefault();
	};

	deleteTag = (tag) => {
		this.props.deleteTag(tag);
	};

	onChange = (e) => {
		if (!this.props.canAddTag) {
			this.props.setTagsError(true);
		} else {
			this.setState({ value: e.currentTarget.value });
		}
	};

	render() {
		const {
			suggestions, value,
		} = this.state;
		const { error, tags, deleteTag } = this.props;
		const { t } = this.props;
		return (
			<Autosuggest
				className="test"
				suggestions={suggestions}
				onSuggestionsFetchRequested={this.getSuggestions}
				onSuggestionsClearRequested={this.clearSuggestions}
				onSuggestionSelected={this.selectSuggestion}
				getSuggestionValue={TagsInput.getSuggestionValue}
				renderSuggestion={TagsInput.Suggestion}
				renderSuggestionsContainer={TagsInput.SuggestionsContainer}
				renderInputComponent={TagsInput.Input}
				inputProps={{
					placeholder: t('question.tags-placeholder'),
					tags,
					value,
					onAdd: this.addTag,
					onDelete: deleteTag,
					onChange: this.onChange,
					newChipKeyCodes: [ 13, 32 ],
					error,
				}}
			/>
		);
	}
}

export default TagsInput;
