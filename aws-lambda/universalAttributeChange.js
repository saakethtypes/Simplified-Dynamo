"use strict";
// SEC Get User
//Imports
const listItems = require("./listItems");
const updateItem = require("./updateItem");

module.exports = async (event, callback) => {
		// BIT Params check
		let users = await listItems({
			pk: "username",
			skBeginsWith: null,
		});
		users.data.forEach(async(user) => {
			await updateItem({},callback)
		});
		
}