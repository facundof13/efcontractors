import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import Favicon from 'react-favicon';
import axios from 'axios';
import LoginForm from './components/LoginForm';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Admin from './components/PrivateComponents/Admin';
import Logout from './components/Logout';
import Estimates from './components/PrivateComponents/EstimatesAdmin/Estimates';
import NotFound from './components/NotFound';
import AboutUs from './components/AboutUs';
import Testimonials from './components/Testimonials';
import ExpandedProject from './components/ExpandedProject';
import Services from './components/Services';
import ProjectsPage from './components/PrivateComponents/ProjectsAdmin/ProjectsPage';
import ViewProjects from './components/ViewProjects';
import PrivateRoute from './components/PrivateComponents/PrivateRoute';
import Settings from './components/PrivateComponents/Settings/Settings';
import Footer from './components/Footer';
import ManageTestimonials from './components/PrivateComponents/ManageTestimonials';

export default function App() {
	const [user, setUser] = useState(null);
	const [loggedIn, setLoggedIn] = useState(false);
	const [finished, setFinished] = useState(false);

	useEffect(() => {
		try {
			getUser();
		} catch { }
	}, []);

	const updateUser = (data) => {
		setLoggedIn(data.loggedIn);
		setUser(data.user);
	}

	const getUser = async () => {
		try {
			const response = await axios.get(`${process.env.REACT_APP_ENDPOINT}/api/user`);

			if (response?.data) {
				setLoggedIn(true);
			}
		} catch (err) {
			console.error('Error Logging In');
		} finally {
			setFinished(true);
		}
	}


	return finished && (
		<div className='App'>
			<Favicon url='https://efcontractors.s3.us-east-2.amazonaws.com/favicon.ico' />
			<div>
				<Navbar updateUser={updateUser} loggedIn={loggedIn} />
				<Switch>
					<Route exact path='/' component={Home} />
					<Route
						exact
						path='/projects'
						render={(props) => <ViewProjects {...props} />}
					/>
					<Route
						exact
						path='/projects/:userId'
						render={(props) => <ExpandedProject {...props} />}
					/>
					<Route path='/testimonials' render={() => <Testimonials />} />
					<Route path='/about' render={() => <AboutUs />} />
					<Route path='/services' render={() => <Services />} />
					<Route
						path='/login'
						render={() => <LoginForm updateUser={updateUser} />}
					/>
					<Route
						path='/logout'
						render={() => (
							<Logout
								updateUser={updateUser}
								loggedIn={loggedIn}
							/>
						)}
					/>
					<PrivateRoute
						exact
						path='/admin/estimates'
						isAuthenticated={loggedIn}
						component={Estimates}
					/>
					<PrivateRoute
						exact
						path='/admin/projects'
						isAuthenticated={loggedIn}
						component={ProjectsPage}
					/>
					<PrivateRoute
						path='/admin/testimonials'
						component={ManageTestimonials}
						isAuthenticated={loggedIn}
					/>
					<PrivateRoute
						path='/admin/settings'
						component={Settings}
						isAuthenticated={loggedIn}
					/>
					<PrivateRoute
						path='/admin'
						component={Admin}
						isAuthenticated={loggedIn}
					/>
					<Route component={NotFound} />
				</Switch>
			</div>
			<Footer />
		</div>
	);
}
