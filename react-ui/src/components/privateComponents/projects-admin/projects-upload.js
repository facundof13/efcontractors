import React, { Component } from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

const videoTypes = ['.mp4', '.mov'];

class ProjectsUpload extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedFiles: null,
			label: '',
			uploading: false,
			progress: 0
		};
	}
	multipleFileChangedHandler = (event) => {
		this.setState({
			selectedFiles: event.target.files,
			label: `Select Files (${event.target.files.length})`
		});
	};

	takeScreenshot(vid) {
		return new Promise(async (resolve, reject) => {
			var url = URL.createObjectURL(vid);
			var video = document.createElement('video');
			video.src = url;
			video.playsInline = true;
			video.muted = true;
			video.play();
			//we want to make the canvas the size of the video being uploaded
			//get video width and height
			video.oncanplay = function() {
				var canvas = document.createElement('canvas');
				canvas.width = video.videoWidth;
				canvas.height = video.videoHeight;

				//convert to desired file format
				setTimeout(() => {
					var ctx = canvas.getContext('2d');
					ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
					var dataURI = canvas.toDataURL('image/jpeg');
					URL.revokeObjectURL(url);
					resolve(dataURI);
				}, 1000); //at one second into the video
			};
		});
	}
	dataURItoBlob(dataURI) {
		var byteString = atob(dataURI.split(',')[1]);

		// separate out the mime component
		var mimeString = dataURI
			.split(',')[0]
			.split(':')[1]
			.split(';')[0];

		// write the bytes of the string to an ArrayBuffer
		var ab = new ArrayBuffer(byteString.length);

		// create a view into the buffer
		var ia = new Uint8Array(ab);

		// set the bytes of the buffer to the correct values
		for (var i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}

		// write the ArrayBuffer to a blob, and you're done
		var blob = new Blob([ab], { type: mimeString });
		return blob;
	}

	isVideo(name) {
		return videoTypes.includes(name.toLowerCase().slice(-4));
	}

	thumbName(filename) {
		// photo.jpg -> photothumb.jpg, clip.mov -> clipthumb.jpg
		return filename.replace(/\.[^.]+$/, 'thumb.jpg');
	}

	/**
	 * Downscale an image file to a small JPEG thumbnail (max 400px on the long
	 * edge) so gallery covers/strips don't have to load full-resolution photos.
	 */
	makeImageThumbnail(file, maxDim = 400) {
		return new Promise((resolve, reject) => {
			const url = URL.createObjectURL(file);
			const img = new Image();
			img.onload = () => {
				const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
				const w = Math.round(img.width * scale);
				const h = Math.round(img.height * scale);
				const canvas = document.createElement('canvas');
				canvas.width = w;
				canvas.height = h;
				canvas.getContext('2d').drawImage(img, 0, 0, w, h);
				URL.revokeObjectURL(url);
				canvas.toBlob(
					(blob) =>
						blob ? resolve(blob) : reject(new Error('Thumbnail failed')),
					'image/jpeg',
					0.7
				);
			};
			img.onerror = () => {
				URL.revokeObjectURL(url);
				reject(new Error('Could not load image for thumbnail'));
			};
			img.src = url;
		});
	}

	/**
	 * Turn the selected files into a flat list of upload items. Each video also
	 * gets a generated thumbnail item (role 'thumb') so it is uploaded alongside
	 * the video, mirroring the previous behavior.
	 */
	async buildUploadItems(selectedFiles) {
		const items = [];
		for (let file of Array.from(selectedFiles)) {
			const filename = file.name.toLowerCase().replace(/\s/g, '');
			const isVid = this.isVideo(file.name);
			items.push({
				blob: file,
				filename,
				contentType:
					file.type || (isVid ? 'video/mp4' : 'image/jpeg'),
				role: isVid ? 'video' : 'image'
			});
			if (isVid) {
				const dataURI = await this.takeScreenshot(file);
				items.push({
					blob: this.dataURItoBlob(dataURI),
					filename: this.thumbName(filename),
					contentType: 'image/jpeg',
					role: 'thumb'
				});
			} else {
				const thumbBlob = await this.makeImageThumbnail(file);
				items.push({
					blob: thumbBlob,
					filename: this.thumbName(filename),
					contentType: 'image/jpeg',
					role: 'thumb'
				});
			}
		}
		return items;
	}

	multipleFileUploadHandler = async () => {
		const selectedFiles = this.state.selectedFiles;
		// if file not selected throw error
		if (!selectedFiles) {
			window.alert('Please upload file.');
			return;
		}
		if (selectedFiles.length > 30) {
			window.alert('Only 30 images allowed at once');
			return;
		}

		this.setState({ uploading: true, progress: 0 });

		try {
			const items = await this.buildUploadItems(selectedFiles);

			// 1) ask the server to sign a PUT URL for every file
			const presign = await axios.post('/upload/presign', {
				projectName: this.props.user._id,
				files: items.map((i) => ({
					filename: i.filename,
					contentType: i.contentType
				}))
			});
			const signed = presign.data.files; // same order as items

			// 2) upload each file straight to S3 (bypasses the dyno + its timeout)
			const urlByFilename = {};
			for (let idx = 0; idx < items.length; idx++) {
				const item = items[idx];
				const sig = signed[idx];
				await axios.put(sig.uploadUrl, item.blob, {
					headers: {
						'Content-Type': item.contentType,
						'x-amz-acl': 'public-read'
					},
					withCredentials: false,
					transformRequest: [(d) => d] // send the blob untouched
				});
				urlByFilename[item.filename] = sig.publicUrl;
				this.setState({
					progress: Math.round(((idx + 1) / items.length) * 100)
				});
			}

			// 3) build the image records (videos carry their thumbnail URL)
			const images = [];
			for (let item of items) {
				// images and videos both carry their generated thumbnail URL;
				// 'thumb' items are attached to their parent here, not listed.
				if (item.role === 'image' || item.role === 'video') {
					images.push({
						url: urlByFilename[item.filename],
						thumbUrl: urlByFilename[this.thumbName(item.filename)]
					});
				}
			}

			// 4) tell the server to record them on the project
			await axios.post('/upload/confirm', {
				projectName: this.props.user._id,
				images
			});

			this.setState({
				label: 'Select Files',
				selectedFiles: null,
				uploading: false,
				progress: 0
			});
			this.props.getUser(this.props.user._id);
			this.props.getProjects();
		} catch (error) {
			console.log(error);
			const msg =
				(error.response &&
					error.response.data &&
					error.response.data.error) ||
				error.message ||
				'Upload failed';
			window.alert(msg);
			this.setState({ uploading: false, selectedFiles: null, progress: 0 });
		}
	};

	render() {
		return (
			<div>
				<div>
					<Button
						color='secondary'
						disabled={this.state.uploading}
						variant='text'
						component='label'>
						{this.state.label === '' ? 'Select Files' : this.state.label}
						<input
							type='file'
							multiple
							onChange={this.multipleFileChangedHandler}
							className='hide'
						/>
					</Button>
					<Button
						color='secondary'
						disabled={this.state.uploading}
						onClick={this.multipleFileUploadHandler}>
						Upload!
					</Button>
				</div>
				<div>
					{this.state.uploading ? (
						<span>
							<CircularProgress color='secondary' />
							{this.state.progress > 0 ? ` ${this.state.progress}%` : ''}
						</span>
					) : (
						''
					)}
				</div>
			</div>
		);
	}
}
export default ProjectsUpload;
