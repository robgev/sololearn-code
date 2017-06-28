import React, { Component } from 'react';
import { Link } from 'react-router'

class TabListItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
          <li className={this.props.isCurrent ? 'active tab-item' : 'tab-item'}>
              <Link to={this.props.url} onClick={ event => this.handleClick(event, this.props) }>
                {this.props.name}
              </Link>
          </li>
        );
     }

    handleClick(e, tab) {
        e.preventDefault();
        this.props.onTabChange(tab);
    }
}

export default TabListItem;