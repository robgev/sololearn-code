import React from 'react';
import Loadable from 'react-loadable';
import { EmptyCard } from 'components/molecules';

const Loading = () => <EmptyCard loading />;

export default ({ loader }) => Loadable({ loader, loading: Loading });
