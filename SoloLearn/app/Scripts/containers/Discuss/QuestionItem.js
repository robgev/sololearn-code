//React modules
import React, { PureComponent } from 'react';
import { Link } from 'react-router';
import Radium, { Style } from 'radium';
import DiscussTag from './DiscussTag';
import removeDups from '../../utils/removeDups';

//Material UI components
import ChatBubble from 'material-ui/svg-icons/communication/chat-bubble-outline';
import { green500 } from 'material-ui/styles/colors';

//Utils
import numberFormatter from '../../utils/numberFormatter';
import updateDate from '../../utils/dateFormatter';

export const noStyleLink = { textDecoration: 'none' };

const styles = {
    question: {
        padding: '10px',
        borderBottom: '1px solid #f3f3f3'
    },

    stats: {
        float: 'left',
        textAlign: 'center',
        width: '45px',
        fontSize: '14px'
    },

    answersCountWrapper: {
        position: 'relative'
    },

    answersCount: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '12px',
        padding: '0 0 5px 0'
    },

    chatBubble: {
        width: '32px',
        height: '32px'
    },

    detailsWrapper: {
        overflow: 'hidden',
        margin: '0 0 0 10px'
    },

    title: {
        fontSize: '15px',
        color: '#636060',
        margin: '0 0 5px 0'
    },

    tag: {
        base: {
            display: 'inline-block',
            verticalAlign: 'middle',
            backgroundColor: '#9CCC65',
            color: '#fff',
            fontSize: '12px',
            padding: '3px 5px',
            borderRadius: '3px'
        },

        margin: {
            margin: '0 0 0 5px'
        }
    },

    authorDetails: {
        float: 'right',
        fontSize: '12px'
    },

    date: {
        color: '#777'
    }
}

class QuestionItem extends PureComponent {
    render() {
        const { question } = this.props;
        return (
            <div className="question" style={styles.question}>
                <Link to={`/discuss/${question.id}`} style={noStyleLink}>
                    <div className="stats" style={styles.stats}>
                        <p>{question.votes > 0 ? "+" : ""}{numberFormatter(question.votes)}</p>
                        <div className="asnwers-count-wrapper" style={styles.answersCountWrapper}>
                            <p style={styles.answersCount}>{question.answers > 99 ? "99+" : question.answers}</p>
                            <ChatBubble color={green500} style={styles.chatBubble} />
                        </div>
                    </div>
                    <div className="details-wrapper" style={styles.detailsWrapper}>
                        <div className="details">
                            <p className="title" style={styles.title}>{question.title}</p>
                            <div className="tags">
                                {
                                    removeDups(question.tags).map((tag, index) => (
                                        <DiscussTag
                                            key={question.id + " " + tag} 
                                            tag={tag}
                                            index={index}
                                        />
                                    ))
                                }
                            </div>
                        </div>
                        <div className="author-details" style={styles.authorDetails}>
                            <span style={styles.date}>
                                {updateDate(question.date)} by
                        </span>
                            <span> {question.userName}</span>
                        </div>
                    </div>
                </Link>
            </div>
        );
    }
}

export default Radium(QuestionItem);