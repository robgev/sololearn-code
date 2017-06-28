//React modules
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Radium, { Style } from 'radium';

//Service
import Service from '../../api/service';

//Popups
import Popup from '../../api/popupService';

//Additional components
import Comment from './Comment';
import LoadingOverlay from '../../components/Shared/LoadingOverlay';

//Material UI components
import Dialog from 'material-ui/Dialog';
import Avatar from 'material-ui/Avatar';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Close from 'material-ui/svg-icons/content/clear';
import { grey600 } from 'material-ui/styles/colors';

//Utils
import getStyles from '../../utils/styleConverter';

const styles = {
    dialogBody: {
        position: 'relative',
        padding: 0,
        minHeight: '300px'
    },

    comments: {
        position: 'relative'
    },

    commentsOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        zIndex: 1000,
        backgroundColor: 'rgba(248, 248, 248, .4)'
    },

    commentsFilterWrapper: {
        padding: 0
    },

    commentsFilter: {
        base: {
            position: 'relative',
            backgroundColor: 'rgb(232, 232, 232)',
            boxShadow: '0 3px 6px rgba(0,0,0,.16), 0 3px 6px rgba(0,0,0,.23)',
            zIndex: 1005
        },

        title: {
            lineHeight: '61px',
            fontSize: '15px'
        }
    },

    filterDropDown: {
        base: {
            width: '170px',
            padding: '0 10px' 
        },

        item: {
            padding: '0' 
        }
    },

    replyBoxWrapper: {
        position: 'relative',
        padding: 0,
        textAlign: 'left',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.227451)',
    },
         
    replyBox: {
        base: {
            width: 'inherit',
            margin: '0 auto 10px',
            backgroundColor: '#fff'
        },

        elevated: {
            zIndex: 1001
        }
    },

    avatar: {
        overflow: 'hidden',
        float: 'left'
    },

    replyBoxConent: {
        overflow: 'hidden',
        padding: '8px 5px 5px 5px'
    },

    replyBoxDetails: {
        overflow: 'hidden',
        padding: '0 0 0 10px'
    },

    userName: {
        fontSize: '15px',
        fontWeight: '500',
        textDecoration: 'none'
    },

    replyBoxControls: {
        overflow: 'hidden',
        padding: '0 5px 5px 0',
        textAlign: 'right'
    },

    textField: {
        fontSize: '13px'
    },

    replyBoxToolbar: {
        overflow: 'hidden',
        padding: '5px',
        borderBottom: '1px solid #dedede',
        fontSize: '13px',
        color: '#928f8f'
    },

    replyBoxToolbarText: {
        float: 'left',
        margin: '5px 0 0 0',

        user: {
            fontWeight: 500
        }
    },

    close: {
        button: {
            comments: {
                margin: '0 10px'
            },

            reply: {
                float: 'right',
                verticalAlign: 'middle',
            },

            small: {
                width: '24px',
                height: '24px',
                padding: '6px'
            },

            big: {
                width: '40px',
                height: '40px',
                padding: '10px'
            }
        },

        icon: {
            small: {
                width: '12px',
                height: '12px'
            },

            big: {
                width: '20px',
                height: '20px'
            }
        }
    }
}

class ReplyBox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errorText: "",
            textFieldValue: ""
        }
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

    render() {
        return(
            <div id="reply-box-wrapper" style={!this.props.isPrimary ? getStyles(styles.replyBox.base, styles.replyBox.elevated) : styles.replyBox.base}>
                {!this.props.isPrimary &&
                    <div className="toolbar" style={styles.replyBoxToolbar}>
                        <p style={styles.replyBoxToolbarText}>Repling to <span style={styles.replyBoxToolbarText.user}>{this.props.userName}</span></p>
                        <IconButton className="cancel-reply" style={getStyles(styles.close.button.reply, styles.close.button.small)} iconStyle={styles.close.icon.small} onClick={() => this.props.closeToolbar()}>
                            <Close color={grey600} />
                        </IconButton>
                    </div>
                }
                <div className="reply-box">
                    <div className="content" style={styles.replyBoxConent}>
                        <Avatar size={50} style={styles.avatar}>JF</Avatar>
                        <div className="comment-details" style={styles.replyBoxDetails}>
                            <span className="name" style={styles.userName}>James Flanders</span>
                            <TextField hintText="Message" multiLine={true} rowsMax={4} fullWidth={true} style={styles.textField} key={this.props.defaultText} 
                                errorText={this.state.errorText} defaultValue={this.props.defaultText} onChange={(e) => this.onChange(e)} />
                        </div>
                    </div>
                    <div className="controls" style={styles.replyBoxControls}>
                        <FlatButton label="Reply" primary={true} onClick={() => this.props.reply(this.state.textFieldValue)} />
                    </div>
                </div>
            </div>
        );
    }
}

