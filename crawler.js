const request = require('request');
const cheerio = require('cheerio');
const {NOTICE,findAll,create,destroy,save} = require('./model/notice.js');

const URL = 'http://www.12306.cn/mormhweb/zxdt/index_zxdt.html';


requestUrl(URL)
  .then((body)=>filterChapters(body))
  .then($=>analyseHtml($))
  .catch(error=>console.log(error));

function requestUrl(url){
  return new Promise((resolve,reject)=>{
    request(url,(error,response,body)=>{
      if (error) return reject(error);
      if (response.statusCode !== 200) return reject(response.statusCode);
      return resolve(response.body);
    })
  })
}

function filterChapters (html) {
  const $ = cheerio.load(html);
  return Promise.resolve($);
}

function analyseHtml($){
  const notices = Array.from($('#newList > ul > li a')).map(item => {
    return {
      title:item.attribs.title,
      href:fixedUrl(item.attribs.href),
    }
  });
  notices.forEach(async (notice) => {
    const {title,href} = notice;
    const res = await findAll({where:{text:title}});
    if (res.length === 0) {
      const res1 = await create({
        text:title,
        url:href,
        uid:Date.now() + '_' + parseInt(Math.random()*100000),
      });
      sendMsg(title,href);
    }
  })
}

function sendMsg(title,href){
  // todo
}

function fixedUrl(href){
  const l = URL.replace('.html','/');
  const r = href.replace('./','');
  return l + r;
}

