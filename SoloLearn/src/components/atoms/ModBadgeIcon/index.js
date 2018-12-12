import React from 'react';
import { Container, Image } from 'components/atoms';
import './styles.scss';

const ModBadgeIcon = ({ className, mode, ...props }) =>
	<Container className={`atom_mod-badge-icon ${mode} ${className}`} {...props}>
		<Image className="atom_mod-badge-img" src={`${mode === 'primary' ? '/assets/mod_primary.png' : '/assets/mod.png'}`} alt="Mod" />
	</Container>

ModBadgeIcon.defaultProps = {
	className: '',
	mode: ''
};
export default ModBadgeIcon;