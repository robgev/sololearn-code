﻿//React modules
import React, { Component } from 'react';

//Material UI components
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import ThumbUp from 'material-ui/svg-icons/action/thumb-up';
import ThumbDown from 'material-ui/svg-icons/action/thumb-down';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { grey500, blueGrey500, blueGrey600 } from 'material-ui/styles/colors';

//Utils
import numberFormatter from '../../utils/numberFormatter';
import updateDate from '../../utils/dateFormatter';
import updateMessage from '../../utils/messageFormatter';
import getStyles from '../../utils/styleConverter';

const styles = {
    commentContainer: {
        base: {
            position: 'relative'
        },

        elevated: {
            boxShadow: '0 5px 3px rgba(0,0,0,.12), 0 1px 10px rgba(0,0,0,.24)',
            zIndex: 1000
        }
    },

    comment: {
        base: {
            position: 'relative',
            backgroundColor: '#fff',
            borderRadius: 0,
            borderLeftStyle: 'solid',
            borderLeftWidth: '3px',
            borderLeftColor: '#fff',
            borderBottomStyle: 'solid',
            borderBottomWidth: '1px',
            borderBottomColor: '#fafafa',
            borderTopStyle: 'solid',
            borderTopWidth: '1px',
            borderTopColor: '#fafafa',
            transition: 'opacity ease 400ms, transform ease 400ms, -webkit-transform ease 400ms',
            boxShadow: 'rgba(0, 0, 0, 0.156863) 0px 3px 6px, rgba(0, 0, 0, 0.227451) 0px 3px 6px',
        },
        
        elevated: {
            position: 'relative',
            boxShadow: '0 5px 3px rgba(0,0,0,.12), 0 1px 10px rgba(0,0,0,.24)',
            zIndex: 1000
        }
    },

    commentConent: {
        display: 'flex',
        padding: '10px'
    },

    commentDetailsWrapper: {
        base: {
            flex: 1,
            position: 'relative',
            overflow: 'hidden',
            padding: '0 0 0 10px'
        },

        editing: {
            padding: '0 0 10px 10px'
        }
    },

    commentDetails: {
        position: 'relative'
    },

    heading: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    iconMenu: {
        icon: {
            width: 'inherit',
            height: 'inherit',
            padding: 0
        }
    },

    userName: {
        fontSize: '14px',
        color: '#636060',
        margin: '0px 0px 5px 0px'
    },

    commentDate: {
        fontSize: '12px',
        color: '#777'
    },

    commentMessage: {
        fontSize: '13px',
        color: '#827e7e',
        margin: '3px 0px 5px',
        whiteSpace: 'pre-line'
    },

    commentControls: {
        base: {
            margin: '8px 0 0 0',
            overflow: 'hidden'
        },

        left: {
            float: 'left'
        },

        right: {
            float: 'right'
        }
    },

    replies: {
        base: {
            backgroundColor: '#dedede',
            zIndex: 999
        },

        content: {
            margin: '0 0 0 15px',
        }
    },

    commentsGap: {
        minHeight: '20px',
        textAlign: 'center'
    },

    vote: {
        button: {
            base: {
                verticalAlign: 'middle',
                width: '32px',
                height: '32px',
                padding: '8px'
            },

            icon: {
                width: '16px',
                height: '16px'
            }
        },

        text: {
            display: 'inline-block',
            verticalAlign: 'middle',
            minWidth: '23px',
            textAlign: 'center',
            fontWeight: '500',
            fontSize: '15px'
        }
    },

    textField: {
        margin: '0 0 10px 0',
        fontSize: '13px'
    },

    textFieldCoutner: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        fontSize: '13px',
        fontWeight: '500'
    },

    deleteButton: {
        color: '#E53935'
    }
}

