let Client = require('ssh2-sftp-client');
let sftp = new Client();
let current_creds;

const back = require('androidjs').back;

//////////////////////////////
// Crud Operations for SFTP training data

back.on("savecreds", async ()=>{

});

back.on("testcreds", async (creds)=>{
	result_message = (await getClassifyJson(creds) != null) ? "Success" : "Failure";
	back.send("toast", result_message);
});

back.on("getcredlist", async ()=>{
	back.send("list", [{label:"test1"},{label:"test2"},{label:"test3"}]);
});

back.on("getcreds", async (index)=>{
	//current_creds = credlist[index];
});

///////////////////////////
// Classifing API

back.on("put", async (data)=>{
	putFile(current_creds, data);
});

async function getClassifyJson(creds) {
	try {
		
		await sftp.connect(creds);
		const cjson = JSON.parse(await sftp.get(creds.path + '/classify.json'));
		await sftp.end();
	}

	catch {
		const cjson = null;
	}

	return cjson;
}

async function putFile(creds, data) {
	await sftp.connect(creds);
	await sftp.put(data, creds.path + '/' + creds.filename);
	await sftp.end();
}