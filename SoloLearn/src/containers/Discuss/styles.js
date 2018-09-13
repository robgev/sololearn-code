export const AddReplyStyles = {
	container: {
		width: 'inherit',
		padding: 15,
		background: '#fff',
		boxSizing: 'border-box',
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
		borderBottom: '1px solid #F3F3F3',
	},
	editor: {
		position: 'relative',
		padding: '0 0 10px 0',
	},
	textField: {
		margin: 0,
		fontSize: '13px',
	},
	textFieldCoutner: {
		position: 'absolute',
		bottom: 0,
		right: 0,
		fontSize: '13px',
		color: '#777',
	},
	editorActions: {
		textAlign: 'right',
		margin: '10px 0 0 0',
	},
};

export const DiscussTagStyles = {
	base: {
		display: 'inline-block',
		verticalAlign: 'middle',
		backgroundColor: '#9CCC65',
		color: '#fff',
		fontSize: '12px',
		padding: '3px 5px',
		borderRadius: '3px',
	},
	margin: {
		margin: '0 0 0 5px',
	},
	none: {
		textDecoration: 'none',
		color: 'white',
	},
};

export const EditQuestionStyles = {
	container: {
		width: '1000px',
		position: 'relative',
		margin: '20px auto',
		padding: '10px 20px',
	},
	heading: {
		fontWeight: 'normal',
	},
	questionData: {
		position: 'relative',
		padding: '0 0 10px 0',
	},
	textField: {
		margin: 0,
		fontSize: '13px',
	},
	textFieldCoutner: {
		position: 'absolute',
		bottom: 0,
		right: 0,
		fontSize: '13px',
		color: '#777',
	},
	editorActions: {
		textAlign: 'right',
		margin: '15px 0 0 0',
	},
	tag: {
		display: 'inline-block',
		verticalAlign: 'middle',
		backgroundColor: '#9CCC65',
		color: '#fff',
		fontSize: '12px',
		padding: '3px 5px',
		borderRadius: '3px',
		margin: '8px 8px 0 0',
	},
};

export const NewQuestionStyles = {
	container: {
		position: 'relative',
		padding: '10px 20px',
	},
	heading: {
		fontWeight: 'normal',
	},
	questionData: {
		position: 'relative',
		padding: '0 0 10px 0',
	},
	textField: {
		margin: 0,
		fontSize: '13px',
	},
	textFieldCoutner: {
		position: 'absolute',
		bottom: 0,
		right: 0,
		fontSize: '13px',
		color: '#777',
	},
	editorActions: {
		textAlign: 'right',
		margin: '15px 0 0 0',
	},
	tag: {
		display: 'inline-block',
		verticalAlign: 'middle',
		backgroundColor: '#9CCC65',
		color: '#fff',
		fontSize: '12px',
		padding: '3px 5px',
		borderRadius: '3px',
		margin: '8px 8px 0 0',
	},
};

