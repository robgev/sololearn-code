//React modules
import React, { Component } from 'react';
import { Link } from 'react-router';
import Radium, { Style } from 'radium';

//Redux modules
import { connect } from 'react-redux';
import { isLoaded } from '../../reducers';

//Service
import Service from '../../api/service';

//Additional components
import LoadingOverlay from '../../components/Shared/LoadingOverlay';
import Questions from './Questions';

//Material UI components
import AutoComplete from 'material-ui/AutoComplete';
import SearchIcon from 'material-ui/svg-icons/action/search';
import Clear from 'material-ui/svg-icons/content/clear';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import { grey700 } from 'material-ui/styles/colors';

const styles = {
    container: {
        position: 'relative',
        flex: '1 1 auto'
    },

    toolbar: {
        overflow: 'hidden',
        padding: '5px',
        boxShadow: '0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
    },

    search: {
        float: 'left',
        margin: '0 0 0 15px'
    },

    searchIcon: {
        display: 'inline-block',
        verticalAlign: 'middle'
    },

    searchInput: {
        display: 'inline-block',
        verticalAlign: 'middle',
        margin: '0 5px'
    },

    searchSuggestionsList: {
        height: '200px'
    },

    clearIcon: {
        display: 'inline-block',
        verticalAlign: 'middle',
        cursor: 'pointer'
    },

    discussFilter: {
        float: 'right'
    }
}

class QuestionsBase extends Component {
    state = {
        suggestions: [],
        query: "",
        ordering: 8
    }

    //Get search suggestions
    handleUpdateInput = (searchText) => {
        if(searchText == this.state.query) return;

        this.setState({ query: searchText });

        Service.request("Discussion/getTags", { query: searchText }).then((response) => {
            this.setState({ suggestions: response.tags })
        }).catch((error) => {
            console.log(error);
        });
    }

    //Clear search input
    clearSearchInput = () => {
        this.setState({ query: "" });
        this.refs.questions.getWrappedInstance().loadQuestionByState();
    }

    //Change discuss oredering
    handleFilterChange = (e, index, value) => {
        this.setState({ ordering: value });
        this.refs.questions.getWrappedInstance().loadQuestionByState();
    }
    render() {
        return (
            <div className="discuss" style={styles.container}>
                <div className="toolbar" style={styles.toolbar}>
                    <div className="search" style={styles.search}>
                        <SearchIcon color={grey700} style={styles.searchIcon} />
                        <AutoComplete
                            style={styles.searchInput}
                            menuStyle={styles.searchSuggestionsList}
                            hintText="Search..."
                            searchText={this.state.query}
                            underlineStyle={{display: 'none'}}
                            dataSource={this.state.suggestions} 
                            onUpdateInput={(value) => this.handleUpdateInput(value)}
                            onNewRequest={this.loadQuestionByState}
                            filter={(searchText, key) => true} />
                        { this.state.query.length > 0 && <Clear color={grey700} style={styles.clearIcon} onClick={this.clearSearchInput}/> }
                    </div>
                    <DropDownMenu style={styles.discussFilter} value={this.state.ordering} onChange={this.handleFilterChange} autoWidth={false}>
                        <MenuItem style={styles.discussFilterItem} value={8} primaryText="Trending" />
                        <MenuItem style={styles.discussFilterItem} value={1} primaryText="Most Recent" />
                        <MenuItem style={styles.discussFilterItem} value={2} primaryText="Most Popular" />
                        <MenuItem style={styles.discussFilterItem} value={3} primaryText="Most Answered" />
                        <MenuItem style={styles.discussFilterItem} value={4} primaryText="Unanswered" />
                        <MenuItem style={styles.discussFilterItem} value={5} primaryText="My Questions" />
                        <MenuItem style={styles.discussFilterItem} value={6} primaryText="My Answers" />
                    </DropDownMenu>
                </div>
                <Questions
                    questions={this.props.questions}
                    isLoaded={this.props.isLoaded}
                    ordering={this.state.ordering}
                    query={this.state.query}
                    isUserProfile={false}
                    ref={"questions"} />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        isLoaded: isLoaded(state, "discuss"),
        questions: state.questions       
    };
}

export default connect(mapStateToProps, () => { return {} })(Radium(QuestionsBase));