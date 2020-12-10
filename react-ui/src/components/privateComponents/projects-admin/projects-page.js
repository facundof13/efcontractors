import React, { Component } from 'react';
import Project from './project';
import ProjectsCreate from './projects-create';
import ProjectList from './project-list';
import Axios from 'axios';
import { Divider } from '@material-ui/core';
import _ from 'lodash';

export default class ProjectsPage extends Component {
	constructor() {
		super();
		this.state = {
			name: '',
			location: '',
			currentUser: {},
			newName: '',
			newLocation: '',
			data: [],
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.getUser = this.getUser.bind(this);
		this.render = this.render.bind(this);
		this.getProjects = this.getProjects.bind(this);
		this.componentDidMount = this.componentDidMount.bind(this);
		this.deleteProject = this.deleteProject.bind(this);
	}

	componentDidMount() {
		this.getProjects();
	}

	getUser(id) {
		if (id) {
			Axios.get('/admin/api/projectname', { params: { id: id } }).then(
				(res) => {
					this.setState({ currentUser: res.data[0] });
				}
			);
		} else {
			this.setState({ currentUser: {} });
		}
	}

	handleSubmit() {
		this.getProjects().then(() => {
			this.setState(
				{ currentUser: this.state.data[this.state.data.length - 1] },
				() => {
					this.getUser(this.state.currentUser._id);
				}
			);
		});
	}

	async getProjects() {
		let projects = await Axios.get('/admin/api/projects');
		this.setState({
			data: projects.data,
		});
	}

	deleteProject(project) {
		if (
			window.confirm(`Delete project ${project.name} from ${project.location}?`)
		) {
			Axios.delete('/admin/api/deleteproject', {
				data: {
					id: project._id,
					numImages: project.images.length,
				},
			}).then(() => {
				this.getProjects();
				this.setState({ currentUser: {} });
			});
		}
	}

	render() {
		return (
			<div>
				<div className='projects-top'>
					<ProjectsCreate handleSubmit={this.handleSubmit} />
					<ProjectList
						projects={this.state.data}
						getUser={this.getUser}
						getProjects={this.getProjects}
						user={this.state.currentUser}
					/>
				</div>
				<Divider />
				<div className='container'>
					{Object.keys(this.state.currentUser).length !== 0 && (
						<Project
							deleteProject={this.deleteProject}
							user={this.state.currentUser}
							getProjects={this.getProjects}
							getUser={this.getUser}
						/>
					)}
				</div>
			</div>
		);
	}
}
