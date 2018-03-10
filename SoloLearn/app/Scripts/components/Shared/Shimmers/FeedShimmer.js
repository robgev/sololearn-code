import React from 'react';
import 'styles/components/Shared/Shimmers/FeedShimmer.scss';

const FeedShimmer = () => {
    const renderContainers = Array(20).fill(0).map((_, i) => {
        return (
            <div className='feed-shimmer-container' style={{marginTop: 20 + i * 170}} key={i}>
              <div className='post'>
                <div className='avatar'/>
                <div className='post-info'>
                  <div className='poster-name' />
                  <div className='post' />
                  <div className='info' />
                </div>
              </div>
              <div className='date-container'>
                <div className='date' />
              </div>
            </div>
        );
    });
    return(
        <div>
          {renderContainers}
          <div className='feed-shimmer-shimmer'/>
        </div>
    );
};

export default FeedShimmer
