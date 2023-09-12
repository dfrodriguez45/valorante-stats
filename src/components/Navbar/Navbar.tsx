import React from 'react';
import './Navbar.css';

export type NavbarProps = {
}

const Navbar: React.FC<NavbarProps>  = ({}) => {
	return <div className='navbar'>
		<input className='navbar__input' type="text" maxLength={16} placeholder='RIOT ID' />
		<span className='text-2xl'>#</span>
		<input className='navbar__input' type="text" maxLength={5} placeholder='TAGLINE' />
	</div>;
};

export default Navbar;
