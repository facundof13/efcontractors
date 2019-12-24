import React from 'react';
import {
	Typography,
	IconButton,
	Divider,
	Button,
	ButtonBase
} from '@material-ui/core';
import ArrowForward from '@material-ui/icons/ArrowForward';
import ArrowBack from '@material-ui/icons/ArrowBack';
import { Swipeable } from 'react-swipeable';

const videoTypes = ['.mp4', '.mov'];

export default class ExpandedProject extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			photoIndex: 0,
			videoThumbs: [],
			project: JSON.parse(JSON.stringify(this.props.project))
		};

		this.handleArrows = this.handleArrows.bind(this);
		this.gotoNext = this.gotoNext.bind(this);
		this.gotoPrev = this.gotoPrev.bind(this);
		this.gotoThumb = this.gotoThumb.bind(this);
		this.componentDidMount = this.componentDidMount.bind(this);
	}

	componentDidMount() {
		document.addEventListener('keydown', this.handleArrows, false);
	}

	componentWillUnmount() {
		document.removeEventListener('keydown', this.handleArrows, false);
	}

	gotoNext() {
		this.setState((prevState) => ({
			photoIndex: (prevState.photoIndex + 1) % this.state.project.images.length
		}));
	}

	gotoPrev() {
		this.setState((prevState) => ({
			photoIndex:
				(prevState.photoIndex + this.state.project.images.length - 1) %
				this.state.project.images.length
		}));
	}

	handleArrows(e) {
		if (e.keyCode === 39) {
			// Move index + 1
			this.gotoNext();
		} else if (e.keyCode === 37) {
			// Move index -1
			this.gotoPrev();
		} else if (e.keyCode === 27) {
			// close project
			this.props.closeProject();
		}
	}

	gotoThumb(img) {
		let index = 0;
		for (let i = 0; i < this.state.project.images.length; i++) {
			if (this.state.project.images[i].url === img) {
				index = i;
			}
		}
		this.setState({
			photoIndex: index
		});
	}

	render() {
		return (
			<div>
				<Typography color='secondary' component='span' variant='h5'>
					<h5>{this.state.project.name + ' ' + this.state.project.location}</h5>
				</Typography>

				<Divider className='top' />
				<div>
					<Button
						variant='outlined'
						color='secondary'
						className='btn-login'
						onClick={this.props.closeProject}>
						Back to projects
					</Button>
				</div>
				<div className='expanded-project'>
					<div className='arrow'>
						<IconButton
							color='secondary'
							onClick={this.gotoPrev}
							disableRipple={true}
							className='arrow-left'>
							<ArrowBack />
						</IconButton>
					</div>
					<Swipeable onSwipedRight={this.gotoPrev} onSwipedLeft={this.gotoNext}>
						{videoTypes.includes(
							this.state.project.images[this.state.photoIndex].url.slice(-4)
						) ? (
							<div className='fade-in'>
								{/* <video controls playsInline id='myVid'
                  poster={this.state.project.images[this.state.photoIndex].thumbUrl}
                >
                  <source
                    type=
                    src={this.state.project.images[this.state.photoIndex].url}
                  />
                </video> */}
								<video
									src={this.state.project.images[this.state.photoIndex].url}
									className='big-image'
									playsInline
									controls
									loop
									type={
										this.state.project.images[this.state.photoIndex].url.slice(
											-4
										) === '.mp4'
											? 'video/mp4'
											: 'video/quicktime'
									}
									id='myVid'
									key={this.state.project.images[this.state.photoIndex].url}
									poster={
										this.state.project.images[this.state.photoIndex].thumbUrl
									}
								/>
							</div>
						) : (
							<div className='fade-in'>
								<img
									key={this.state.project.images[this.state.photoIndex].url}
									src={this.state.project.images[this.state.photoIndex].url}
									alt=''
									className='big-image'
								/>
							</div>
						)}
					</Swipeable>
					<div className='arrow'>
						<IconButton
							onClick={this.gotoNext}
							color='secondary'
							disableRipple={true}
							className='arrow-right'>
							<ArrowForward />
						</IconButton>
					</div>
				</div>
				<Typography component='p' variant='caption' color='secondary'>
					{this.state.photoIndex + 1}/{this.state.project.images.length}
				</Typography>
				<div className='small-images-container'>
					{this.state.project.images.map((img, i) => {
						return (
							<div className='small-images' key={img.url}>
								<ButtonBase>
									{videoTypes.includes(img.url.slice(-4)) ? (
										<img
											src={img.thumbUrl}
											alt=''
											onClick={() => {
												this.gotoThumb(img.url);
											}}
										/>
									) : (
										<img
											alt=''
											src={img.url}
											onClick={() => {
												this.gotoThumb(img.url);
											}}
										/>
									)}
								</ButtonBase>
							</div>
						);
					})}
				</div>
			</div>
		);
	}
}