class Comments extends Component {
    constructor(props) {
        super(props);

        this.state = {
            comments: [],
            isLoading: false,
            fullyLoaded: false,
            ordering: 2,
            isEditing: false,
            isReplying: false,
            isDeleting: false,
            activeComment: {
                id: null,
                parentId: null,
                userName: ""
            }
        }

        this.loadComments = this.loadComments.bind(this);
        this.loadReplies = this.loadReplies.bind(this);

        this.openReplyBoxToolbar = this.openReplyBoxToolbar.bind(this);
        this.openEdit = this.openEdit.bind(this);
        this.cancelAll = this.cancelAll.bind(this);
        this.handleDeleteDialogOpen = this.handleDeleteDialogOpen.bind(this);
        this.handleDeleteDialogClose = this.handleDeleteDialogClose.bind(this);

        this.reply = this.reply.bind(this);
        this.remove = this.remove.bind(this);

        this.handleScroll = this.handleScroll.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    loadCommentsInternal(quizId, type, parentId, index, count, oredring) {
        return Service.request("Discussion/GetLessonComments", { quizId: quizId, type: type, parentId: parentId, index: index, count: count, orderby: oredring }); //Oredering 1-Most Popular, 2-Most Recent
    }

    loadComments() {
        this.loadCommentsInternal(this.props.quizId, this.props.type, null, this.state.comments.length, 20, this.state.ordering).then(response => {
            if(response.comments.length > 0) {
                let loadedComments = this.state.comments;
                for (let i = 0; i < response.comments.length; i++) {
                    let comment = response.comments[i];
                    comment.repliesCount = comment.replies;
                    comment.replies = [];
                    loadedComments.push(comment);
                }

                this.setState({ comments: loadedComments });
            }
            else {
                this.setState({ fullyLoaded: true });
            }
        }).catch(error => {
            console.log(error);
        });
    }

    renderComments() {
        return this.state.comments.map((comment, index) => {
            return (
                <Comment key={comment.id}
                    quizId={this.props.quizId} 
                    type={this.props.type} 
                    ordering={this.state.ordering}
                    comment={comment}
                    loadReplies={comment.parentID == null ? this.loadReplies : undefined}
                    openEdit={this.openEdit}
                    closeEdit={this.cancelAll}
                    openReplyBoxToolbar={this.openReplyBoxToolbar}
                    editState={this.state.isEditing}
                    editOpened={this.state.isEditing && comment.id == this.state.activeComment.id}
                    activeComment={this.state.activeComment}
                    remove={this.handleDeleteDialogOpen}/>
            );
        });
    }

    
    loadReplies(commentId, type) {
        let comments = this.state.comments;
        let index = comments.findIndex(c => c.id == commentId);
        let activeComment = comments[index];
        let loadedReplies = activeComment.replies;
        let forcedReplies = loadedReplies.filter(comment => comment.isForcedDown);

        if(type == "openReplies" && activeComment.replies.length > 0) {
            activeComment.replies = []
            this.setState({ comments: comments });
        }
        else {
            this.loadCommentsInternal(this.props.quizId, this.props.type, commentId, activeComment.replies.length - forcedReplies.length, 10, this.props.ordering).then(response => {
                for (var i = 0; i < response.comments.length; i++) {
                    let comment = response.comments[i];

                    for (var j = 0; j < forcedReplies.length; j++) {
                        if (forcedReplies[j].id == comment.id) {
                            loadedReplies.splice(j, 1);

                        }
                    }
                }

                let replies = loadedReplies.concat(response.comments);
                activeComment.replies = replies;

                this.setState({ comments: comments });

            }).catch(error => {
                console.log(error);
            });
        }
    }


    handleScroll(e, scrollableArea) {
        if(!this.state.fullyLoaded && this.state.comments.length > 0 && scrollableArea.scrollTop === (scrollableArea.scrollHeight - scrollableArea.offsetHeight))
        {
            this.loadComments();
        }
    }

    handleFilterChange(event, index, value) {
        let stateChange = new Promise((resolve, reject) => {
            this.setState({
                comments: [],
                ordering : value
            });
            resolve();
        });

        stateChange.then(() => {      
            this.loadComments();
        }).catch((error) => {
            console.log(error);
        })
    }

    cancelAll() {
        return new Promise((resolve, reject) => {
            this.setState({
                isEditing: false,
                isReplying: false,
                activeComment: {
                    id: null,
                    parentId: null,
                    userName: ""
                }
            });
            resolve();
        });
    }

    openReplyBoxToolbar(id, parentId, userName, isReply) {
        if(this.state.activeComment.id == id) return;

        this.cancelAll().then(() => {
            this.setState({
                isReplying: true,
                activeComment: {
                    id: id,
                    parentId: parentId,
                    userName: userName
                }
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    openEdit(commentId, parentId) {
        this.cancelAll().then(() => {
            this.setState({
                isEditing: true,
                activeComment: {
                    id: commentId,
                    parentId: parentId,
                    userName: ""
                }
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    getPopupTitle() {
        return(
            <div style={styles.commentsFilterWrapper}>
                <Toolbar id="comments-filter" style={styles.commentsFilter.base}>
                    <ToolbarTitle text="COMMENTS" style={styles.commentsFilter.title} />
                    <ToolbarGroup lastChild={true}>
                        <DropDownMenu style={styles.filterDropDown.base} value={this.state.ordering} onChange={this.handleFilterChange} autoWidth={false}>
                            <MenuItem style={styles.filterDropDown.item} value={2} primaryText="Most Popular" />
                            <MenuItem style={styles.filterDropDown.item} value={1} primaryText="Most Recent" />
                        </DropDownMenu>
                         <IconButton className="close-comments" style={getStyles(styles.close.button.comments, styles.close.button.big)} iconStyle={styles.close.icon.big} onClick={this.props.closeComments}>
                            <Close color={grey600} />
                        </IconButton>
                    </ToolbarGroup>
                </Toolbar>  
            </div>
        );
    }

    handleDeleteDialogOpen() {
        this.setState({ isDeleting: true });
    }

    handleDeleteDialogClose() {
        this.setState({ isDeleting: false });
    }

    remove() {
        let isReply = this.state.activeComment.parentId != null;
        let comments = this.state.comments;

        if(isReply) {
            let parentIndex = comments.findIndex(c => c.id == this.state.activeComment.parentId);
            let activeComment = comments[parentIndex];
            let replyIndex = activeComment.replies.findIndex(c => c.id == this.state.activeComment.id);
            activeComment.replies.splice(replyIndex, 1);
            activeComment.repliesCount--;
        }
        else {
            let index = comments.findIndex(c => c.id == this.state.activeComment.id);
            comments.splice(index, 1);
        }

        this.handleDeleteDialogClose();

        this.setState({ 
            comments: comments,
        });
       
        Service.request("Discussion/DeleteLessonComment", { id: this.state.activeComment.id });
    }

    reply(message) {
        let comments = this.state.comments;
        let parentId = this.state.Replying ? this.state.activeComment.parentId : this.state.activeComment.id;
        let isReply = parentId != null;

        console.log({ quizId: this.props.quizId, type: this.props.type, parentId: parentId, message: message, isReply: isReply });

        Service.request("Discussion/CreateLessonComment", { quizId: this.props.quizId, type: this.props.type, parentId: parentId, message: message }).then((response) => {
            let comment = response.comment;
            comment.repliesCount = 0;
            comment.replies = [];
            comment.userName = "James Flanders"; //TODO Change after User class implemantation

            if(isReply) {         
                let index = comments.findIndex(c => c.id == comment.parentID);
                let parentComment = comments[index];
                comment.isForcedDown = true;
                parentComment.replies.push(comment);
                parentComment.repliesCount++;
            }
            else {
                if (this.state.ordering == 1 && comments.length > 0) {
                    let index = comments.findIndex(c => c.id == this.state.activeComment.id);
                    if (index != -1) {
                        comments.splice(index, 0, comment);
                    }
                    else {
                        comments.push(comment);
                    }
                }
                else {
                    comments.splice(0, 0, comment);
                }
            }

            this.cancelAll().then(() => {
                this.setState({
                    comments: comments,

                });
            }).catch((error) => {
                console.log(error);
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    render() {
        const that = this;

        const deleteActions = [
            {
                componentType: FlatButton,
                label: "popupCancel",
                primary: false,
                actionCallback: that.handleDeleteDialogClose
            },
            {
                componentType: FlatButton,
                label: "popupDelete",
                primary: false,
                actionCallback: that.remove
            }
        ];

        return (
            <div>
                <Dialog id="comments-container" 
                    modal={false}
                    open={this.props.commentsOpened}
                    title={this.getPopupTitle()}
                    autoScrollBodyContent={true}
                    actions={<ReplyBox isPrimary={!this.state.isReplying} defaultText={this.state.isReplying ? "@" + this.state.activeComment.userName + " " : ""} userName={this.state.activeComment.userName} closeToolbar={this.cancelAll} reply={this.reply}/>}
                    actionsContainerStyle={styles.replyBoxWrapper}
                    bodyStyle={styles.dialogBody}
                    onRequestClose={this.props.closeComments}>
                       <div id="comments" style={this.state.comments.length > 0 ? styles.comments : {}}>
                            {
                                (this.state.comments.length > 0 || this.state.fullyLoaded) ?                    
                                    [this.state.isReplying && <div key="commentsOverlay" className="overlay" style={styles.commentsOverlay}></div>,
                                    this.renderComments()]
                                : <LoadingOverlay />
                            }
                        </div>                     
                </Dialog>
                {this.state.isDeleting && Popup.getPopup(Popup.generatePopupActions(deleteActions), this.state.isDeleting, this.handleDeleteDialogClose, [{key: "commentDeleteConfirmText", replacemant: ""}])}
            </div>
        );
    }

    componentWillMount() {
        this.loadComments();
    }

    componentDidMount() {
        const container = document.getElementById("comments");
        const scrollableArea = container.parentNode;
        scrollableArea.addEventListener('scroll', (e) => this.handleScroll(e, scrollableArea));
    }
    
    componentWillUnmount() {
        const container = document.getElementById("comments");
        const scrollableArea = container.parentNode;
        scrollableArea.removeEventListener('scroll', this.handleScroll);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state != nextState;
    }
}

export default Radium(Comments);