let current_creds = [];

(async ()=> {
	//front.send("")
	removeAllChildNodes(document.querySelector("#cred_list"));
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
	removeAllChildNodes(document.querySelector("#cred_list"));
	for(let cred of current_creds) {
		console.log(cred);
		addListItem(cred);
	}
	////Add event handlers to buttons

	//Delete open buttons
	document.querySelectorAll('.delete_open').forEach(dbutton => {
		dbutton.onclick = function(evt) {
			let label = evt.target.getAttribute('clabel');
			document.querySelector("#delete_label").innerHTML = label;
			document.querySelector("#delete_button").setAttribute('clabel', label);
		}
	});

	//Edit open buttons
	document.querySelectorAll('.edit_open').forEach(ebutton => {
		ebutton.onclick = function(evt) {
			let label = evt.target.getAttribute('clabel');
			console.log(evt.target);
			console.log("edit button label: " + label);
			document.querySelector("#label_field").value = current_creds[getIndexByName(label)].label;
			document.querySelector("#host_field").value = current_creds[getIndexByName(label)].host;
			document.querySelector("#port_field").value = current_creds[getIndexByName(label)].port;
			document.querySelector("#path_field").value = current_creds[getIndexByName(label)].path;
			document.querySelector("#user_field").value = current_creds[getIndexByName(label)].username;
			document.querySelector("#pass_field").value = current_creds[getIndexByName(label)].password;
		}
	});
}

//Save button
document.querySelector("#save_button").onclick = function(evt){
	let cred = captureFields();
	addListItem(cred);
	current_creds.push(cred);
	clearFields();
	$('#add_modal').modal('hide')
	front.send("savecreds", current_creds);
}

//Test button
document.querySelector("#test_button").onclick = function(evt) {
	let creds = captureFields();
	console.log(creds);
	front.send("testcreds", creds);
}

//Delete button
document.querySelector("#delete_button").onclick = function(evt) {
	let label = evt.target.getAttribute('clabel');
	console.log(label);

	for(const [index,cred] of current_creds.entries()) {
		if(cred.label === label) {
			current_creds.splice(index, 1);
		}
	}
	$('#del_modal').modal('hide')
	front.send("savecreds", current_creds);
	renderList();
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
		label: document.querySelector("#label_field").value,
		host: document.querySelector("#host_field").value,
		port: document.querySelector("#port_field").value,
		path: document.querySelector("#path_field").value,
		username: document.querySelector("#user_field").value,
		password: document.querySelector("#pass_field").value
	}
}

function clearFields() {
	document.querySelector(".cred_input").value = "";
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
							<button type="button" class="play_open btn btn-outline-primary"><i clabel="${cred.label}" class="fas fa-play"></i></button>
							<button type="button" class="edit_open btn btn-outline-primary" data-toggle="modal" data-target="#add_modal"><i clabel="${cred.label}" class="fas fa-edit"></i></button>
							<button type="button" class="delete_open btn btn-outline-primary" data-toggle="modal" data-target="#del_modal"><i clabel="${cred.label}" class="fas fa-trash"></i></button>
						</div>
					</div>
				</div>
			</div>
		</li>`;

	document.querySelector("#cred_list").insertAdjacentHTML('afterbegin', li_string);
	//console.log(template.content.childNodes);
	//document.querySelector("#cred_list").appendChild(template.content.childNodes);
}

function removeAllChildNodes(parent) {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
}