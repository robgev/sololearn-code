import React from 'react';

export const createAnswerUI = ({id, isCompleted}) => <div key={id}>{isCompleted ? 'yay' : 'nah'}</div>;