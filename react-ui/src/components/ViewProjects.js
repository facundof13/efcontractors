import React from 'react';
import axios from 'axios';
import { Card, CardHeader, CardMedia, CardActionArea } from '@material-ui/core';
import { Link } from 'react-router-dom';
import _ from 'lodash';

export default class Viewprojects extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			projects: [],
		};
		this.render = this.render.bind(this);
		this.componentDidMount = this.componentDidMount.bind(this);
		this.getAllProjects = this.getAllProjects.bind(this);
	}

	componentDidMount() {
		this.getAllProjects();
	}

	getAllProjects() {
		return new Promise((r, rj) => {
			axios.get('/api/projects').then((res) =>
				this.setState(
					{
						projects: _.sortBy(res.data, (i) => {
							return i.name;
						}),
					},
					() => {
						r();
					}
				)
			);
		});
	}

	render() {
		return (
			<div>
				<div className='project-card'>
					{this.state.projects.map(
						(project) =>
							project.images.length > 0 && (
								<div key={project._id}>
									<Link
										to={{
											pathname: `/projects/${project.name}`,
											state: {
												project: project,
												scrollPos: window.pageYOffset,
											},
										}}>
										<Card>
											<CardActionArea>
												<div>
													<CardMedia
														component='img'
														loading='lazy'
														decoding='async'
														style={{ height: '200px', objectFit: 'cover' }}
														image={
															project.images[0].thumbUrl || project.images[0].url
														}
														alt={project.name}
													/>
												</div>
												<CardHeader
													subheader={project.name + ' - ' + project.location}
												/>
											</CardActionArea>
										</Card>
									</Link>
								</div>
							)
					)}
				</div>
			</div>
		);
	}
}
