class ImageHandler {

	constructor(images, placeCurrentImageCallback) {
		//init, load images
		this.last_image = null; //Hold on to shifted image in case user hits the 'unclassify previous'
		this.image_buffer = [];
		this.placeCurrentImageCallback = placeCurrentImageCallback;
		this.image_list = images;
		this.image_index = 0;
		front.send("getimages", this.image_list.slice(0, 5));
	}

	get imageList() {
		return this.image_list;
	}

	classifyImage(classification) {
		this.image_list[this.image_index].classification = classification;
		this.image_index++;
		this.last_image = this.image_buffer.shift();
		this.placeCurrentImageCallback(this.last_image);
		front.send("getimage", this.image_list[this.image_index+5]);
	}

	unclassifyPreviousImage() {
		this.image_index--;
		this.placeCurrentImageCallback(this.last_image);
	}

	storeImages(images) {
		this.image_buffer = images;
		this.placeCurrentImageCallback(images[0]);
	}

	storeImage(image) {
		this.image_buffer.push(this.image);
	}
}