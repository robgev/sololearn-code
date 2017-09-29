//React modules
import React, { Component } from 'react';
import Radium, { Style } from 'radium';

//Redux modules
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadDefaults } from '../../actions/defaultActions';
import { getCodesInternal, emptyCodes } from '../../actions/playground';
import { defaultsLoaded } from '../../reducers';

//Additional components
import LoadingOverlay from '../../components/Shared/LoadingOverlay';
import CodeItem from './CodeItem';

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

class Codes extends Component {
    state = {
        isLoading: true,
        fullyLoaded: false
    }
    componentWillMount() {
        const { defaultsLoaded, isLoaded } = this.props;

        if(!defaultsLoaded) {
            this.props.loadDefaults()
                .then(() => {
                    if(!isLoaded) {
                        this.loadCodes();
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        else {
            if(!isLoaded) {
                this.loadCodes();
            }
        }
    }

    //Add event listeners after component mounts
    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }

    //Remove event listeners after component unmounts
    componentWillUnmount() {
        window.removeEventListener('scroll', () => console.log('removed'));
    }

    loadCodes = () => {
        const { codes, ordering, language, query, userId } = this.props;
        // this.setState({ isLoading: true }); //if (this.props.codes.length > 0) 
        const index = codes ? codes.length : 0;
        this.props.getCodesInternal(index, ordering, language, query, userId)
            .then(count => {
                if (count < 20) this.setState({ fullyLoaded: true });
                this.setState({ isLoading: false });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    //Load codes when condition changes
    loadCodesByState = () => {
        this.props.emptyCodes()
            .then(() => {
                this.setState({ fullyLoaded: false });
                this.loadCodes();
            })
            .catch((error) => {
                console.log(error);
            });
    }

    //Check scroll state
    handleScroll = () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            if (!this.state.isLoading && !this.state.fullyLoaded) {
                this.loadCodes();
            }
        }
    }

    renderCodes = () => {
        return this.props.codes.map(code => {
            return (
                <CodeItem code={code} key={code.id} />
            );
        });
    }

    render() {
        const { isLoaded, codes, isUserProfile } = this.props;
        return (
            <div className="codes">
                {(isLoaded && codes.length > 0) && this.renderCodes()}
                {((!isLoaded || codes.length == 0) && !this.state.fullyLoaded && !isUserProfile) && <LoadingOverlay />}
                {
                    ((isUserProfile || codes.length > 0) && !this.state.fullyLoaded) &&
                    <div className="loading" style={!this.state.isLoading ? styles.bottomLoading.base : [styles.bottomLoading.base, styles.bottomLoading.active]}>
                        <LoadingOverlay size={30} />
                    </div>
                }
                {(this.state.fullyLoaded && codes.length == 0) && <div style={styles.noResults}>No Results Found</div>}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        defaultsLoaded: defaultsLoaded(state)
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        loadDefaults,
        getCodesInternal,
        emptyCodes
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(Radium(Codes));