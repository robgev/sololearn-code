import { translate } from 'react-i18next';

const Localize = ({ children, t }) => children({ t });

export default translate()(Localize);
