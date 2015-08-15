module.exports = function() {
	return {
		"id": 0, //Primary key
		"name": "", //Enforce unique
		"password": "",
		"api_keys": "" //Formatted key;key;key
	};
};

//SQLITE STATEMENT
//CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT UNIQUE NOT NULL, password TEXT, api_keys TEXT)