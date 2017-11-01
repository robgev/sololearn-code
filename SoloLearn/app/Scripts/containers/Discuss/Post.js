//React modules
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import Radium, { Style } from 'radium';

//Redux modules
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadDefaults } from '../../actions/defaultActions';
import { loadPostInternal, loadRepliesInternal, emptyReplies, votePostInternal, deletePostInternal, loadPost } from '../../actions/discuss';
import { isLoaded, defaultsLoaded } from '../../reducers';

//Service
import Service from '../../api/service';

//Popups
import Popup from '../../api/popupService';

//Additional components
import Question from './Question';
import Replies from './Replies';
import AddReply from './AddReply';
import LoadingOverlay from '../../components/Shared/LoadingOverlay';

//Material UI components
import Paper from 'material-ui/Paper';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';

//Utils

const styles = {
    postWrapper: {
        width: '1000px',
        margin: '20 auto'
    },

    repliesData: {
        padding: '5px 25px',
        overflow: 'hidden'
    },

    answersCount: {
        color: '#777',
        float: 'left',
        fontSize: '14px',
        lineHeight: '25px'
    },

    repliesFilterWrapper: {
        float: 'right'
    },

    filterLabel: {
        display: 'inline-block',
        verticalAlign: 'middle',
        padding: '0 0 0 15px',
        lineHeight: 'initial'
    },

    filterIcon: {
        position: 'initial',
        display: 'inline-block',
        verticalAlign: 'middle',
        padding: 0,
        width: 'initial',
        width: 'auto',
        height: 'initial',
        height: 'auto'
    },

    dropDownLabel: {
        display: 'inline-block',
        verticalAlign: 'middle',
        color: '#636262',
        fontSize: '14px',
    },

    repliesFilter: {
        display: 'inline-block',
        verticalAlign: 'middle',
        height: '25px'
    },

    repliesWrapper: {
        position: 'relative',
        width: 'inherit',
        margin: '0 0 153px 0',
        transition: 'margin 0.5s'
    },

    bottomLoading: {
        base: {
            position: 'relative',
            width: '100%',
            height: '50px',
            visibility: 'hidden',
            opacity: 0,
            transition: 'opacity ease 300ms, -webkit-transform ease 300ms'
        },

        active: {
            visibility: 'visible',
            opacity: 1,
            transform: 'translateY(0)'
        }
    },
}


