//React modules
import React, { Component } from 'react';
import Radium, { Style } from 'radium';

//Redux modules
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addCommentInternal, deleteCommentInternal } from '../../actions/comments';
import { isLoaded } from '../../reducers';

//Popups
import Popup from '../../api/popupService';

//Additional components
import Comments from './Comments';
import ReplyBox from './ReplyBox';
import LoadingOverlay from '../../components/Shared/LoadingOverlay';

//Material UI components
import Dialog from 'material-ui/Dialog';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
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
        height: '300px',
        minHeight: '300px',
        maxHeight: '500px',
        zIndex: 10002
    },

    replyBoxWrapper: {
        position: 'relative',
        padding: 0,
        textAlign: 'left',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.227451)',
        zIndex: 10003
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
        position: 'relative',
        padding: 0,
        zIndex: 10003
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

    close: {
        button: {
            comments: {
                margin: '0 10px'
            },

            big: {
                width: '40px',
                height: '40px',
                padding: '10px'
            }
        },

        icon: {
            big: {
                width: '20px',
                height: '20px'
            }
        }
    }
}

class CommentsBase extends Component {
    constructor(props) {
        super(props);

        this.state = {
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

        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.openEdit = this.openEdit.bind(this);
        this.cancelAll = this.cancelAll.bind(this);
        this.openReplyBoxToolbar = this.openReplyBoxToolbar.bind(this);
        this.handleDeleteDialogOpen = this.handleDeleteDialogOpen.bind(this);
        this.deleteComment = this.deleteComment.bind(this);
        this.addComment = this.addComment.bind(this);
    }

    //Cancel all active actions
    cancelAll() {
        return new Promise((resolve, reject) => {
            this.setState({
                isEditing: false,
                isReplying: false,
                isDeleting: false,
                activeComment: {
                    id: null,
                    parentId: null,
                    userName: ""
                }
            }, () => {
                resolve();
            });
        });
    }

    //Open comment editing area
    openEdit(id, parentId, userName) {
        this.cancelAll().then(() => { 
            this.setState({
                isEditing: true,
                activeComment: {
                    id: id,
                    parentId: parentId,
                    userName: userName
                }
            });
        });
    }

    //Open reply box toolbar (ex: replies to James Flanders)
    openReplyBoxToolbar(id, parentId, userName, isReply) {
        if (this.state.activeComment.id == id && this.state.isReplying) return;

        this.cancelAll().then(() => {
            this.setState({
                isReplying: true,
                activeComment: {
                    id: id,
                    parentId: parentId,
                    userName: userName
                }
            });
        });
    }

    //Render popup heading
    deleteComment() {
        this.props.deleteCommentInternal(this.state.activeComment.id, this.state.activeComment.parentId, this.props.commentsType).then(() => {
            this.cancelAll();
        });
    }

    //Open deleting confirmation popup
    handleDeleteDialogOpen(comment) {
        this.setState({
            isDeleting: true,
            activeComment: {
                id: comment.id,
                parentId: comment.parentID
            }
        });
    }

    //Change ordering state
    handleFilterChange(event, index, value) {
        if (value == this.state.ordering) return;

        this.cancelAll();
        this.setState({ ordering: value });
        this.refs.comments.getWrappedInstance().loadCommentsByState();
    }

    addComment(message) {
        const { activeComment, isReplying, ordering } = this.state;
        const { id, type, commentsType } = this.props;
        const parentId = activeComment.parentId == null ? activeComment.id : activeComment.parentId;

        this.props.addCommentInternal(id, parentId, message, type, commentsType, ordering).then(() => {
            this.cancelAll();
        });
    }

    //Render popup heading
    getPopupTitle() {
        return (
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

    render() {
        const that = this;
        const { id, type, commentsType, comments, profile, isLoaded } = this.props;

        const deleteActions = [
            {
                componentType: FlatButton,
                label: "popupCancel",
                primary: false,
                actionCallback: that.cancelAll
            },
            {
                componentType: FlatButton,
                label: "popupDelete",
                primary: false,
                actionCallback: that.deleteComment
            }
        ];

        return (
            <div>
                <Dialog id="comments-container" 
                    modal={false}
                    open={this.props.commentsOpened}
                    title={this.getPopupTitle()}
                    autoScrollBodyContent={true}
                    actions={isLoaded && <ReplyBox profile={profile} isPrimary={!this.state.isReplying} defaultText={this.state.isReplying ? "@" + this.state.activeComment.userName + " " : ""} userName={this.state.activeComment.userName} closeToolbar={this.cancelAll} reply={this.addComment} />}
                    actionsContainerStyle={styles.replyBoxWrapper}
                    bodyStyle={styles.dialogBody}
                    onRequestClose={this.props.closeComments}>
                        <Comments id={id}
                            type={type}
                            commentsType={commentsType}
                            comments={comments}
                            isEditing={this.state.isEditing}
                            isReplying={this.state.isReplying}
                            activeComment={this.state.activeComment}
                            isLoaded={isLoaded}
                            ordering={this.state.ordering}
                            openEdit={this.openEdit}
                            cancelAll={this.cancelAll}
                            openReplyBoxToolbar={this.openReplyBoxToolbar}
                            deleteComment={this.handleDeleteDialogOpen}
                            ref="comments" />
                </Dialog>
                {this.state.isDeleting && Popup.getPopup(Popup.generatePopupActions(deleteActions), this.state.isDeleting, this.handleDeleteDialogClose, [{key: "commentDeleteConfirmText", replacemant: ""}])}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        isLoaded: isLoaded(state, "comments"),
        profile: state.userProfile,
        comments: state.comments
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        addCommentInternal: addCommentInternal,
        deleteCommentInternal: deleteCommentInternal
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentsBase);