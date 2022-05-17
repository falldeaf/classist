const fs = require('fs');
let Client = require('ssh2-sftp-client');
let sftp = new Client();
let current_creds;

const back = require('androidjs').back;

//////////////////////////////
// Crud Operations for SFTP training data

back.on("loadcreds", async (path) => {
	fs.readFile(path + '/databases.json', 'utf8', (err, data) => {

		if (err) {
			back.send("console", err);
		} else {
			const creds = JSON.parse(data);
	
			back.send("list", creds);
		}
	});
});

back.on("savecreds", async (data)=>{
	const data = JSON.stringify(data.cred);

	// write file to disk
	fs.writeFile(data.path + '/databases.json', data, 'utf8', (err) => {
	
		if (err) {
			back.send("console", err);
		} else {
			back.send("writesuccess");
		}
	
	});
});

back.on("testcreds", async (creds)=>{
	rjson = await getClassifyJson(creds);
	back.send("toast", rjson.hasOwnProperty('classifiers') ? "Success" : "Failure");
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
		const cjson = await JSON.parse(await sftp.get(creds.path + '/classifiers.json'));
		back.send("console", cjson);
		await sftp.end();
	}

	catch (err) {
		await sftp.end();
		back.send("toast", "Failure");
		back.send("console", err.message);
	}

	return cjson;
}

async function putFile(creds, data) {
	await sftp.connect(creds);
	await sftp.put(data, creds.path + '/' + creds.filename);
	await sftp.end();
}