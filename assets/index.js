let current_creds = [];
let current_index = -1;

(async ()=> {
	removeAllChildNodes(document.querySelector("#cred-list"));
	front.send("loadcreds", app.getPath('userData'));
	//for(let i = 0; i <=10; i++) addListItem({label: i});
})();

front.on("list", function(creds){
	current_creds = creds;
	renderList();
});

front.on("toast", function(message){
	app.toast.show(message, 0);
});

front.on("console", function(message){
	console.log(message);
})

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
	addListItem(cred);
	current_creds.push(cred);
	clearFields();
	$('#add-modal').modal('hide');
	front.send("savecreds", current_creds);
}

//Test button
document.querySelector("#test-button").onclick = function(evt) {
	let creds = captureFields();
	console.log(creds);
	front.send("testcreds", creds);
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

	$('#pass-modal').modal('hide');
	$('#play-modal').modal('show');
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
		username: document.querySelector("#user-field").value,
		password: document.querySelector("#pass-field").value
	}
}

function clearFields() {
	document.querySelector(".cred-input").value = "";
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