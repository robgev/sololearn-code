import { connect } from 'react-redux';

import { getDiscoverSuggestions } from 'actions/discover';
import DiscoverLayout from 'components/Layouts/DiscoverLayout';

const mapStateToProps = state => ({ discoverSuggestions: state.discoverSuggestions });
const mapDispatchToProps = { getDiscoverSuggestions };

const DiscoverContainer = connect(mapStateToProps, mapDispatchToProps)(DiscoverLayout);

export default DiscoverContainer;
