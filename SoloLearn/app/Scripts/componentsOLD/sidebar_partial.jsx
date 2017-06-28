import React from 'react';

const SideBar = (props) => {
    return (
        <div className="sidebar">
            {props.currentTab === 1 ?
            <div className="feed-sidebar">
                <h1>#Feed SideBar</h1>
            </div>
            :null}

            {props.currentTab === 2 ?
            <div className="learn-sidebar">
                <h1>#Learn SideBar</h1>
            </div>
            :null}

            {props.currentTab === 3 ?
            <div className="play-sidebar">
                <h1>#Play SideBar</h1>
            </div>
            :null}
            
            {props.currentTab === 4 ?
            <div className="code-sidebar">
                <h1>#Code SideBar</h1>
            </div>
            :null}

            {props.currentTab === 5 ?
            <div className="discuss-sidebar">
                <h1>#Discuss SideBar</h1>
            </div>
            :null}
        </div>
    );
}

export default SideBar;