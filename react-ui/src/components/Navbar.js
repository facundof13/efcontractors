import React, { useEffect, useState } from 'react';
import '../App.css';
import AppBar from '@material-ui/core/AppBar';
import { Link, useHistory } from 'react-router-dom';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import MenuIcon from '@material-ui/icons/Menu';
import { Drawer, ClickAwayListener, Divider } from '@material-ui/core';

const pathNames = {
	'/': ' ',
	'/login': 'Login',
	'/about': 'About us',
	'/testimonials': 'Testimonials',
	'/projects': 'Projects',
	'/services': 'Services',
	'/admin': 'Admin Home',
	'/admin/projects': 'Manage Projects',
	'/admin/estimates': 'Manage Estimates',
	'/admin/testimonials': 'Manage Testimonials',
	'/admin/settings': 'Settings'
};

export default function Navbar({ loggedIn }) {
	const [open, setOpen] = useState(false);
	const [appClassName, setAppClassName] = useState('');
	const [appTitle, setAppTitle] = useState(pathNames[window.location.pathname] || 'EFContractors');
	const history = useHistory();

	useEffect(() => {
		history.listen(() => {
			const title = pathNames[window.location.pathname];
			setAppTitle(title);

			if (title === 'Manage Estimates' || title === 'Settings') {
				setAppClassName('no-shadow');
			}
		});
	}, []);

	function handleClick() {
		setOpen(true);
	}

	function handleClose() {
		setOpen(false);
	}
	return (
		<div className='root'>
			<ClickAwayListener disableReactTree={true} onClickAway={handleClose}>
				<AppBar position='static' className={appClassName}>
					<Toolbar>
						<Button
							aria-controls='simple-menu'
							aria-haspopup='true'
							onClick={handleClick}
							color='secondary'>
							<MenuIcon />
						</Button>
						<Typography color='secondary' variant='h6' className='title'>
							{appTitle}
						</Typography>
						{loggedIn ? (
							<Link className='navbar-link' to='/logout'>
								<Button color='secondary'>Logout</Button>
							</Link>
						) : (
							<Link className='navbar-link' to='/login'>
								<Button color='secondary'>Login</Button>
							</Link>
						)}
					</Toolbar>
					<Drawer
						className='navbar-drawer'
						variant='temporary'
						anchor='left'
						open={open}>
						<img
							src='https://efcontractors.s3.us-east-2.amazonaws.com/logosmall.png'
							alt='small logo'
							width='200px'></img>
						<Divider />
						{loggedIn ? (
							<div>
								<Link className='navbar-link' to='/admin'>
									<MenuItem color='secondary' onClick={handleClose}>
										Admin Home
									</MenuItem>
								</Link>
								<Divider />
								<Link className='navbar-link' to='/admin/projects'>
									<MenuItem color='secondary' onClick={handleClose}>
										Manage Projects
									</MenuItem>
								</Link>
								<Divider />
								<Link className='navbar-link' to='/admin/estimates'>
									<MenuItem color='secondary' onClick={handleClose}>
										Manage Estimates
									</MenuItem>
								</Link>
								<Divider />
								<Link className='navbar-link' to='/admin/testimonials'>
									<MenuItem color='secondary' onClick={handleClose}>
										Manage Testimonials
									</MenuItem>
								</Link>
								<Divider />
								<Link className='navbar-link' to='/admin/settings'>
									<MenuItem color='secondary' onClick={handleClose}>
										Settings
									</MenuItem>
								</Link>
								<Divider />
							</div>
						) : (
							<div>
								{/* Not Logged in currently: */}
								<Link className='navbar-link' to='/'>
									<MenuItem color='secondary' onClick={handleClose}>
										Home
									</MenuItem>
								</Link>
								<Divider />
								<Link className='navbar-link' to='/about'>
									<MenuItem color='secondary' onClick={handleClose}>
										About Us
									</MenuItem>
								</Link>
								<Divider />
								<Link className='navbar-link' to='/testimonials'>
									<MenuItem color='secondary' onClick={handleClose}>
										Testimonials
									</MenuItem>
								</Link>
								<Divider />
								<Link className='navbar-link' to='/projects'>
									<MenuItem color='secondary' onClick={handleClose}>
										Projects
									</MenuItem>
								</Link>
								<Divider />
								<Link className='navbar-link' to='/services'>
									<MenuItem color='secondary' onClick={handleClose}>
										Services
									</MenuItem>
								</Link>
								<Divider />
							</div>
						)}
					</Drawer>
				</AppBar>
			</ClickAwayListener>
		</div>
	);
}