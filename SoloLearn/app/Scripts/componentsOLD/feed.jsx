import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import FeedItem from './feed_item';

class Feed extends Component {
    constructor(props) {
        super(props);


        this.state = {   
            items : [
                { id: 1, name: 'Item 1'},
                { id: 2, name: 'Item 2'},
                { id: 3, name: 'Item 3'},
                { id: 4, name: 'Item 4'},
                { id: 5, name: 'Item 5'},
                { id: 6, name: 'Item 6'},
                { id: 7, name: 'Item 7'},
                { id: 8, name: 'Item 8'},
                { id: 9, name: 'Item 9'},
                { id: 10, name: 'Item 10'},
                { id: 11, name: 'Item 11'},
                { id: 12, name: 'Item 12'},
                { id: 13, name: 'Item 13'},
                { id: 14, name: 'Item 14'},
                { id: 15, name: 'Item 15'}
            ],
            isLoading: false
        };

        this.handleScroll = this.handleScroll.bind(this);
    }

    loadMoreItems() {
        var itemsToAdd = 20;
        //var secondsToWait = 2;
        this.setState({ isLoading: true });
        var $feedItems = ReactDOM.findDOMNode(this.refs.feedItems);
        $feedItems.className = "feed-items loading";
        // fake an async. ajax call with setTimeout
        //window.setTimeout(function() {
        // add data
        var currentItems = this.state.items;
        var itemsLength = currentItems.length;
        for (var i = 1; i <= itemsToAdd; i++) {
            var currentId = itemsLength + i;
            var item = {
                id: currentId,
                name: 'Item' + currentId
            }
            currentItems.push(item);
        }
        this.setState({
            items: currentItems,
            isLoading: false
        });
        $feedItems.className = "feed-items";
        //}.bind(this), secondsToWait * 1000);
    }
  
    renderItems() {
        const feedItems = this.state.items.map((item) => {
            return (
                <FeedItem
                    key={item.id}
                    name={item.name} 
                />
            );
        });

        return feedItems;
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }
    
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll(event) {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            if(!this.state.isLoading) {
                this.loadMoreItems();
            }
        }
    }

    render() {
        return (
            <div className="feed-items" ref="feedItems">
                {this.renderItems()}
                <div className="loader">
                    <svg className="material-spinner">
                        <circle className="path" cx="25" cy="25" r="12" fill="none" strokeWidth="3" strokeMiterlimit="10"></circle>
                    </svg>
                </div>
            </div>
        );
    }
}

export default Feed;