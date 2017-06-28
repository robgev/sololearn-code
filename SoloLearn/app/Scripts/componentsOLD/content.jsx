import React from 'react';
import SideBar from './sidebar_partial';
import Feed from './feed';
import Learn from './learn';

const Content = (props) => {
    return (
        <div className="wrapper content">
            {props.currentTab === 1 ?
            <div className="feed">
                <div className="feed-content content-item">
                    <Feed />
                </div>
                <SideBar currentTab={props.currentTab} />
            </div>
            :null}

            {props.currentTab === 2 ?
            <div className="learn">
                <div className="learn-content content-item">
                    <Learn />
                </div>
                <SideBar currentTab={props.currentTab} /> 
            </div>
            :null}

            {props.currentTab === 3 ?
            <div className="play">
                <div className="play-content content-item">
                    <h1>#Play</h1>
                </div>
                <SideBar currentTab={props.currentTab} /> 
            </div>
            :null}
            
            {props.currentTab === 4 ?
            <div className="code">
                <div className="code-content content-item">
                    <h1>#Code</h1>
                </div>
                <SideBar currentTab={props.currentTab} /> 
            </div>
            :null}

            {props.currentTab === 5 ?
            <div className="discuss">
                <div className="discuss-content content-item">
                    <h1>#Discuss</h1>
                </div>
                <SideBar currentTab={props.currentTab} /> 
            </div>
            :null}
        </div>
    );
}

export default Content;