class Post extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ordering: 1,
            isLoading: false,
            fullyLoaded: false,
            deletePopupOpened: false
        }

        this.deletingPost = null;

        this.handleScroll = this.handleScroll.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.votePost = this.votePost.bind(this);
        this.openDeletePopup = this.openDeletePopup.bind(this);
        this.closeDeletePopup = this.closeDeletePopup.bind(this);
        this.remove = this.remove.bind(this);
    }

    //Check alias of post
    checkAlias(alias) {
        const post = this.props.post;

        if(alias !== post.alias) {
            browserHistory.replace('/discuss/' + post.id + '/' + post.alias);
        }
    }

    //Get post answers
    getReplies() {
        this.setState({ isLoading: true });

        this.props.loadRepliesInternal(this.state.ordering).then(count => {
            if (count < 20) {
                this.setState({ fullyLoaded: true });
            }

            this.setState({ isLoading: false });
        }).catch((error) => {
            console.log(error);
        });
    }

    //Check scroll state
    handleScroll() {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            if(!this.state.isLoading && !this.state.fullyLoaded) {
                this.getReplies();
            }
        }
    }

    //Change ordering of replies
    handleFilterChange(e, index, value) {
        this.setState({ ordering: value });
        this.loadRepliesByState();
    }

    //Load questions when condition changes
    loadRepliesByState() {
        this.props.emptyReplies().then(() => {
            this.getReplies();
        }).catch((error) => {
            console.log(error);
        });
    }

    votePost(post, voteValue) {
        this.props.votePostInternal(post, voteValue);
    }

    //Change add reply container's space height
    updateDimensions() {
        let repliesWrapper = document.getElementById('replies-wrapper');
        let addReply = document.getElementById('add-reply');
        let marginBottom = addReply.clientHeight + 5;

        console.log(addReply.clientHeight, marginBottom);

        repliesWrapper.style.margin = '0 0 ' + marginBottom + 'px 0';
    }

    //Open deleting confimation dialog
    openDeletePopup(post) {
        this.deletingPost = post;

        this.setState({ deletePopupOpened: true });
    }

    //Close deleting confimation dialog
    closeDeletePopup() {
        this.setState({ deletePopupOpened: false });
        this.deletingPost = null
    }

    remove() {
        const isPrimary = this.deletingPost.parentID == null;
        if (isPrimary) {
            this.props.deletePostInternal(this.deletingPost).then(() => {
                browserHistory.push('/discuss/');
            });
        }
        else {
            this.props.deletePostInternal(this.deletingPost);
        }
        this.closeDeletePopup();
    }

    render() {
        const that = this;
        const { defaultsLoaded, isLoaded, post } = this.props;

        if(!defaultsLoaded || !isLoaded) {
            return <LoadingOverlay />;
        }

        let usersQuestion = post.userID == 24379;

        const deleteActions = [
            {
                componentType: FlatButton,
                label: "popupCancel",
                primary: false,
                actionCallback: that.closeDeletePopup
            },
            {
                componentType: FlatButton,
                label: "popupDelete",
                primary: false,
                actionCallback: that.remove
            }
        ];

        return (
            <div id="post" style={styles.postWrapper}>
                <Question question={post} votePost={this.votePost} remove={this.openDeletePopup}/>
                <div className="filter" style={styles.repliesData}>
                    <p style={styles.answersCount}>{post.answers}{post.answers == 1 ? " ANSWER" : " ANSWERS"}</p>
                    <div style={styles.repliesFilterWrapper}>
                        <p style={styles.dropDownLabel}>Sort by:</p>
                        <DropDownMenu style={styles.repliesFilter}
                            iconStyle={styles.filterIcon}
                            labelStyle={styles.filterLabel}
                            underlineStyle={{ display: 'none' }}
                            value={this.state.ordering}
                            onChange={this.handleFilterChange} autoWidth={false}>
                            <MenuItem value={1} primaryText="Votes" />
                            <MenuItem value={2} primaryText="Date" />
                        </DropDownMenu>
                    </div>
                </div>
                <div id="replies-wrapper" style={styles.repliesWrapper}>
                    <Paper>
                        {(this.state.isLoading && post.replies.length == 0) && <LoadingOverlay size={30} />}
                        <Replies replies={post.replies} votePost={this.votePost} openDeletePopup={this.openDeletePopup} isUsersQuestion={usersQuestion}/>
                    </Paper>
                    {
                        (post.replies.length > 0 && !this.state.fullyLoaded) && 
                        <div className="loading" style={!this.state.isLoading ? styles.bottomLoading.base : [styles.bottomLoading.base, styles.bottomLoading.active]}>
                            <LoadingOverlay size={30} />
                        </div>
                    }
                </div>
                <AddReply updateDimensions={this.updateDimensions} />

                {this.state.deletePopupOpened && Popup.getPopup(Popup.generatePopupActions(deleteActions), this.state.deletePopupOpened, this.closeDeletePopup, [{ key: "postDeleteConfirmText", replacemant: "" }])}
            </div>
        );
    }

    componentWillMount() {
        let params = this.props.params;

        this.props.loadPostInternal(params.id).then(() => {
            //Checking alias
            this.checkAlias(params.questionName);
            this.getReplies();
        }).catch((error) => {
            console.log(error);
        });
    }

    //Add event listeners after component mounts
    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }
    
    //Remove event listeners after component unmounts
    componentWillUnmount() {
        this.props.loadPost(null);
        window.removeEventListener('scroll', this.handleScroll);
    }
}

function mapStateToProps(state) {
    return {
        defaultsLoaded: defaultsLoaded(state),
        isLoaded: isLoaded(state, "discussPost"),
        post: state.discussPost
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
        loadDefaults,
        loadPostInternal,
        loadRepliesInternal,
        deletePostInternal,
        emptyReplies,
        votePostInternal,
        loadPost
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Radium(Post));