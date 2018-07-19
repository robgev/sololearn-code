import React from 'react';
import 'styles/components/Shimmers/PlayShimmer.scss';

const PlayShimmer = () => {
    const renderContainers = Array(20).fill(0).map((_, i) => {
        return (
            <div className='play-shimmer-container' style={{marginTop: i * 60}} key={i}>
              <div className='user'>
                <div className='avatar'/>
                <div className='name-and-date'>
                  <div className='name' />
                  <div className='date' />
                </div>
              </div>
              <div className='contest'>
                <div className='language'/>
                <div className='state'/>
                <div className='result'/>
              </div>
            </div>
        );
    });
    return(
        <div>
          {renderContainers}
          <div className='play-shimmer-shimmer'/>
        </div>
    );
};

export default PlayShimmer
