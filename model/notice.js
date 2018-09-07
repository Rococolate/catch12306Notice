const Sequelize = require('sequelize');
const {database,username,password,host,port} = require('../_s/index.js');

var sequelize = new Sequelize(database, username, password, {
  host: host,
  port:port,
  dialect: 'mysql',
  pool: {
      max: 5,
      min: 0,
      idle: 30000
  },
  timestamps: false
  //最好关掉timestamps , 框架自动帮你添加时间到UpdatedAt上边
});

sequelize
  .authenticate()
  .then(() => {
      console.log('Connection has been established successfully.');
  })
  .catch(err => {
      console.error('Unable to connect to the database:', err);
  });

const NOTICE = sequelize.define('notice',{
  uid:{
    type:Sequelize.STRING(256),
    primaryKey: true
  },
  text:Sequelize.TEXT,
  url:Sequelize.STRING(256),
},{
  freezeTableName:true
})


async function findAll(query){
  const res = await NOTICE.findAll(query);
  return res;
}

async function create(data){
  const res = await NOTICE.create(data);
  return res;
}

async function destroy(queryRes){
  const res1 = await Promise.all(queryRes.map((item) => {
    return item.destroy();
  }));
  return res1;
}

async function save(queryRes,updateDate){
  const res1 = await Promise.all(queryRes.map((item) =>{
    for(let name in updateDate){
      item[name] = updateDate[name];
    }
    return item.save();
  }));
  return res1;
}


module.exports = {NOTICE,findAll,create,destroy,save};


