//React modules
import React, { Component } from 'react';
import { Link } from 'react-router';

//Redux modules
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAllPlayersInternal, emptyAllPlayers } from '../../../actions/challenges';
import { isLoaded } from '../../../reducers';

//Additional components
import Opponents from './Opponents';

//Material UI components
import TextField from 'material-ui/TextField';
import SearchIcon from 'material-ui/svg-icons/action/search';
import Clear from 'material-ui/svg-icons/content/clear';
import RaisedButton from 'material-ui/RaisedButton';
import { grey500, grey700, blueGrey500 } from 'material-ui/styles/colors';

const styles = {
    container: {
        position: 'relative'
    },

    toolbar: {
        display: 'flex',
        alignItems: 'center',
        padding: '5px',
        boxShadow: '0 5px 3px rgba(0,0,0,.12)'
    },

    searchInput: {
        margin: '0 5px'
    },

    clearIcon: {
        cursor: 'pointer'
    },

    footer: {
    
    }
}

class AllPlayers extends Component {

    state = {
        query: "",
    }

    //Handle search
    handleInputChange = (e) => {
        let value = e.target.value;
        if (value == this.state.query) return;

        this.setState({ query: value });
    }

    //Detect enter on input
    handleKeyPress = (e) => {
        if (e.key === 'Enter' && this.state.query.length > 0) {
            this.props.emptyAllPlayers().then(() => {
                this.refs.opponents.loadOpponents();
            });
        }
    }

    //Clear search input
    clearSearchInput = () => {
        this.setState({ query: "" });
        this.props.emptyAllPlayers().then(() => {
            this.refs.opponents.loadOpponents();
        });
    }

    getOpponents = () => {
        return this.props.getAllPlayersInternal(this.state.query, this.props.courseId);
    }

    render() {
        return (
            <div id="all-players" style={styles.container}>
                <div className="toolbar" style={styles.toolbar}>
                    <SearchIcon color={grey700} style={styles.searchIcon} />
                    <TextField
                        hintText="Search..."
                        style={styles.searchInput}
                        underlineStyle={{ display: 'none' }}
                        value={this.state.query}
                        onChange={this.handleInputChange}
                        onKeyPress={this.handleKeyPress}
                        fullWidth={true} />
                    {   this.state.query.length > 0 
                        && <Clear color={grey700} style={styles.clearIcon} onClick={this.clearSearchInput} />   }
                </div>
                <Opponents
                    getOpponents={this.getOpponents}
                    opponents={this.props.opponents}
                    isLoaded={this.props.isLoaded}
                    notFollowers={true}
                    ref="opponents"
                />
                <div style={styles.footer}>
                    <RaisedButton label="Random Opponent" secondary={true} />
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        isLoaded: isLoaded(state, "allPlayers"),
        opponents: state.challenges.allPlayers,
        courseId: state.challenges.courseId
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getAllPlayersInternal,
        emptyAllPlayers
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AllPlayers);