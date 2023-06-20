// BIT Create item
"use strict";
const validateEvent = require("../../../helpers/functions/validateEvent");
const createItem = require("../../../helpers/functions/createItem");
const responses = require("../../../helpers/responses/responses.json");
const respond = require("../../../helpers/responses/respond");
const { ulid } = require("ulid");
module.exports = async (event, callback) => {
	try {
		// Validate
		const paramConditions = {
			moverId: ["S", 3, true],
		};
		let validated = await validateEvent(event, paramConditions, callback);
		if (!validated) {
			responses.validationError.responseData = paramConditions;
			respond(responses.validationError, callback);
			return;
		}
		// Create
		let ___Item = {
			pk:"",
			sk:"#",
			attribute:""
		}
		___Item = await createItem(___Item, false);
		// Respond
		let finalResponseData = ___Item;
		responses.apiSuccess.message = "____Item Created";
		responses.apiSuccess.responseData = finalResponseData;
		respond(responses.apiSuccess, callback);
		return;
	} catch (err) {
		// Error
		responses.lambdaError.message = `in function create___Item`;
		responses.lambdaError.responseData = err.stack;
		respond(responses.lambdaError, callback);
		return;
	}
};

//|---------------------------------------------------------------------------|


// BIT Delete item 
"use strict";
const deleteItem = require("../../../helpers/functions/deleteItem");

module.exports = async (event, callback) => {
	try {
		// Validate
		const paramConditions = {
			moverId: ["S", 2, true],
			itemSk: ["S", 2, true]
		};
		let validated = await validateEvent(event, paramConditions, callback);
		if (!validated) {
			responses.validationError.responseData = paramConditions;
			respond(responses.validationError, callback);
			return;
		}
		
		let queryParams = {
			pk: "",
			sk: event.___ItemSk,
		};
		
		let ___ItemData = await deleteItem(queryParams);
		if (!___ItemData.status) {
			responses.custom.message = "___ item not found.";
			responses.custom.responseData = ___ItemData.error;
			respond(responses.custom, callback);
			return;
		}
		
		responses.apiSuccess.message = "___Item deleted from DB.";
		responses.apiSuccess.responseData = ___ItemData;
		respond(responses.apiSuccess, callback);
		return;
	} catch (err) {
		responses.lambdaError.message = `in function delete___Item`;
		responses.lambdaError.responseData = err.stack;
		respond(responses.lambdaError, callback);
		return;
	}
};

//|---------------------------------------------------------------------------|
// BIT Update item


//|---------------------------------------------------------------------------|
// BIT Get item 
const getItem = require("../../../helpers/functions/getItem");

module.exports = async (event, callback) => {
	try {
		// Validate
		const paramConditions = {
			moverId: ["S", 3, false],
		};
		let validated = await validateEvent(event, paramConditions, callback);
		if (!validated) {
			responses.validationError.responseData = paramConditions;
			respond(responses.validationError, callback);
			return;
		}
		// List
		let queryParams = {
			pk: "",
			sk: "",
		};
		let ___Item = await getItem(queryParams);
		// Respond
		responses.apiSuccess.message = "___ fetched";
		responses.apiSuccess.responseData = ___Item.data;
		respond(responses.apiSuccess, callback);
		return;
	} catch (err) {
		// Error
		responses.lambdaError.message = `in function get___Item`;
		responses.lambdaError.responseData = err.stack;
		respond(responses.lambdaError, callback);
		return;
	}
};

//|---------------------------------------------------------------------------|
// BIT List items
//Imports
const listItems = require("../../../helpers/functions/listItems");

module.exports = async (event, callback) => {
	try {
		// Validate
		const paramConditions = {
			moverId: ["S", 3, false],
		};
		let validated = await validateEvent(event, paramConditions, callback);
		if (!validated) {
			responses.validationError.responseData = paramConditions;
			respond(responses.validationError, callback);
			return;
		}
		// List
		let queryParams = {
			pk: "",
			skBeginsWith: "",
			byLatestOrder: true,
			limit: event.limit,
			lastKeySeen: event.lastKeySeen,
		};
		let ___Items = await listItems(queryParams);
		// Respond
		responses.apiSuccess.message = "___ fetched";
		responses.apiSuccess.responseData = ___Items.data;
		respond(responses.apiSuccess, callback);
		return;
	} catch (err) {
		// Error
		responses.lambdaError.message = `in function list___Item`;
		responses.lambdaError.responseData = err.stack;
		respond(responses.lambdaError, callback);
		return;
	}
};


//|---------------------------------------------------------------------------|