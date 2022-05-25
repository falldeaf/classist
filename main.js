const fs = require('fs');
let Client = require('ssh2-sftp-client');
let sftp = new Client();
const jpeg = require('jpeg-js');

let current_cred, save_path, password;

const back = require('androidjs').back;

//////////////////////////////
// Crud Operations for SFTP training data

back.on("loadcreds", async (path) => {
	save_path = path;

	fs.readFile(path + '/databases.json', 'utf8', (err, data) => {

		if (err) {
			back.send("console", err);
		} else {
			const creds = JSON.parse(data);
	
			back.send("rendercreds", creds);
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

back.on("savejson", async (json, file)=>{
	try {
		await sftp.put(Buffer.from(json, 'utf8'), current_cred.path + '/' + file);
	} catch (err) {
		back.send("console", err.message);
	}
});

back.on("list", async (cred, pass)=>{
	cred.password = pass;

	await sftp.connect(cred);
	back.send("storelist", await sftp.list(cred.path));
});

back.on("getclassifier", (cred, pass)=>{
	getClassifyJson(cred, pass, "classifierresult");
});

back.on("testcreds", (cred, pass)=>{
	getClassifyJson(cred, pass, "testresult");
});

///////////////////////////
// Classifing API

back.on("getimage", async(file, loadname, load)=>{
	back.send("console", file);

	try {
		let image = await sftp.get(current_cred.path + "/" + file);
		back.send("console", image);
		back.send("receiveimage", image, loadname, load);
	} catch (err) {
		back.send("console", err.message);
	}
});

async function getClassifyJson(cred, pass, return_channel) {
	try {
		cred.password = pass;
		await sftp.connect(cred);
		const cjson = await JSON.parse(await sftp.get(cred.path + '/classifiers.json'));
		back.send(return_channel, cjson);
		if(return_channel === "classifierresult") current_cred = cred;
		back.send("console", cjson);
		await sftp.end();
	}

	catch (err) {
		//back.send("toast", "Can't connect");
		back.send(return_channel, {});
		back.send("console", err.message);
		await sftp.end();
	}
}