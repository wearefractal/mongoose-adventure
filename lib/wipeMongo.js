
module.exports = function(conn){
  conn.db.dropDatabase();
  conn.db.executeDbCommand({dropDatabase:1});
};