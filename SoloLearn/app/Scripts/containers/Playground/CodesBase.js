//React modules
import React, { Component } from 'react';
import { Link } from 'react-router';
import Radium, { Style } from 'radium';

//Redux modules
import { connect } from 'react-redux';
import { isLoaded } from '../../reducers';

//Additional components
import Codes from './Codes';

//Material UI components
import TextField from 'material-ui/TextField';
import SearchIcon from 'material-ui/svg-icons/action/search';
import Clear from 'material-ui/svg-icons/content/clear';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import { grey500, grey700, blueGrey500 } from 'material-ui/styles/colors';

const styles = {
    container: {
        position: 'relative'
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

    clearIcon: {
        display: 'inline-block',
        verticalAlign: 'middle',
        cursor: 'pointer'
    },

    codesFilter: {
        float: 'right'
    },

    languageFilter: {
        float: 'right'
    }
}

class CodesBase extends Component {
    constructor(props) {
        super(props);

        this.state = {
            query: "",
            ordering: 4,
            language: ""
        }

        this.clearSearchInput = this.clearSearchInput.bind(this);
        this.handleOrderingFilterChange = this.handleOrderingFilterChange.bind(this);
        this.handleLanguageFilterChange = this.handleLanguageFilterChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    //Handle search
    handleInputChange(e) {
        let value = e.target.value;
        if (value == this.state.query) return;

        this.setState({ query: value });
    }

    //Detect enter on input
    handleKeyPress(e) {
        if (e.key === 'Enter' && this.state.query.length > 0) {
            this.refs.codes.getWrappedInstance().loadCodesByState();
        }
    }

    //Clear search input
    clearSearchInput() {
        this.setState({ query: "" });
        this.refs.codes.getWrappedInstance().loadCodesByState();
    }

    //Change discuss oredering
    handleOrderingFilterChange(e, index, value) {
        this.setState({ ordering: value });
        this.refs.codes.getWrappedInstance().loadCodesByState();
    }

    //Change codes language
    handleLanguageFilterChange(e, index, value) {
        this.setState({ language: value });
        this.refs.codes.getWrappedInstance().loadCodesByState();
    }

    render() {
        return (
            <div className="codes" style={styles.container}>
                <div className="toolbar" style={styles.toolbar}>
                    <div className="search" style={styles.search}>
                        <SearchIcon color={grey700} style={styles.searchIcon} />
                        <TextField
                            hintText="Search..."
                            style={styles.searchInput}
                            underlineStyle={{ display: 'none' }}
                            value={this.state.query}
                            onChange={this.handleInputChange}
                            onKeyPress={this.handleKeyPress} />
                        {this.state.query.length > 0 && <Clear color={grey700} style={styles.clearIcon} onClick={this.clearSearchInput} />}
                    </div>
                    <DropDownMenu style={styles.languageFilter} value={this.state.language} onChange={this.handleLanguageFilterChange} autoWidth={false}>
                        <MenuItem value={""} primaryText="All" />
                        <MenuItem value={"cpp"} primaryText="C++" />
                        <MenuItem value={"cs"} primaryText="C#" />
                        <MenuItem value={"java"} primaryText="Java" />
                        <MenuItem value={"py"} primaryText="Python" />
                        <MenuItem value={"rb"} primaryText="Ruby" />
                        <MenuItem value={"php"} primaryText="PHP" />
                        <MenuItem value={"web"} primaryText="Web" />
                    </DropDownMenu>
                    <DropDownMenu style={styles.codesFilter} value={this.state.ordering} onChange={this.handleOrderingFilterChange} autoWidth={false}>
                        <MenuItem value={4} primaryText="Trending" />
                        <MenuItem value={2} primaryText="Most Popular" />
                        <MenuItem value={1} primaryText="Most Recent" />
                        <MenuItem value={3} primaryText="My Codes" />
                    </DropDownMenu>
                </div>
                <Codes codes={this.props.codes} isLoaded={this.props.isLoaded} ordering={this.state.ordering} language={this.state.language} query={this.state.query} isUserProfile={false} ref="codes" />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        isLoaded: isLoaded(state, "playground"),
        codes: state.codes
    };
}

export default connect(mapStateToProps, () => { return {} })(Radium(CodesBase));