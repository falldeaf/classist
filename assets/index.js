(async ()=> {
	front.send("")
})();


front.send("");

front.on("list", function(creds){

	removeAllChildNodes(document.querySelector("#cred_list"));
	for(let cred in creds) {
		addListItem(cred);
	}
	//Add event handlers to buttons
});

function addListItem(cred) {
	let template = document.createElement('template');
	template.innerHTML = `
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
	document.querySelector("#cred_list").appendChild(template.content.cloneNode);
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}