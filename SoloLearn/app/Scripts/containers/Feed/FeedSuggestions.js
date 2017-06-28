//React modules
import React, { Component } from 'react';

//Additional data and components
import FeedSuggestion from './FeedSuggestion';
import { GridList, GridTile } from 'material-ui/GridList';

const styles = {
    gridList: {
        display: 'flex',
        flexWrap: 'nowrap',
        overflowX: 'auto'
    },

    tileStyle: {
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'visible'
    }
}

class FeedSuggestions extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    renderSuggestions() {
        return (
            <GridList
                style={styles.gridList}
                cols={2}
                cellHeight={150}
                padding={8}>
                {this.props.suggestions.map((suggestion, index) => (
                    <GridTile
                        key={"suggestion" + suggestion.id}
                        style={styles.tileStyle}
                    >
                        <FeedSuggestion className="suggestion-wrapper" suggestion={suggestion} />
                    </GridTile>
                ))}
            </GridList>
        );
    }

    render() {
        return (
            <div className="feed-suggestions">
                {this.renderSuggestions()}
            </div>
        );
    }
}

export default FeedSuggestions;