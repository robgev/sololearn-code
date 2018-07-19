import React from 'react';
import 'styles/Challenges/Challenge/Game/GameUtil.scss'
export const createAnswerUI = ({id, isCompleted}) => (
    <div key={id}>
        <img src={isCompleted ? '/assets/check_mark_right.png' : '/assets/red_cross_wrong.png'} className='answer-mark-img' />
    </div>
);