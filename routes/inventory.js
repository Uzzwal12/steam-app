const express = require("express");
const { User } = require("../models/user");
const { syncInventory } = require("../controller/inventory");
const router = express.Router();

router.get("/", async (req, res) => {
	let queryValues = req.query.id;
	syncInventory(queryValues,function(err,result){
		if(err){
			console.log("error--->",err);
		} else{
			console.log("Data--->",result);
			res.json(result);
		}
	});
});

module.exports = router;
