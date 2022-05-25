class ImageHandler {

	constructor(image_files, placeCurrentImageCallback) {
		console.log(image_files);
		//init, load images
		this.last_image = null; //Hold on to shifted image in case user hits the 'unclassify previous'
		//this.image_buffer = [];
		this.placeCurrentImageCallback = placeCurrentImageCallback;
		this.image_list = image_files;
		this.image_index = 0;
		this.image_object = {
			old: null,
			current: null,
			next: null
		};

		front.send("getimage", this.image_list[0].image_filename, "current", true);
		front.send("getimage", this.image_list[1].image_filename, "next", false);
	}

	get imageList() {
		return this.image_list;
	}

	classifyImage(classification) {
		this.image_list[this.image_index].classification = classification;
		this.placeCurrentImageCallback(this.image_object.next);
		this.image_index++;

		this.image_object.old = this.image_object.current;
		this.image_object.current = this.image_object.next;
		front.send("getimage", this.image_list[this.image_index+1].image_filename, "next", false);
	}

	unclassifyPreviousImage() {
		this.image_index--;
		this.placeCurrentImageCallback(this.image_object.old);
		this.image_object.current = this.image_object.old;
		this.image_object.next = this.image_object.current;
	}

	storeImage(image, loadname, load) {
		console.log(image);
		this.image_object[loadname] = image;
		if(load) this.placeCurrentImageCallback(image);
	}
}