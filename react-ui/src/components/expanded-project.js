import React from 'react';
import { Typography, IconButton, Button, ButtonBase } from '@material-ui/core';
import ImageGallery from './react-image-gallery/ImageGallery';
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

			cp.images = cp.images.map(i => {
				let obj = {};
				if (i.thumbUrl) {
					obj.original = i.url;
					obj.thumbnail = i.thumbUrl;
					obj.isVideo = true;
				} else {
					obj.original = i.url;
					obj.thumbnail = i.url;
					obj.isVideo = false;
				}
				return obj;
			})
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
				<ImageGallery items={this.state.project.images} showPlayButton={false} showFullscreenButton={false}/>
			</div>

		);
		if (this.state.project) {
			return value;
		} else return '';
	}
}
