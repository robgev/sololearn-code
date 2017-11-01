import React, { Component } from 'react';
import { Link } from 'react-router';
import { noStyleLink } from './QuestionItem';

const styles = {
    base: {
        display: 'inline-block',
        verticalAlign: 'middle',
        backgroundColor: '#9CCC65',
        color: '#fff',
        fontSize: '12px',
        padding: '3px 5px',
        borderRadius: '3px'
    },

    margin: {
        margin: '0 0 0 5px'
    }
}

const DiscussTag = ({ tag, index }) => {
    return(
        <div
            style={index == 0 ? styles.base : {...styles.base, ...styles.margin}}
        >
            <Link to={`/feed/`} style={noStyleLink}>
                {tag}
            </Link>
        </div>
    )
}

export default DiscussTag;