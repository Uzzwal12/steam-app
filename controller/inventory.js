const request = require("request");
const { User } = require("../models/user");

const { Inventory } = require("../models/inventory");

const syncInventory = async (req, res) => {
  try {
    let findQuery = {
      username: req.query.id,
    };

    let projectionQuery = {
      username: 1,
      steamId: 1,
      id: 0,
    };

    User.findOne(findQuery, projectionQuery)
      .lean()
      .exec(async function (err, result) {
        if (err) return res.status(400).send("Error in finding function", err);
        else {
          let url =
            "https://steamcommunity.com/profiles/" +
            result.steamId +
            "/inventory/json/730/2";
          const response = await request({ url, json: true });
          console.log("Checking status", response.status);
          if (status == "200") {
            const inventoryData = response.data;
            let idsArray = await getClassIds(inventoryData.rgInventory);
            let finalObject = inventoryData.rgDescriptions;
            let invItems = getInvItems(idsArray, finalObject);

            let findUser = {
              username: req.query.id,
            };

            let inventory = {
              username: req.query.id,
              steamId: result.steamId,
              items: invItems,
            };

            let options = {
              upsert: true,
              new: true,
              setDefaultOnInsert: true,
            };
            Inventory.findOneAndUpdate(findUser, inventory, options).exec(
              function (err, result) {
                if (err)
                  return res.status(400).send("Error in saving function");
                else {
                  res.send("Inventory synced successfully");
                }
              }
            );
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
              name: value.name,
              hashName: value.market_hash_name,
              count: idsArray[i].count,
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
