//React modules
import React, { Component } from 'react';
import Radium, { Style } from 'radium';
import ReactDOM from 'react-dom';

//Service
import Service from '../../api/service';

//Utils
import getStyles from '../../utils/styleConverter';

//Material UI components
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import ThumbUp from 'material-ui/svg-icons/action/thumb-up';
import ThumbDown from 'material-ui/svg-icons/action/thumb-down';
import { grey500, blueGrey500, blueGrey600 } from 'material-ui/styles/colors';

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
            transition: 'opacity ease 400ms, transform ease 400ms, -webkit-transform ease 400ms, border-color linear 500ms, box-shadow ease 400ms',
            boxShadow: 'rgba(0, 0, 0, 0.156863) 0px 3px 6px, rgba(0, 0, 0, 0.227451) 0px 3px 6px',

            ':hover': {
                borderLeftColor: '#9CCC65',
                borderBottomColor: '#f6f6f6',
                borderTopColor: '#f6f6f6',
            }
        },
        
        elevated: {
            position: 'relative',
            boxShadow: '0 5px 3px rgba(0,0,0,.12), 0 1px 10px rgba(0,0,0,.24)',
            zIndex: 1000
        }
    },
   
    avatar: {
        overflow: 'hidden',
        float: 'left'
    },

    commentConent: {
        overflow: 'hidden',
        padding: '10px'
    },

    commentDetails: {
        base: {
            position: 'relative',
            overflow: 'hidden',
            padding: '0 0 0 10px'
        },

        editing: {
            padding: '0 0 10px 10px'
        }
    },

    userName: {
        fontSize: '15px',
        fontWeight: '500',
        textDecoration: 'none'
    },

    commentDate: {
        fontSize: '11px',
        float: 'right',
        color: '#777'
    },

    commentMessage: {
        color: 'rgba(0, 0, 0, 0.541176)',
        fontSize: '14px'
    },

    commentControls: {
        base: {
            overflow: 'hidden',
            padding: '8px'
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

    deleteButton: {
        color: '#E53935'
    }
}

class Comment extends Component {
    constructor(props) {
        super(props);
              
        this.comment = this.props.comment;
        this.isReply = this.comment.parentID != null;
        this.votingEnabled = true;

        this.state = {
            isEditing: false,
            isDeleting: false,
            errorText: "",
            textFieldValue: this.comment.message,
            vote: this.comment.vote,
            votes: this.comment.votes
        }
    }

    updateMessage(message) {
        var urlRegex = /((https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*))/gi;

        message = message.replace(/</g, '&lt;')
                         .replace(/>/g, '&gt;')
                         .replace(/\r\n/g, '<br/>')
                         .replace(/\n/g, '<br/>');

        message = message.replace(urlRegex, (match1, match2) => {
            var link = match2;
            var hasHttp = match2.indexOf("http") == 0;

            if (!hasHttp) {
                var has3w = match2.indexOf("www") == 0;

                if (!has3w) {
                    return match2;
                }

                link = "http://" + match2;
            }

            return '<a href=' + link + ' target="_blank" class="inner-link">' + match2 + '</a>';
        });

        return message;
    }

    onChange(e) {
        if(e.target.value.length == 0) {
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
        this.setState({ isEditing: true });
    }

    closeEdit() {
        this.setState({
            isEditing: false,
            errorText: "",
            textFieldValue: this.comment.message
        });
    }

    renderReplies() {
        return this.comment.replies.map((reply, index) => {
            return (
                <Comment 
                    key={reply.id} 
                    quizId={this.props.quizId} 
                    type={this.props.type} 
                    ordering={this.props.oredering}
                    comment={reply}
                    openReplyBoxToolbar={this.props.openReplyBoxToolbar}
                    remove={this.props.remove}/>
            );
        });
    }

    getPrimaryControls() {
        const hasReplies = this.comment.repliesCount > 0;
        return(
           <div className="primary-controls" style={styles.commentControls.right}>
                { !this.isReply && <FlatButton label={this.comment.repliesCount + (this.comment.repliesCount == 1 ?  " Reply" : " Replies")} primary={hasReplies} disabled={!hasReplies} onClick={() => this.props.loadReplies(this.comment.id, "openReplies")} /> }
                { true && <FlatButton label="Edit" primary={true} onClick={() => this.openEdit() } /> }
                <FlatButton label="Reply" primary={true} onClick={() => this.props.openReplyBoxToolbar(this.comment.id, this.comment.parentID, this.comment.userName, this.isReply) } />
            </div>
        );
    }

    getEditControls() {
        let saveDisabled = this.state.errorText.length == 0;
        return(
            <div className="edit-controls" style={styles.commentControls.right}>
                <FlatButton label="Delete" style={styles.deleteButton} onClick={() => this.props.remove()} />
                <FlatButton label="Cancel" onClick={() => this.closeEdit() } />
                <FlatButton label="Save" primary={saveDisabled} disabled={!saveDisabled} onClick={() => this.save()}/>
            </div>
        );
    }

    voting(voteValue) {
        if (!this.votingEnabled) return;

        this.votingEnabled = false;
        let userVote = this.state.vote == voteValue ? 0 : voteValue;
        let votes = this.state.votes + userVote - this.state.vote;
        this.setState({
            vote: userVote,
            votes: votes
        });

        Service.request("Discussion/VoteLessonComment", { id: this.comment.id, vote: userVote }).then((response) => {
            this.votingEnabled = true;
        }).catch((error) => {
            console.log(error);
        });
    }

    getVoteControls() {
        return(
            <div className="vote-controls" style={styles.commentControls.left}>
                <IconButton className="upvote" style={styles.vote.button.base} iconStyle={styles.vote.button.icon} onClick={() => this.voting(1)}>
                    <ThumbUp color={this.state.vote == 1 ? blueGrey500 : grey500} />
                </IconButton>
                <span style={styles.vote.text}>{this.state.votes > 0 ? '+' + this.state.votes : this.state.votes}</span>
                <IconButton className="downvote" style={styles.vote.button.base} iconStyle={styles.vote.button.icon} onClick={() => this.voting(-1)}>
                    <ThumbDown color={this.state.vote == -1 ? blueGrey500 : grey500} />
                </IconButton>
            </div>
        )
    }

    save() {
        this.closeEdit();
        Service.request("Discussion/EditLessonComment", { id: this.comment.id, message: this.state.textFieldValue });
    }

    getEditableArea() {
        return (
            <div style={styles.commentContent}>
                {!this.state.isEditing && <div className="original-message" dangerouslySetInnerHTML={{ __html: this.updateMessage(this.state.textFieldValue) }} style={styles.commentMessage}></div> }
                { (true && this.state.isEditing) &&
                    [<TextField key={"commentTextField" + this.comment.id} hintText="Message" multiLine={true} maxLength="2048" rowsMax={4} fullWidth={true} defaultValue={this.state.textFieldValue}  
                        errorText={this.state.errorText} onChange={(e) => this.onChange(e)} style={styles.textField}/>,
                    <span style={styles.textFieldCoutner} key={"commentCounter" + this.comment.id}>{2048 - this.state.textFieldValue.length} characters remaining</span>]
                }
            </div>
        );
    }

    render() {
        console.log("comment --> render");

        if(!this.isReply) {
            return (           
                <div className="comment-container" style={styles.commentContainer.base}>
                    <div className="primary comment" ref={"comment" + this.comment.id} style={styles.comment.base}>
                        <div className="content" style={styles.commentConent}>
                            <Avatar size={50} style={styles.avatar}>{this.comment.userName.charAt(0)}</Avatar>
                            <div className="comment-details" style={this.state.isEditing ? [styles.commentDetails.base, styles.commentDetails.editing] : styles.commentDetails.base}>
                                <span className="name" style={styles.userName}>{this.comment.userName}</span>
                                <p className="date" style={styles.commentDate}>{this.comment.date}</p>
                                {this.getEditableArea()}
                            </div>
                        </div>
                        <div className="controls" style={styles.commentControls.base}>
                            { this.getVoteControls() }
                            { (true && this.state.isEditing) && this.getEditControls() }
                            { (!this.state.isEditing) && this.getPrimaryControls() }
                        </div>
                    </div>
                    {
                        this.comment.replies.length > 0 && 
                        <div className="replies" style={styles.replies.base}>
                            <div className="replies-content" style={styles.replies.content}>
                                { this.renderReplies() }
                            </div>
                            <div className="gap" style={styles.commentsGap}>
                                {(this.comment.replies.length != this.comment.repliesCount) && <FlatButton label="Load more" primary={true} onClick={() => this.props.loadReplies(this.comment.id, "loadMore")} /> }
                            </div>
                        </div>
                    }
                    {this.state.isDeleting && Popup.getPopup(Popup.generatePopupActions(deleteActions), this.state.isDeleting, this.handleDeleteDialogClose, [{key: "commentDeleteConfirmText", replacemant: ""}])}
                </div> 
            );
        }
        else {
            return ( 
                <div className="secondary comment" ref={"comment" + this.comment.id} style={styles.comment.base}>
                    <div className="content" style={styles.commentConent}>
                        <Avatar size={50} style={styles.avatar}>{this.comment.userName.charAt(0)}</Avatar>
                        <div className="comment-details" style={this.state.isEditing ? getStyles(styles.commentDetails.base, styles.commentDetails.editing) : styles.commentDetails.base}>
                            <span className="name" style={styles.userName}>{this.comment.userName}</span>
                            <p className="date" style={styles.commentDate}>{this.comment.date}</p>
                            {this.getEditableArea()}
                        </div>
                    </div>
                    <div className="controls" style={styles.commentControls.base}>
                        { this.getVoteControls() }
                        { (true && this.state.isEditing) && this.getEditControls() }
                        { (!this.state.isEditing) && this.getPrimaryControls() }
                    </div>
                </div>
            );
        }

        return
    }
}

export default Radium(Comment);

//this.comment.userID == 1042