import React from 'react';
import Paper from 'material-ui/Paper';

export default ({ isPaper, ...rest }) => (isPaper ? <Paper {...rest} /> : <div {...rest} />);
