//React modules
import React, { Component } from 'react';

//Additional components
import Reply from './Reply';

class Replies extends Component {
    constructor(props) {
        super(props);
    }

    renderReplies() {
        const replies = this.props.replies;

        return replies.map((reply, index) => {
            return (
                <Reply key={reply.id} reply={reply} votePost={this.props.votePost} remove={this.props.openDeletePopup} isUsersQuestion={this.props.isUsersQuestion} />
            );
        });
    }

    render() {
        return (
            <div id="replies">{this.renderReplies()}</div>
        );
    }
}

export default Replies;