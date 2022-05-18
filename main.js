const fs = require('fs');
let Client = require('ssh2-sftp-client');
let sftp = new Client();

let current_cred, save_path, password;

const back = require('androidjs').back;

//////////////////////////////
// Crud Operations for SFTP training data

back.on("loadcreds", async (path) => {
	save_path = path;
	back.send("console", "Save path is: " + save_path);

	fs.readFile(path + '/databases.json', 'utf8', (err, data) => {

		if (err) {
			back.send("console", err);
		} else {
			const creds = JSON.parse(data);
	
			back.send("list", creds);
		}
	});
});

back.on("savecreds", async (creds)=>{
	const data = JSON.stringify(creds);

	// write file to disk
	fs.writeFile(save_path + '/databases.json', data, 'utf8', (err) => {
	
		if (err) {
			back.send("console", err);
		} else {
			back.send("writesuccess");
		}
	
	});
});

back.on("testcreds", async (cred)=>{
	rjson = await getClassifyJson(cred);
	back.send("toast", rjson.hasOwnProperty('classifiers') ? "Success" : "Failure");
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