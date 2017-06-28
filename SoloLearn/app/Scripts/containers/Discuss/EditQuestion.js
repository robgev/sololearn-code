//React modules
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import Radium, { Style } from 'radium';

//Redux modules
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadDefaults } from '../../actions/defaultActions';
import { editQuestion, loadPostInternal } from '../../actions/discuss';
import { isLoaded, defaultsLoaded } from '../../reducers';

//Service
import Service from '../../api/service';

//Additional components
import LoadingOverlay from '../../components/Shared/LoadingOverlay';

//Material UI components
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import ChipInput from 'material-ui-chip-input';
import { lightGreen400 } from 'material-ui/styles/colors';

const styles = {
    container: {
        width: '1000px',
        position: 'relative',
        margin: '20px auto',
        padding: '10px 20px'
    },

    heading: {
        fontWeight: 'normal'
    },

    questionData: {
        position: 'relative',
        padding: '0 0 10px 0'
    },

    textField: {
        margin: 0,
        fontSize: '13px'
    },

    textFieldCoutner: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        fontSize: '13px',
        fontWeight: '500'
    },

    editorActions: {
        textAlign: 'right',
        margin: '15px 0 0 0'
    },

    tag: {
        display: 'inline-block',
        verticalAlign: 'middle',
        backgroundColor: '#9CCC65',
        color: '#fff',
        fontSize: '12px',
        padding: '3px 5px',
        borderRadius: '3px',
        margin: '8px 8px 0 0'
    }
}


class EditQuestion extends Component {
    constructor(props) {
        super(props);

        const { isLoaded, post } = this.props;

        this.state = {
            title: isLoaded ? post.title : "",
            titleErrorText: "",
            message: isLoaded ? post.message : "",
            tags: isLoaded ? post.tags : [],
            tagsErrorText: "",
            suggestions: [],
            isLoading: false,
            editorLoaded: isLoaded
        }

        this.onTitleChange = this.onTitleChange.bind(this);
        this.onMessageChange = this.onMessageChange.bind(this);
        this.handleUpdateInput = this.handleUpdateInput.bind(this);
        this.handleTagsChange = this.handleTagsChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    //Detect title change
    onTitleChange(e) {
        this.setState({ title: e.target.value });
    }

    //Detect title change
    onMessageChange(e) {
        this.setState({ message: e.target.value });
    }

    //Collect tags into one array
    handleTagsChange(chips) {
        this.setState({ tags: chips });
    }

    //Get search suggestions
    handleUpdateInput(searchText) {
        if (searchText.length < 2) return;

        Service.request("Discussion/getTags", { query: searchText }).then((response) => {
            this.setState({ suggestions: response.tags })
        }).catch((error) => {
            console.log(error);
        });
    }

    //Customly render tag
    renderChip({ value, isFocused, isDisabled, handleClick, handleRequestDelete }, key) {
        return (
            <div key={key} style={styles.tag}>{value}</div>
        );
    }

    //Add question form submit
    handleSubmit(e) {
        e.preventDefault();

        let allowSubmit = this.state.title.length != 0 && this.state.tags.length != 0;

        if (!allowSubmit) {
            this.setState({
                titleErrorText: this.state.title.length == 0 ? "Question is required" : "",
                tagsErrorText: this.state.tags.length == 0 ? "Add at least one tag" : ""
            });
        }
        else {
            this.setState({ isLoading: true });

            this.props.editQuestion(this.props.post.id, this.state.title, this.state.message, this.state.tags).then((response) => {
                browserHistory.push('/discuss/' + response.id + '/' + response.alias);
            });
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
                            fullWidth={true}
                            defaultValue={this.state.title}
                            errorText={this.state.titleErrorText}
                            onChange={(e) => this.onTitleChange(e)}
                            style={styles.textField} />
                        <span style={styles.textFieldCoutner}>{128 - this.state.title.length} characters remaining</span>
                    </div>
                    <div className="question-data" style={styles.questionData}>
                        <TextField
                            floatingLabelText="Description"
                            multiLine={true}
                            rowsMax={4}
                            fullWidth={true}
                            defaultValue={this.state.message}
                            onChange={(e) => this.onMessageChange(e)}
                            style={styles.textField} />
                        <span style={styles.textFieldCoutner}>{512 - this.state.message.length} characters remaining</span>
                    </div>
                    <div className="question-data" style={styles.questionData}>
                        <ChipInput
                            chipRenderer={this.renderChip}
                            onUpdateInput={this.handleUpdateInput}
                            dataSource={this.state.suggestions}
                            defaultValue={this.state.tags}
                            onChange={(chips) => this.handleTagsChange(chips)}
                            fullWidth={true}
                            fullWidthInput={true}
                            floatingLabelText="Relevant Tags"
                            errorText={this.state.tagsErrorText}
                        />
                    </div>
                    <div className="editor-actions" style={styles.editorActions}>
                        <FlatButton type="submit" label="EDIT" primary={true} />
                    </div>
                </form>
            </Paper>
        );
    }

    componentWillMount() {
        let params = this.props.params;

        //Getting defaults
        if (!this.props.defaultsLoaded) {
            this.props.loadDefaults().then((response) => {
                if (!this.props.isLoaded) {
                    //Loading post data
                    this.props.loadPostInternal(params.id).then(() => {
                        const { post } = this.props;

                        this.setState({
                            title: post.title,
                            message: post.message,
                            tags: post.tags,
                            editorLoaded: true
                        });

                        console.log(this.state);
                    }).catch((error) => {
                        console.log(error);
                    });;
                }
            }).catch((error) => {
                console.log(error);
            });
        }
        else {
            if (!this.props.isLoaded) {
                //Loading post data
                this.props.loadPostInternal(params.id).then(() => {
                    const { post } = this.props;
                    
                    this.setState({
                        title: post.title,
                        message: post.message,
                        tags: post.tags,
                        editorLoaded: true
                    });
                }).catch((error) => {
                    console.log(error);
                });;
            }
        }
    }
}

function mapStateToProps(state) {
    return {
        defaultsLoaded: defaultsLoaded(state),
        isLoaded: isLoaded(state, "discussPost"),
        post: state.discussPost
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        loadPostInternal: loadPostInternal,
        editQuestion: editQuestion,
        loadDefaults: loadDefaults
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Radium(EditQuestion));