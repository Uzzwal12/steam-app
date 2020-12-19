const { User } = require("../models/user");
const { Inventory } = require("../models/inventory");
const { response } = require("express");
axios = require("axios");

const syncInventory = async(queryValues, callback) => {
    try {
        let findQuery = {
            username: queryValues,
        };

        let projectionQuery = {
            username: 1,
            steamId: 1,
            _id: 0,
        };

        User.findOne(findQuery, projectionQuery).lean().exec(async function(err, result) {
            if (err) {
                console.log("Error in finding function", err);
                callback(err)
            } else {
                let url =
                    "https://steamcommunity.com/profiles/" + result.steamId + "/inventory/json/730/2";
                const response = await axios.get(url);

                console.log("Checking status", response.status);
                if (response.status == "200") {
                    const inventoryData = response.data;
                    let idsArray = await getClassIds(inventoryData.rgInventory);
                    let finalObject = inventoryData.rgDescriptions;
                    let invItems = await getInvItems(idsArray, finalObject);

                    let findUser = {
                        username: queryValues,
                    };

                    let inventory = {
                        username: queryValues,
                        steamId: result.steamId,
                        items: invItems,
                    };

                    let options = {
                        upsert: true,
                        new: true,
                        setDefaultOnInsert: true,
                    };
                    Inventory.findOneAndUpdate(findUser, inventory, options).exec(
                        function(err, result) {
                            if (err) {
                              console.log("Error in saving function");
                              callback(err)
                            }
                            else {
                                console.log("Inventory synced successfully--->", result);
                                callback(null, result);
                            }
                        });
                }
            }
        });
    } catch (err) {
        console.log(`Error in syncInventory--->`, err);
    }
};

function getClassIds(data) {
    let idsArray = [];
    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            value = data[key];
            let classId = value.classId;
            let flag = 0;
            for (let i = 0; i < idsArray.length; i++) {
                if (classId == idsArray[i].id) {
                    idsArray[i].count++;
                    flag = 1;
                }
            }
            if (flag == 0) {
                let tempObj = {
                    id: classId,
                    count: 1,
                };
                idsArray.push(tempObj);
            }
        }
    }
    return idsArray;
}

function getInvItems(idsArray, finalObject) {
    let invArray = [];
    for (let key in finalObject) {
        if (finalObject.hasOwnProperty(key)) {
            value = finalObject[key];
            if (value.marketable) {
                for (let i = 0; i < idsArray.length; i++) {
                    if (idsArray[i].id == value.classId) {
                        let tempObj = {
                            Name: value.market_hash_name,
                        };
                        invArray.push(tempObj);
                    }
                }
            }
        }
    }
    return invArray;
}

module.exports = {
    syncInventory,

};