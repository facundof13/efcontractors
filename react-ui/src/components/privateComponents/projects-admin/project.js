import React, { Component } from 'react';
import Axios from 'axios';
import ProjectsUpload from './projects-upload';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Button } from '@material-ui/core';

class Project extends Component {
	constructor(props) {
		super(props);

		this.state = { areImagesVisible: false, deleting: false };
		this.toggleImages = this.toggleImages.bind(this);
		this.imgDelete = this.imgDelete.bind(this);
		this.render = this.render.bind(this);
	}

	imgDelete(event) {
		if (window.confirm('Delete this image?')) {
			this.setState({ deleting: true });
			Axios.delete('/admin/api/deleteimg', {
				data: { id: this.props.user._id, image: event.target.src },
			}).then((res) => {
				this.props.getUser(this.props.user._id);
				this.props.getProjects();
				this.setState({ deleting: false });
			});
		}
	}

	toggleImages = () => {
		this.setState((prevState) => ({
			areImagesVisible: !prevState.areImagesVisible,
		}));
	};

	render() {
		return (
			<div className='user-container'>
				<ProjectsUpload
					user={this.props.user}
					getProjects={this.props.getProjects}
					getUser={this.props.getUser}
				/>
				<Button
					className='alert-delete'
					onClick={() => {
						this.props.deleteProject(this.props.user);
					}}>
					Delete Project
				</Button>
				<div>
					{this.state.uploading && <CircularProgress color='secondary' />}
				</div>
				{this.props.user.images.map((image) =>
					image.url.substr(image.length - 4).match(/(mp4)|(mov)|(m4v)/) ? (
						<video
							className='small-preview'
							controls
							width='175px'
							src={image.url}
							key={image.url}
							onClick={this.imgDelete}
						/>
					) : (
						<img
							className='small-preview'
							key={image.url}
							src={image.url}
							onClick={this.imgDelete}
							alt=''
							width='175px'
						/>
					)
				)}
			</div>
		);
	}
}

export default Project;
