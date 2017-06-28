﻿//React modules
import React, { Component } from 'react';
import Radium, { Style } from 'radium';

//Redux modules
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadDefaults } from '../../actions/defaultActions';
import { getQuestionsInternal, emptyQuestions } from '../../actions/discuss';
import { defaultsLoaded } from '../../reducers';

//Additional components
import LoadingOverlay from '../../components/Shared/LoadingOverlay';
import QuestionItem from './QuestionItem';

const styles = {
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

    noResults: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        fontSize: '20px',
        color: '#777',
    }
}

class Questions extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            fullyLoaded: false
        }

        this.handleScroll = this.handleScroll.bind(this);
        this.loadQuestionByState = this.loadQuestionByState.bind(this);
    }

    //Check scroll state
    handleScroll() {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            if (!this.state.isLoading && !this.state.fullyLoaded) {
                this.loadQuestions();
            }
        }
    }

    loadQuestions() {
        const { questions, ordering, query, userId } = this.props;

        this.setState({ isLoading: true }); //if (this.props.questions.length > 0)

        const index = questions ? questions.length : 0;
        this.props.getQuestions(index, ordering, query, userId).then(count => {
            if (count < 20) this.setState({ fullyLoaded: true });

            this.setState({ isLoading: false });
        }).catch((error) => {
            console.log(error);
        });
    }

    //Load questions when condition changes
    loadQuestionByState() {
        this.props.emptyQuestions().then(() => {
            this.loadQuestions();
        }).catch((error) => {
            console.log(error);
        });
    }


    renderQuestions() {
        return this.props.questions.map((quesiton, index) => {
            return (
                <QuestionItem question={quesiton} key={quesiton.id} />
            );
        });
    }

    render() {
        const { isLoaded, questions, isUserProfile } = this.props;

        return (
            <div className="questions">
                {((!isLoaded || questions.length == 0) && !this.state.fullyLoaded && !isUserProfile) && <LoadingOverlay />}
                {(isLoaded && questions.length > 0) && this.renderQuestions()}
                {
                    ((isUserProfile || questions.length > 0) && !this.state.fullyLoaded) &&
                    <div className="loading" style={!this.state.isLoading ? styles.bottomLoading.base : [styles.bottomLoading.base, styles.bottomLoading.active]}>
                        <LoadingOverlay size={30} />
                    </div>
                }
                {(this.state.fullyLoaded && questions.length == 0) && <div style={styles.noResults}>No Results Found</div>}
            </div>
        );
    }

    componentWillMount() {
        const { defaultsLoaded, isLoaded } = this.props;

        if (!defaultsLoaded) {
            this.props.loadDefaults().then((response) => {
                if (!isLoaded) {
                    this.loadQuestions();
                }
            }).catch((error) => {
                console.log(error);
            });
        }
        else {
            if (!isLoaded) {
                this.loadQuestions();
            }
        }
    }

    //Add event listeners after component mounts
    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }

    //Remove event listeners after component unmounts
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }
}

function mapStateToProps(state) {
    return {
        defaultsLoaded: defaultsLoaded(state)
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        loadDefaults: loadDefaults,
        getQuestions: getQuestionsInternal,
        emptyQuestions: emptyQuestions
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(Radium(Questions));