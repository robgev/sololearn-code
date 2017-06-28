import Service from '../api/service';
import * as types from '../constants/ActionTypes';

export const getComments = (comments) => {
    return {
        type: types.GET_COMMENTS,
        payload: comments
    }
}

export const getReplies = (commentId, comments) => {
    return {
        type: types.GET_COMMENT_REPLIES,
        payload: {
            id: commentId,
            comments: comments
        }
    }
}

export const getCommentsInternal = (id, type, parentId, index, oredring, commentsType, count = 20) => {
    let path = "";
    let params = {
        parentId: parentId,
        index: index,
        count: count,
        orderby: oredring
    };

    if (commentsType == "lesson") {
        path = "Discussion/GetLessonComments";
        params.quizId = id;
        params.type = type;
    }
    else if(commentsType == "code") {
        path = "Discussion/GetCodeComments";
        params.codeId = id;
    }

    return (dispatch, getState) => {
        const store = getState();
        const loadedComments = store.comments;

        return Service.request(path, params).then(response => {
            const responseComments = response.comments;

            if (parentId == null) {
                let forcedReplies = loadedComments.filter((c, index) => { return c.isForcedDown ? Object.assign(c, { index: index }) : null });

                for (let i = 0; i < responseComments.length; i++) {
                    let comment = responseComments[i];
                    comment.repliesCount = comment.replies;
                    comment.replies = [];

                    for (var j = 0; j < forcedReplies.length; j++) {
                        if (forcedReplies[j].id == comment.id) {
                            loadedComments.splice(forcedReplies[j].index, 1);
                        }
                    }
                }

                dispatch(getComments(responseComments));
            }
            else {
                let parentComment = loadedComments[loadedComments.findIndex(c => c.id == parentId)];
                let forcedReplies = parentComment.replies.filter((c, index) => { return c.isForcedDown ? Object.assign(c, { index: index }) : null });

                for (var i = 0; i < responseComments.length; i++) {
                    let comment = responseComments[i];

                    for (var j = 0; j < forcedReplies.length; j++) {
                        if (forcedReplies[j].id == comment.id) {
                            parentComment.replies.splice(forcedReplies[j].index, 1);
                        }
                    }
                }

                dispatch(getReplies(parentId, responseComments));
            }

            return responseComments.length;
        }).catch(error => {
            console.log(error);
        });
    }   
}


export const emptyComments = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: types.EMPTY_COMMENTS,
                payload: []
            });
            resolve();
        });
    }
}

export const voteComment = (id, parentId, isPrimary, vote, votes) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: types.VOTE_COMMENT,
                payload: { id: id, parentId: parentId, isPrimary: isPrimary, vote: vote, votes: votes }
            });
            resolve();
        });
    }
}

export const voteCommentInternal = (comment, vote, commentsType) => {
    let path = "";
    let userVote = comment.vote == vote ? 0 : vote;
    let votes = comment.votes + userVote - comment.vote;
    const isPrimary = comment.parentID == null;

    if (commentsType == "lesson") {
        path = "Discussion/VoteLessonComment";
    }
    else if (commentsType == "code") {
        path = "Discussion/VoteCodeComment";
    }

    return dispatch => {
        dispatch(voteComment(comment.id, comment.parentID, isPrimary, userVote, votes)).then(() => {
            //Service.request(path, { id: comment.id, vote: userVote });
        }).catch((error) => {
            console.log(error);
        });
    }
}

export const emptyCommentReplies = (commentId) => {
    return {
        type: types.EMPTY_COMMENT_REPLIES,
        payload: commentId
    }
}


export const editComment = (id, parentId, isPrimary, message) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: types.EDIT_COMMENT,
                payload: { id: id, parentId: parentId, isPrimary: isPrimary, message: message }
            });
            resolve();
        });
    }
}

export const editCommentInternal = (id, parentId, message, commentsType) => {
    const isPrimary = parentId == null;
    let path = "";

    if (commentsType == "lesson") {
        path = "Discussion/EditLessonComment";
    }
    else if (commentsType == "code") {
        path = "Discussion/EditCodeComment";
    }

    return dispatch => {
        return dispatch(editComment(id, parentId, isPrimary, message)).then(() => {
            Service.request(path, { id: id, message: message });
        }).catch((error) => {
            console.log(error);
        });
    }
}

export const deleteComment = (id, parentId, isPrimary) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: types.DELETE_COMMENT,
                payload: { id: id, parentId: parentId, isPrimary: isPrimary }
            });
            resolve();
        });
    }
}

export const deleteCommentInternal = (id, parentId, commentsType) => {
    const isPrimary = parentId == null;
    let path = "";

    if (commentsType == "lesson") {
        path = "Discussion/DeleteLessonComment";
    }
    else if (commentsType == "code") {
        path = "Discussion/DeleteCodeComment";
    }

    return dispatch => {
        return dispatch(deleteComment(id, parentId, isPrimary)).then(() => {
            //Service.request(path, { id: id });
        }).catch((error) => {
            console.log(error);
        });
    }
}

export const addComment = (comment, isPrimary, ordering) => {
    return  {
        type: types.ADD_COMMENT,
        payload: { comment: comment, isPrimary: isPrimary, ordering: ordering }
    }
}

export const addCommentInternal = (id, parentId, message, type, commentsType, ordering) => {
    const isPrimary = parentId == null;
    let path = "";
    let params = {
        parentId: parentId,
        message: message
    }

    if (commentsType == "lesson") {
        path = "Discussion/CreateLessonComment";
        params.quizId = id;
        params.type = type;
    }
    else if (commentsType == "code") {
        path = "Discussion/CodeLessonComment";
    }

    return (dispatch, getState) => {
        const store = getState();
        const comments = store.comments;

        return Service.request(path, params).then((response) => {
            let comment = response.comment;
            comment.repliesCount = 0;
            comment.replies = [];
            comment.userName = "Rafael Hovhannisyan"; //TODO Change after User class implemantation
            comment.isForcedDown = true;

            if (isPrimary) {
                dispatch(addComment(comment, isPrimary, ordering));
            }
            else {
                let index = comments.findIndex(c => c.id == comment.parentID);
                let parentComment = comments[index];

                dispatch(addComment(comment, isPrimary, ordering));
            }

        }); 
    }
}