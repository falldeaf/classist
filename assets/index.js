//////////////////////
// TODO: 
// * place classification json on server, still
// * add image/audio from camera/mic (how will that splice in? add to image buffer and image list array?)
// * add audio file ability?
// * add dots under image showing progress grey dots for unclassified image, colored dots that match colors on classify buttons
// * Undo button and skip button

// BUGS:
// * images not buffering after first five (getImages) working and (getImage) not working?

let current_creds = [];
let current_index = -1;
let current_pass;
let current_classifier;
let current_list;

let ihandle;
let image_loaded = []; //5 loaded images
let image_index = 0;   //index of currently viewed image

(async ()=> {
	removeAllChildNodes(document.querySelector("#cred-list"));
	front.send("loadcreds", app.getPath('userData'));
	//for(let i = 0; i <=10; i++) addListItem({label: i});
})();

front.on("rendercreds", function(creds){
	current_creds = creds;
	renderList();
});

front.on("storelist", function(files) {
	console.log(files);

	let image_list = [];   //All image filenames without json
	for(let file1 of files) {
		if(file1.name.endsWith(".jpg")) {
			let hasJson = false;
			for(let file2 of files) {
				if(file1.name.split('.')[0] + ".json" === file2.name) {
					hasJson = true;
				}
			}
			if(!hasJson) image_list.push({image_filename: file1.name, classification: -1});
		}
	}

	ihandle = new ImageHandler(image_list, setImage);
});

front.on("testresult", function(result){
	document.querySelector('#test-button').removeAttribute("disabled");
	document.querySelector('#test-button').innerHTML = '<i class="fas fa-vial"></i> Test';

	if(result.hasOwnProperty('classifiers')) {
		if(document.querySelector("#test-button").classList.contains('btn-info')) document.querySelector("#test-button").classList.replace("btn-info", "btn-success");
		if(document.querySelector("#test-button").classList.contains('btn-danger')) document.querySelector("#test-button").classList.replace("btn-danger", "btn-success");
		app.toast.show( "Success", 0);
	} else {
		if(document.querySelector("#test-button").classList.contains('btn-info')) document.querySelector("#test-button").classList.replace("btn-info", "btn-danger");
		if(document.querySelector("#test-button").classList.contains('btn-success')) document.querySelector("#test-button").classList.replace("btn-success", "btn-danger");
		app.toast.show( "Can't connect", 0);
	}

});

front.on("receiveimages", function(images) {
	console.log(images);
	/*
	current_images = images;
	setImage(images[0]);
	front.send("savejson", "{fooey:\"blah\"}", "/testfile.json");
	console.log(images);
	*/
	ihandle.storeImages(images);
});

front.on("receiveimage", function(image) {
	ihandle.storeImage(image);
});

front.on("classifierresult", function(result){
	document.querySelector('#pass-button').removeAttribute("disabled");
	document.querySelector('#pass-button').innerHTML = 'Connect';

	if(result.hasOwnProperty('classifiers')) {
		current_classifier = result;
		current_pass = document.querySelector('#check-pass-field').value;
		document.querySelector('#check-pass-field').value = "";
		addClassifyButtons(result.classifiers);
		$('#pass-modal').modal('hide');
		$('#play-modal').modal('show');
		front.send("list", current_creds[current_index], current_pass);
	} else {
		console.log("bad password");
		app.toast.show("Can't connect", 0);
		if(document.querySelector("#pass-button").classList.contains('btn-primary')) document.querySelector("#pass-button").classList.replace("btn-primary", "btn-danger");
	}

});

front.on("toast", function(message){
	app.toast.show(message, 0);
});

front.on("console", function(message){
	console.log(message);
});

function renderList() {
	removeAllChildNodes(document.querySelector("#cred-list"));
	for(let cred of current_creds) {
		console.log(cred);
		addListItem(cred);
	}
	////Add event handlers to buttons

	//Play-password open buttons
	document.querySelectorAll('.play-open').forEach(pbutton => {
		pbutton.onclick = function(evt) {
			let label = evt.target.getAttribute('clabel');
			console.log(evt.target);
			console.log("play button label: " + label);

			current_index = getIndexByName(label);
			document.querySelector('#pass-label').innerHTML = label;
			document.querySelector('#check-user-field').value = current_creds[current_index].username;
			document.querySelector("#pass-button").setAttribute('clabel', label);
			document.querySelector('#check-pass-field').focus();
		}
	});

	//Delete open buttons
	document.querySelectorAll('.delete-open').forEach(dbutton => {
		dbutton.onclick = function(evt) {
			let label = evt.target.getAttribute('clabel');
			console.log(evt.target);
			console.log("delete button label: " + label);
			document.querySelector("#delete-label").innerHTML = label;
			document.querySelector("#delete-button").setAttribute('clabel', label);
		}
	});

	//Edit open buttons
	document.querySelectorAll('.edit-open').forEach(ebutton => {
		ebutton.onclick = function(evt) {
			let label = evt.target.getAttribute('clabel');
			console.log(evt.target);
			console.log("edit button label: " + label);
			document.querySelector("#label-field").value = current_creds[getIndexByName(label)].label;
			document.querySelector("#host-field").value = current_creds[getIndexByName(label)].host;
			document.querySelector("#port-field").value = current_creds[getIndexByName(label)].port;
			document.querySelector("#path-field").value = current_creds[getIndexByName(label)].path;
			document.querySelector("#user-field").value = current_creds[getIndexByName(label)].username;
			document.querySelector("#pass-field").value = "";//current_creds[getIndexByName(label)].password;
		}
	});
}

