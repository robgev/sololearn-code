// React modules
import React from 'react';
import Radium, { Style } from 'radium';

const defaultSyles =
    (<Style rules={{
    	'*': {
    		margin: 0,
    		padding: 0,
    		fontFamily: 'Roboto, sans-serif',
    	},
    	'body, html': {
    		// height: '100%'
    	},
    	'#app': {
    		// display: 'flex',
    		// flexFlow: 'column',
    		// height: '100%'
    	},
    }}
    />);

export default defaultSyles;
