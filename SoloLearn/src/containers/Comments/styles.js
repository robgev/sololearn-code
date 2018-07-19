export const CommentsBaseStyle = {
	dialogBody: {
		position: 'relative',
		padding: 0,
		height: '300px',
		minHeight: '300px',
		maxHeight: '500px',
		zIndex: 10002,
		overflowY: 'hidden',
	},

	replyBoxWrapper: {
		textAlign: 'left',
		boxShadow: '0 0 10px rgba(0, 0, 0, 0.227451)',
	},

	comments: {
		position: 'relative',
	},

	commentsOverlay: {
		position: 'absolute',
		top: 0,
		left: 0,
		height: '100%',
		width: '100%',
		zIndex: 1000,
		backgroundColor: 'rgba(248, 248, 248, .4)',
	},

	commentsFilterWrapper: {
		position: 'relative',
		padding: 0,
	},

	commentsFilter: {
		base: {
			position: 'relative',
			backgroundColor: 'rgb(232, 232, 232)',
			boxShadow: '0 3px 6px rgba(0,0,0,.16), 0 3px 6px rgba(0,0,0,.23)',
		},

		title: {
			lineHeight: '61px',
			fontSize: '15px',
			cursor: 'pointer',
		},
	},

	filterDropDown: {
		base: {
			width: '170px',
			padding: '0 10px',
		},

		item: {
			padding: '0',
		},
	},

	close: {
		button: {
			comments: {
				margin: '0 10px',
			},

			big: {
				width: '40px',
				height: '40px',
				padding: '10px',
			},
		},

		icon: {
			big: {
				width: '20px',
				height: '20px',
			},
		},
	},
};

export const CommentsStyle = {
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

export const CommentStyle = {

	comment: {
		base: {
			position: 'relative',
			transition: 'opacity ease 400ms, transform ease 400ms, -webkit-transform ease 400ms',
		},
	},

	commentConent: {
		display: 'flex',
		padding: '10px',
	},

	commentDetailsWrapper: {
		base: {
			flex: 1,
			position: 'relative',
			overflow: 'hidden',
			padding: '0 0 0 10px',
		},

		editing: {
			padding: '0 0 10px 10px',
		},
	},

	commentDetails: {
		position: 'relative',
	},

	heading: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	},

	iconMenu: {
		icon: {
			width: 'inherit',
			height: 'inherit',
			padding: 0,
		},
	},

	userName: {
		fontSize: '14px',
		color: '#636060',
		margin: '0px 0px 5px 0px',
	},

	commentDate: {
		fontSize: '12px',
		color: '#777',
	},

	commentMessage: {
		fontSize: '13px',
		color: '#827e7e',
		margin: '3px 0px 5px',
		whiteSpace: 'pre-line',
	},

	commentControls: {
		base: {
			display: 'flex',
			justifyContent: 'space-between',
			overflow: 'hidden',
		},

		left: {
			display: 'flex',
			alignItems: 'center',
		},

		right: {
			display: 'flex',
			alignItems: 'center',
		},
	},

	replies: {
		base: {
			backgroundColor: '#dedede',
			zIndex: 999,
		},

		content: {
			margin: '0 0 0 15px',
		},
	},

	commentsGap: {
		minHeight: '20px',
		textAlign: 'center',
	},

	vote: {
		button: {
			base: {
				verticalAlign: 'middle',
				width: '32px',
				height: '32px',
				padding: '8px',
			},

			icon: {
				width: '16px',
				height: '16px',
			},
		},

		text: {
			display: 'inline-block',
			verticalAlign: 'middle',
			minWidth: '23px',
			textAlign: 'center',
			fontWeight: '500',
			fontSize: '15px',
		},
	},

	textField: {
		margin: '0 0 10px 0',
		fontSize: '13px',
	},

	textFieldCoutner: {
		position: 'absolute',
		bottom: 0,
		right: 0,
		fontSize: '13px',
		fontWeight: '500',
	},

	deleteButton: {
		color: '#E53935',
	},

	noStyle: {
		textDecoration: 'none',
	},
};

export const ReplyBoxStyle = {
	replyBox: {
		base: {
			width: 'inherit',
			margin: '0 auto 10px',
			backgroundColor: '#fff',
		},
	},

	avatar: {
		overflow: 'hidden',
		float: 'left',
	},

	replyBoxConent: {
		overflow: 'hidden',
		padding: '8px 5px 5px 5px',
	},

	replyBoxDetails: {
		overflow: 'hidden',
		padding: '0 0 0 10px',
	},

	userName: {
		fontSize: '15px',
		fontWeight: '500',
		textDecoration: 'none',
	},

	replyBoxControls: {
		overflow: 'hidden',
		padding: '0 5px 5px 0',
		textAlign: 'right',
	},

	textField: {
		fontSize: '13px',
		margin: '0 0 10px 0',
	},

	replyBoxToolbar: {
		overflow: 'hidden',
		padding: '5px',
		borderBottom: '1px solid #dedede',
		fontSize: '13px',
		color: '#928f8f',
	},

	replyBoxToolbarText: {
		float: 'left',
		margin: '5px 0 0 0',

		user: {
			fontWeight: 500,
		},
	},

	close: {
		button: {
			reply: {
				float: 'right',
				verticalAlign: 'middle',
			},

			small: {
				width: '24px',
				height: '24px',
				padding: '6px',
			},
		},

		icon: {
			small: {
				width: '12px',
				height: '12px',
			},
		},
	},
};