//Save button
document.querySelector("#save-button").onclick = function(evt){
	let cred = captureFields();
	cred.password = ""; //Always delete this, this is only used for testing the connection, never store it
	current_creds.push(cred);
	clearFields();
	$('#add-modal').modal('hide');
	renderList();
	front.send("savecreds", current_creds);
}

//Test button
document.querySelector("#test-button").onclick = function(evt) {
	let cred = captureFields();
	console.log(cred);

	if(document.querySelector("#test-button").classList.contains('btn-danger')) document.querySelector("#test-button").classList.replace("btn-danger", "btn-info");
	if(document.querySelector("#test-button").classList.contains('btn-success')) document.querySelector("#test-button").classList.replace("btn-success", "btn-info");
	document.querySelector('#test-button').innerHTML = '<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Testing';
	document.querySelector('#test-button').setAttribute('disabled', '');

	front.send("testcreds", cred, document.querySelector("#pass-field").value);
}

//Add button
document.querySelector("#add-button").onclick = function(evt) {
	clearFields();
}

//Delete button
document.querySelector("#delete-button").onclick = function(evt) {
	let label = evt.target.getAttribute('clabel');
	console.log(label);

	current_creds.splice(getIndexByName(label), 1);
	/*for(const [index,cred] of current_creds.entries()) {
		if(cred.label === label) {
			current_creds.splice(index, 1);
		}
	}*/
	$('#del-modal').modal('hide')
	front.send("savecreds", current_creds);
	renderList();
}

//Pass button
document.querySelector("#pass-button").onclick = function(evt) {
	let label = evt.target.getAttribute('clabel');
	console.log("connect!: " + label);
	current_pass = document.querySelector('#check-pass-field').value;

	if(document.querySelector("#pass-button").classList.contains('btn-danger')) document.querySelector("#pass-button").classList.replace("btn-danger", "btn-primary");
	document.querySelector('#pass-button').innerHTML = '<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Connecting';
	document.querySelector('#pass-button').setAttribute('disabled', '');

	front.send("getclassifier", current_creds[current_index], current_pass);
}

function getIndexByName(label) {
	for(const [index,cred] of current_creds.entries()) {
		if(cred.label === label) {
			return index;
		}
	}
	return -1;
}

function captureFields() {
	return 	{
		label: document.querySelector("#label-field").value,
		host: document.querySelector("#host-field").value,
		port: document.querySelector("#port-field").value,
		path: document.querySelector("#path-field").value,
		username: document.querySelector("#user-field").value
		//password: document.querySelector("#pass-field").value //Don't save password
	}
}

function clearFields() {
	document.querySelector(".cred-input").value = "";
}

function setImage(image) {
	document.getElementById('current-image').src = URL.createObjectURL(new Blob([image], { type: 'image/jpg' }));
}

function addClassifyButtons(classifiers) {
	removeAllChildNodes(document.querySelector("#class-buttons"));
	let template = document.createElement('template');
	template.innerHTML 

	let buttons_html = "";
	for(const [index,classifier] of classifiers.entries()) {
		buttons_html += `<div classifyint="${index}" style="margin-left:${index/classifiers.length*100}%;" class="class-button">${classifier}</div>`
	}

	document.querySelector("#class-buttons").insertAdjacentHTML('afterbegin', buttons_html);

	//Click event for classification buttons
	document.querySelectorAll('.class-button').forEach(cbutton => {
		cbutton.onclick = function(evt) {
			console.log(evt.target);
			console.log("classify button");

			let classify_int = parseInt(evt.target.getAttribute("classifyint"));
			console.log("classify this image as: " + classify_int);
			ihandle.classifyImage(classify_int);
		}
	});
}

function addListItem(cred) {
	let template = document.createElement('template');
	template.innerHTML 
	
	let li_string = `
		<li class="list-group-item">
			<div class="container">
				<div class="row">
					<div class="col-7">${cred.label}</div>
					<div class="col-3">
						<div class="btn-group" role="group" aria-label="Basic outlined example">
							<button clabel="${cred.label}" type="button" class="play-open btn btn-outline-primary" data-toggle="modal" data-target="#pass-modal"><i  class="button-icon fas fa-play"></i></button>
							<button clabel="${cred.label}" type="button" class="edit-open btn btn-outline-primary" data-toggle="modal" data-target="#add-modal"><i   class="button-icon fas fa-edit"></i></button>
							<button clabel="${cred.label}" type="button" class="delete-open btn btn-outline-primary" data-toggle="modal" data-target="#del-modal"><i class="button-icon fas fa-trash"></i></button>
						</div>
					</div>
				</div>
			</div>
		</li>`;

	document.querySelector("#cred-list").insertAdjacentHTML('afterbegin', li_string);
	//console.log(template.content.childNodes);
	//document.querySelector("#cred_list").appendChild(template.content.childNodes);
}

function removeAllChildNodes(parent) {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
}