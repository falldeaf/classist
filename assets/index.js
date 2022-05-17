(async ()=> {
	//front.send("")
	removeAllChildNodes(document.querySelector("#cred_list"));
	//for(let i = 0; i <=10; i++) addListItem({label: i});
	front.send("getcredlist");
})();

front.on("list", function(creds){

	removeAllChildNodes(document.querySelector("#cred_list"));
	for(let cred of creds) {
		console.log(cred);
		addListItem(cred);
	}
	//Add event handlers to buttons
});

front.on("toast", function(message){
	app.toast.show(message, 0);
});

front.on("console", function(message){
	console.log(message);
})

//Test button
document.querySelector("#test_button").onclick = function(evt) {
	let creds = {
		label: document.querySelector("#label_field").value,
		host: document.querySelector("#host_field").value,
		port: document.querySelector("#port_field").value,
		path: document.querySelector("#path_field").value,
		username: document.querySelector("#user_field").value,
		password: document.querySelector("#pass_field").value
	}
	console.log(creds);
	front.send("testcreds", creds);
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
							<button type="button" class="btn btn-outline-primary"><i class="fas fa-play"></i></button>
							<button type="button" class="btn btn-outline-primary" data-toggle="modal" data-target="#add_modal"><i class="fas fa-edit"></i></button>
							<button type="button" class="btn btn-outline-primary" data-toggle="modal" data-target="#del_modal"><i class="fas fa-trash"></i></button>
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