export const PostStyles = {
	postWrapper: {
		minHeight: '80vh',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		width: '1000px',
		margin: '20 auto',
	},
	repliesData: {
		padding: '5px 10px',
		paddingBottom: 4,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	answersCount: {
		color: '#777',
		fontSize: '14px',
	},
	repliesFilterWrapper: {
		display: 'flex',
		alignItems: 'center',
	},
	filterLabel: {
		display: 'inline-block',
		verticalAlign: 'middle',
		padding: '0 0 0 15px',
		height: 'initial',
		lineHeight: 'initial',
	},
	filterIcon: {
		position: 'initial',
		display: 'inline-block',
		verticalAlign: 'middle',
		padding: 0,
		width: 'auto',
		height: 'auto',
	},
	dropDownLabel: {
		display: 'inline-block',
		verticalAlign: 'middle',
		color: '#636262',
		fontSize: '14px',
	},
	repliesFilter: {
		height: '25px',
	},
	repliesWrapper: {
		position: 'relative',
		width: 'inherit',
		transition: 'margin 0.5s',
	},
	bottomLoading: {
		base: {
			position: 'relative',
			width: '100%',
			height: '50px',
			visibility: 'hidden',
			opacity: 0,
			transition: 'opacity ease 300ms, -webkit-transform ease 300ms',
		},
		active: {
			visibility: 'visible',
			opacity: 1,
			transform: 'translateY(0)',
		},
	},
};

export const QuestionStyles = {
	question: {
		padding: '10px',
		borderBottom: '1px solid #f3f3f3',
	},
	stats: {
		textAlign: 'center',
		width: '45px',
		fontSize: '14px',
	},
	vote: {
		button: {
			base: {
				width: '36px',
				height: '36px',
				padding: '4px',
			},
			icon: {
				width: '28px',
				height: '28px',
			},
		},
		text: {
			minWidth: '23px',
			textAlign: 'center',
			fontWeight: '500',
			fontSize: '14px',
		},
	},
	detailsWrapper: {
		display: 'flex',
	},
	details: {
		margin: '7px 0px 0px 10px',
		width: '85%',
	},
	title: {
		overflowWrap: 'break-word',
		fontSize: '15px',
		color: '#636060',
		margin: 5,
	},
	tags: {
	},
	tag: {
		base: {
			display: 'inline-block',
			verticalAlign: 'middle',
			backgroundColor: '#9CCC65',
			color: '#fff',
			fontSize: '12px',
			padding: '3px 5px',
			borderRadius: '3px',
		},
		margin: {
			margin: '0 0 0 5px',
		},
	},
	message: {
		fontSize: '14px',
		color: '#827e7e',
		margin: '5px 0 10px 0',
		whiteSpace: 'pre-line',
	},
	additionalDetails: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	followButton: {
		base: {
			width: '40px',
			height: '40px',
			padding: '10px',
		},
		icon: {
			width: '20px',
			height: '20px',
		},
	},
	authorDetails: {
		float: 'right',
		fontSize: '12px',
	},
	texts: {
		base: {
			display: 'inline-block',
			verticalAlign: 'middle',
			textAlign: 'right',
		},
		userName: {
			color: '#607D8B',
			margin: '0 0 2px 0',
		},
		date: {
			color: '#777',
		},
	},
	avatar: {
		margin: '0 0 0 5px',
	},
};

export const QuestionItemStyles = {
	question: {
		padding: '10px',
		borderBottom: '1px solid #f3f3f3',
	},
	stats: {
		float: 'left',
		textAlign: 'center',
		width: '45px',
		fontSize: '14px',
	},
	answersCountWrapper: {
		position: 'relative',
	},
	answersCount: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		fontSize: '12px',
		padding: '0 0 5px 0',
	},
	chatBubble: {
		width: '32px',
		height: '32px',
	},
	detailsWrapper: {
		margin: '0 0 0 10px',
	},
	title: {
		fontSize: '15px',
		color: '#636060',
		margin: '0 0 5px 0',
	},
	tag: {
		base: {
			display: 'inline-block',
			verticalAlign: 'middle',
			backgroundColor: '#9CCC65',
			color: '#fff',
			fontSize: '12px',
			padding: '3px 5px',
			borderRadius: '3px',
		},
		margin: {
			margin: '0 0 0 5px',
		},
	},
	authorDetails: {
		float: 'right',
		fontSize: '12px',
	},
	date: {
		color: '#777',
	},
};

export const QuestionsStyles = {
	bottomLoading: {
		base: {
			position: 'relative',
			width: '100%',
			height: '50px',
			visibility: 'hidden',
			opacity: 0,
			transition: 'opacity ease 300ms, -webkit-transform ease 300ms',
		},
		active: {
			visibility: 'visible',
			opacity: 1,
			transform: 'translateY(0)',
		},
	},
	noResults: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%,-50%)',
		fontSize: '20px',
		color: '#777',
	},
};

export const ReplyStyles = {
	reply: {
		base: {
			padding: '10px',
			borderBottom: '1px solid #f3f3f3',

		},
		accepted: {
			borderLeft: '4px solid #9ccc65',
		},
	},
	stats: {
		textAlign: 'center',
		width: '45px',
		fontSize: '14px',
	},
	vote: {
		button: {
			base: {
				width: '36px',
				height: '36px',
				padding: '4px',
			},
			icon: {
				width: '28px',
				height: '28px',
			},
		},
		text: {
			minWidth: '23px',
			textAlign: 'center',
			fontWeight: '500',
			fontSize: '14px',
		},
	},
	detailsWrapper: {
		display: 'flex',
	},
	details: {
		base: {

			margin: '7px 0 0 10px',
			width: '90%',
		},
		editing: {
			width: '95%',
		},
	},
	title: {
		fontSize: '15px',
		color: '#636060',
		margin: '0 0 5px 0',
	},
	message: {
		fontSize: '14px',
		color: '#827e7e',
		wordBreak: 'break-word',
		margin: '5px 0 10px 0',
		whiteSpace: 'pre-line',
	},
	additionalDetails: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	bestAnswerButton: {
		base: {
			width: '40px',
			height: '40px',
			padding: '10px',
		},
		icon: {
			width: '20px',
			height: '20px',
		},
	},
	authorDetails: {
		float: 'right',
		fontSize: '12px',
	},
	texts: {
		base: {
			display: 'inline-block',
			verticalAlign: 'middle',
			textAlign: 'right',
		},
		userName: {
			color: '#607D8B',
			margin: '0 0 2px 0',
		},
		date: {
			color: '#777',
		},
	},
	avatar: {
		margin: '0 0 0 5px',
	},
	editor: {
		display: 'flex',
		flexDirection: 'column',
		position: 'relative',
		padding: '0 0 10px 0',
	},
	textField: {
		margin: 0,
		fontSize: '13px',
	},
	textFieldCoutner: {
		alignSelf: 'flex-end',
		marginTop: '10px',
		fontSize: '13px',
		color: '#777',
	},
	editorActions: {
		textAlign: 'right',
		margin: '5px 0 0 0',
	},
};

export const RepliesStyles = {
	container: {
		overflowY: 'hidden',
		borderRadius: 0,
		borderTop: '4px solid white',
	},
};