class Comment extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errorText: "",
            textFieldValue: this.props.comment.message
        }

        this.openEdit = this.openEdit.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
    }

    onChange(e) {
        if (e.target.value.length == 0) {
            this.setState({
                textFieldValue: e.target.value,
                errorText: "This field is required"
            })
        }
        else {
            this.setState({
                textFieldValue: e.target.value,
                errorText: ""
            })
        }
    }

    openEdit() {
        const comment = this.props.comment;

        this.props.openEdit(comment.id, comment.parentID, comment.userName);
    }

    closeEdit() {
        this.props.cancelAll();

        this.setState({
            errorText: "",
            textFieldValue: this.props.comment.message
        });
    }

    renderReplies() {
        return this.props.comment.replies.map((reply, index) => {
            return (
                <Comment
                    key={reply.id}
                    comment={reply}
                    isEditing={this.props.isEditing}
                    isReplying={this.state.isReplying}
                    activeComment={this.props.activeComment}
                    openEdit={this.props.openEdit}
                    cancelAll={this.props.cancelAll}
                    openReplyBoxToolbar={this.props.openReplyBoxToolbar}
                    voteComment={this.props.voteComment}
                    editComment={this.props.editComment}
                    deleteComment={this.props.deleteComment} />
            );
        });
    }

    getPrimaryControls(comment) {
        const isReply = comment.parentID != null;
        const hasReplies = comment.repliesCount > 0;

        return (
            <div className="primary-controls" style={styles.commentControls.right}>
                {!isReply && <FlatButton label={comment.repliesCount + (comment.repliesCount == 1 ? " Reply" : " Replies")} primary={hasReplies} disabled={!hasReplies} onClick={() => this.props.loadReplies(comment.id, "openReplies")} />}
                <FlatButton label="Reply" primary={true} onClick={() => this.props.openReplyBoxToolbar(comment.id, comment.parentID, comment.userName, isReply)} />
            </div>
        );
    }

    getEditControls() {
        let saveDisabled = this.state.errorText.length == 0;

        return (
            <div className="edit-controls" style={styles.commentControls.right}>
                <FlatButton label="Cancel" onClick={this.closeEdit} />
                <FlatButton label="Save" primary={saveDisabled} disabled={!saveDisabled} onClick={() => { this.props.editComment(this.props.comment, this.state.textFieldValue) }} />
            </div>
        );
    }

    getMenuControls(comment) {
        return (
            <IconMenu
                iconButtonElement={<IconButton style={styles.iconMenu.icon}><MoreVertIcon /></IconButton>}
                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                targetOrigin={{ horizontal: 'right', vertical: 'top' }}>
                {
                    comment.userID == 24379 ?
                        [<MenuItem primaryText="Edit" key={"edit" + comment.id} onClick={this.openEdit} />,
                        <MenuItem primaryText="Delete" key={"remove" + comment.id} onClick={() => { this.props.deleteComment(comment) }} />]
                        :
                        <MenuItem primaryText="Report" key={"report" + comment.id} />
                }
            </IconMenu>
        );
    }

    getVoteControls(comment) {
        return (
            <div className="vote-controls" style={styles.commentControls.left}>
                <IconButton className="upvote" style={styles.vote.button.base} iconStyle={styles.vote.button.icon} onClick={() => this.props.voteComment(comment, 1)}>
                    <ThumbUp color={comment.vote == 1 ? blueGrey500 : grey500} />
                </IconButton>
                <span style={styles.vote.text}>{comment.votes > 0 ? '+' + comment.votes : comment.votes}</span>
                <IconButton className="downvote" style={styles.vote.button.base} iconStyle={styles.vote.button.icon} onClick={() => this.props.voteComment(comment, -1)}>
                    <ThumbDown color={comment.vote == -1 ? blueGrey500 : grey500} />
                </IconButton>
            </div>
        )
    }

    getEditableArea(comment) {
        const isEditing = (this.props.isEditing && this.props.activeComment.id === comment.id);

        return (
            <div style={styles.commentContent}>
                {!isEditing && <div className="original-message" dangerouslySetInnerHTML={{ __html: updateMessage(this.state.textFieldValue) }} style={styles.commentMessage}></div>}
                {isEditing &&
                    [<TextField key={"commentTextField" + comment.id} hintText="Message" multiLine={true} maxLength="2048" rowsMax={4} fullWidth={true} defaultValue={this.state.textFieldValue}
                        errorText={this.state.errorText} onChange={(e) => this.onChange(e)} style={styles.textField} />,
                    <span style={styles.textFieldCoutner} key={"commentCounter" + comment.id}>{2048 - this.state.textFieldValue.length} characters remaining</span>]
                }
            </div>
        );
    }

    render() {
        console.log("RENDER");

        const comment = this.props.comment;
        const isReply = comment.parentID != null;
        const isEditing = (this.props.isEditing && this.props.activeComment.id === comment.id);

        if (!isReply) {
            return (
                <div className="comment-container" style={styles.commentContainer.base}>
                    <div className="primary comment" style={styles.comment.base}>
                        <div className="content" style={styles.commentConent}>
                            <Avatar size={40} style={styles.avatar}>{comment.userName.charAt(0)}</Avatar>
                            <div className="comment-details-wrapper" style={isEditing ? getStyles(styles.commentDetailsWrapper.base, styles.commentDetailsWrapper.editing) : styles.commentDetailsWrapper.base}>
                                <div className="comment-details" style={styles.commentDetails}>
                                    <div style={styles.heading}>
                                        <span className="name" style={styles.userName}>{comment.userName}</span>
                                        <div style={styles.heading}>
                                            <p className="date" style={styles.commentDate}>{updateDate(comment.date)}</p>
                                            {!isEditing && this.getMenuControls(comment)}
                                        </div>
                                    </div>
                                    {this.getEditableArea(comment)}
                                </div>
                                <div className="controls" style={styles.commentControls.base}>
                                    {!isEditing && this.getVoteControls(comment)}
                                    {isEditing && this.getEditControls()}
                                    {!isEditing && this.getPrimaryControls(comment)}
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        comment.replies.length > 0 &&
                        <div className="replies" style={styles.replies.base}>
                            <div className="replies-content" style={styles.replies.content}>
                                {this.renderReplies()}
                            </div>
                            <div className="gap" style={styles.commentsGap}>
                                {(comment.replies.length != comment.repliesCount) && <FlatButton label="Load more" primary={true} onClick={() => this.props.loadReplies(comment.id, "loadMore")} />}
                            </div>
                        </div>
                    }
                </div>
            );
        }
        else {
            return (
                <div className="secondary comment" style={styles.comment.base}>
                    <div className="content" style={styles.commentConent}>
                        <Avatar size={40} style={styles.avatar}>{comment.userName.charAt(0)}</Avatar>
                        <div className="comment-details-wrapper" style={isEditing ? getStyles(styles.commentDetailsWrapper.base, styles.commentDetailsWrapper.editing) : styles.commentDetailsWrapper.base}>
                            <div className="comment-details" style={styles.commentDetails}>
                                <div style={styles.heading}>
                                    <span className="name" style={styles.userName}>{comment.userName}</span>
                                    <div style={styles.heading}>
                                        <p className="date" style={styles.commentDate}>{updateDate(comment.date)}</p>
                                        {!isEditing && this.getMenuControls(comment)}
                                    </div>
                                </div>
                                {this.getEditableArea(comment)}
                            </div>
                            <div className="controls" style={styles.commentControls.base}>
                                {!isEditing && this.getVoteControls(comment)}
                                {isEditing && this.getEditControls()}
                                {!isEditing && this.getPrimaryControls(comment)}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (((this.props.comment.id === nextProps.activeComment.id || this.props.comment.id === nextProps.activeComment.parentId)
                && (this.props.isEditing !== nextProps.isEditing || this.props.isReplying !== nextProps.isReplying))
            || this.props.comment.replies.length !== nextProps.comment.replies.length
            || this.props.comment.vote !== nextProps.comment.vote
            || this.state.errorText !== nextState.errorText
            || this.state.textFieldValue !== nextState.textFieldValue);
    }
}

export default Comment;
