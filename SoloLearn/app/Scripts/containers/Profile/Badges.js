//React modules
import React, { Component } from 'react';

//Additional data and components
import Badge from './Badge';

const styles = {
    container: {
        margin: '5px 0 0 0',
        padding: '10px'
    },

    content: {
        display: 'flex',
        flexWrap: 'wrap',
        margin: '10px 0 0 0',
    },

    title: {
        textTransform: 'uppercase'
    }
}

class Badges extends Component {
    constructor(props) {
        super(props);

    }

    renderBadges() {
        const badges = this.props.badges;

        return badges.map((badge, index) => {
            return (
                <Badge key={badge.id} achievement={badge} />
            );
        });
    }

    render() {
        return (
            <div id="Badges" style={styles.container}>
                <p style={styles.title}>Badges</p>
                <div className="content" style={styles.content}>{this.renderBadges()}</div>
            </div>
        );
    }
}

export default Badges;