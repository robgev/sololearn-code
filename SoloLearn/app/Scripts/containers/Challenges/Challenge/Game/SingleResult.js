import React, { PureComponent } from 'react';
import Radium, { StyleRoot } from 'radium';
import { fadeInUp, fadeOutUp } from 'react-animations';
import { red500, green500, blue500 } from 'material-ui/styles/colors';

const styles = {
    right: {
        color: green500
    },
    wrong: {
        color: red500
    },
    neutral: {
        color: blue500
    },
    center: {
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    appear: {
        animation: '750ms',
        animationName: Radium.keyframes(fadeInUp, 'fadeInUp')
    },
    disappear: {
        animation: '750ms',
        animationName: Radium.keyframes(fadeOutUp, 'fadeOutUp')
    }
}

class SingleResult extends PureComponent {
    state = {
        in: true
    }
    componentDidMount() {
        this.changeStyle();
    }
    componentWillReceiveProps(_) {
        this.setState({ in: true });
        this.changeStyle();
    }
    changeStyle = () => {
        setTimeout(() => {
            this.setState({ in: false });
        }, 750);
    }
    render() {
        const messageStyle = this.props.status == 1 ? 
            styles.neutral :
            (this.props.status == 2 ? styles.right : styles.wrong);
        const isAppear = this.state.in ? styles.appear : styles.disappear;
        const fullStyle = { ...isAppear, ...messageStyle };
        return(
            <StyleRoot style={styles.center}>
                <h1 style={fullStyle}>
                    {this.props.message}
                </h1>
            </StyleRoot>
        )
    }
}

export default Radium(SingleResult);