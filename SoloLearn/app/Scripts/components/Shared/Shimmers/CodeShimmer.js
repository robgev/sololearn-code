import React from 'react';
import 'styles/components/Shared/Shimmers/CodeShimmer.scss';

const CodeShimmer = () => {
    const renderContainers = Array(10).fill(0).map((_, i) => {
        return (
            <div className='code-shimmer-container' style={{marginTop: i * 60}} key={i}>
              <div className='code'>
                <div className='avatar' />
                <div className='code-info'>
                  <div className='title' />
                  <div className='info' />
                </div>
              </div>
              <div className='user'>
                <div className='name-and-date'>
                  <div className='name' />
                  <div className='date' />
                </div>
                <div className='avatar' />
              </div>
            </div>
        );
    });
    return(
        <div>
          {renderContainers}
          <div className='code-shimmer-shimmer'/>
        </div>
    );
};

export default CodeShimmer;
