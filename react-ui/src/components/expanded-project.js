import React from 'react';
import { Typography, IconButton, Button, ButtonBase } from '@material-ui/core';
import ArrowForward from '@material-ui/icons/ArrowForward';
import ArrowBack from '@material-ui/icons/ArrowBack';
import { Swipeable } from 'react-swipeable';
import LazyLoad from 'react-lazyload';

const videoTypes = ['.mp4', '.mov'];

export default class ExpandedProject extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			photoIndex: 0,
			videoThumbs: [],
			project: undefined,
		};

		this.handleArrows = this.handleArrows.bind(this);
		this.gotoNext = this.gotoNext.bind(this);
		this.gotoPrev = this.gotoPrev.bind(this);
		this.gotoThumb = this.gotoThumb.bind(this);
		this.componentDidMount = this.componentDidMount.bind(this);
	}

	componentDidMount() {
		document.addEventListener('keydown', this.handleArrows, false);
		// if undefined, go to home
		if (this.props.location.state) {
			let cp = JSON.parse(JSON.stringify(this.props.location.state.project));

			let vids = cp.images.filter((obj) => {
				return obj.url.slice(-4) === '.mp4' || obj.url.slice(-4) === '.mov';
			});

			cp.images = cp.images.filter((obj) => {
				return obj.url.slice(-4) !== '.mp4' && obj.url.slice(-4) !== '.mov';
			});

			vids.forEach((vid) => {
				cp.images.unshift(vid);
			});
			this.setState({
				project: cp,
			});
		} else {
			this.props.history.go(-1);
		}

		window.scrollTo(0, 0);
	}

	componentWillUnmount() {
		document.removeEventListener('keydown', this.handleArrows, false);
	}

	gotoNext() {
		this.setState((prevState) => ({
			photoIndex: (prevState.photoIndex + 1) % this.state.project.images.length,
		}));
	}

	gotoPrev() {
		this.setState((prevState) => ({
			photoIndex:
				(prevState.photoIndex + this.state.project.images.length - 1) %
				this.state.project.images.length,
		}));
	}

	handleArrows(e) {
		if (e.keyCode === 39) {
			// Move index + 1
			this.gotoNext();
		} else if (e.keyCode === 37) {
			// Move index -1
			this.gotoPrev();
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
			photoIndex: index,
		});
	}

	render() {
		let value = this.state.project && (
			<div>
				<Typography color='secondary' component='span' variant='h5'>
					<h4>
						{this.state.project.name + ' - ' + this.state.project.location}
					</h4>
				</Typography>
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
							<LazyLoad key={img.url}>
								<div className='small-images'>
									<ButtonBase>
										{videoTypes.includes(img.url.slice(-4)) ? (
											<LazyLoad height='105px'>
												<img
													src={img.thumbUrl}
													alt=''
													onClick={() => {
														this.gotoThumb(img.url);
													}}
												/>
											</LazyLoad>
										) : (
											<LazyLoad height='105px'>
												<img
													src={img.url}
													alt=''
													onClick={() => {
														this.gotoThumb(img.url);
													}}
												/>
											</LazyLoad>
										)}
									</ButtonBase>
								</div>
							</LazyLoad>
						);
					})}
				</div>
				<div>
					<Button
						variant='outlined'
						color='secondary'
						className='btn-login'
						onClick={() => {
							this.props.history.push('/projects');
						}}>
						Back to projects
					</Button>
				</div>
			</div>
		);
		if (this.state.project) {
			return value;
		} else return '';
	}
}
