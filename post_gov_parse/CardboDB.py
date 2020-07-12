import pymongo
from bson.objectid import ObjectId

class CardboDB:
    def __init__(self, api_key, database):
        self.client = pymongo.MongoClient(api_key)
        self.db = self.client[database]

    def insertData(self, collection, content):
        collect = self.db[collection]
        result = collect.insert_one(content)
        return result.inserted_id

    def getData(self, collection, filter={}):
        collect = self.db[collection]
        return [d for d in collect.find(filter)]

    def getDataById(self, collection, id):
        collect = self.db[collection]
        return [data for data in collect.find({'_id': ObjectId(id)})]

    def updateMany(self, collection, filter, content, upsert=False):
        collect = self.db[collection]
        result = collect.update_many(filter, {'$set': content}, upsert=upsert)
        return result.modified_count

    def updateOne(self, collection, filter, content, upsert=False):
        collect = self.db[collection]
        result = collect.update_one(filter, {'$set': content}, upsert=upsert)
        return result.modified_count

    def updateOneById(self, collection, id, content, upsert=False):
        collect = self.db[collection]
        result = collect.update_one({'_id': ObjectId(id)}, {'$set': content}, upsert=upsert)
        return result.modified_count

    def replaceOne(self, collection, filter, content, upsert=False):
        collect = self.db[collection]
        result = collect.replace_one(filter, content, upsert=upsert)
        return result.modified_count

    def replaceOneById(self, collection, id, content, upsert=False):
        collect = self.db[collection]
        result = collect.replace_one({'_id': ObjectId(id)}, content, upsert=upsert)
        return result.modified_count

    def deleteMany(self, collection, filter={}):
        collect = self.db[collection]
        result = collect.delete_many(filter)
        return result.deleted_count

    def deleteOne(self, collection, filter={}):
        collect = self.db[collection]
        result = collect.delete_one(filter)
        return result.deleted_count

    def deleteOneById(self, collection, id):
        collect = self.db[collection]
        result = collect.delete_one({'_id': ObjectId(id)})
        return result.deleted_count


if __name__ == "__main__":
    db = CardboDB(
        "mongodb+srv://cardbo:69541@cardbo-br3ga.gcp.mongodb.net/dbCardbo?retryWrites=true&w=majority", "dbCardbo")

    # insert one data => insertData(<collection>, <data_content>)  return _id
    inserted_data_id = db.insertData("test", {'test': 1, "haha": "haha"})
    print("inserted data id: ", inserted_data_id)

    db.insertData("test", {'test': 2, "haha": "haha"})
    db.insertData("test", {'test': 3, "haha": "haha"})
    db.insertData("test", {'test': 4, "haha": "haha"})

    # get all data from db => getData => getData(<collection>) return data
    data = db.getData("test")
    print("get all data: ", data)

    # get data by filter and return data _id => getData(<collection>, [filter]) return data
    data = db.getData("test", {'test': 1})
    print("get data by filter: ", data)

    # find and update all data found by filter => updateMany(<collection>, [filter], [content]) return non zero if success
    re = db.updateMany("test", {'test': 1}, {"x": 3}, upsert=False)
    data = db.getData("test")
    print("updateMany result", re, "\nupdateMany data: ",  data)

    # find and update one data by filter => updateOne(<collection>, [filter], [content]) return 1 if success.  (if found many, the first one will be updated )
    re = db.updateOne("test", {'test': 1}, {"x": 4}, upsert=False)
    data = db.getData("test")
    print("updateOne result", re, "\nupdateOne data: ",  data)

    # find and update one data by id => updateOneById(<collection>, <id>, [content]) return 1 if success
    re = db.updateOneById("test", inserted_data_id, {"x": 5}, upsert=False)
    data = db.getData("test")
    print("updateOneById result", re, "\nupdateOneById data: ",  data)

    # find and replace one data by filter => replaceOne(<collection>, [filter], [content]) return 1 if success
    re = db.replaceOne("test", {'test': 1}, {"xxx": 666}, upsert=False)
    data = db.getData("test")
    print("replaceOne result", re, "\nreplaceOne data: ",  data)

    # find and replace one data by id => replaceOneById(<collection>, <id>, [content]) return 1 if success
    re = db.replaceOneById("test", inserted_data_id, {"xxx": 777}, upsert=False)
    data = db.getData("test")
    print("replaceOneById result", re, "\nreplaceOneById data: ",  data)

    # find and delete one data by filter => deleteOne(<collection>, [filter]) return 1 if success. (if found many, the first one will be deleted )
    re = db.deleteOne("test", {'test': 2})
    data = db.getData("test")
    print("deleteOne result", re, "\ndeleteOne data: ",  data)

    # find and delete one data by id => deleteOneById(<collection>, <id>) return 1 if success
    re = db.deleteOneById("test", inserted_data_id)
    data = db.getData("test")
    print("deleteOneById result", re, "\ndeleteOneById data: ",  data)

    # find and delete all data found by filter => deleteMany(<collection>, [filter]) return non zero if success
    re = db.deleteMany("test")
    data = db.getData("test")
    print("deleteMany result", re, "\ndeleteMany data: ",  data)