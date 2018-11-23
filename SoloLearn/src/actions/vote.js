import Service from 'api/service';
import * as types from 'constants/ActionTypes';

export const vote = ({type, id, vote, votes}) => dispatch => {
	let action;
	switch (type) {
		case "post":
			action = types.VOTE_POST;
			break;
		case "code":
			action = types.VOTE_CODE;
			break;
		case "lessonComment":
			action = types.VOTE_LESSON_COMMENT;
			break;
		case "userLessonComment":
			action = types.VOTE_USER_LESSON_COMMENT;
			break;
		case "codeComment":
			action = types.VOTE_CODE_COMMENT;
			break;
		default:
			return;
	}
	dispatch({ type: action, payload: {id, vote, votes} })
};
