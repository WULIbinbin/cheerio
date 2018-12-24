const superagent = require('superagent');

const cheerio = require('cheerio');

const fs = require('fs');

const express = require('express');

const app = express();

const path = require('path');

const url = 'https://www.vvic.com/gz/list/index.html?pid=1&vcid=20000106&merge=1';

app.use(express.static(path.join(__dirname, '../www')));

app.get('/getData',(req,res)=>{
	superagent.get(url).end((serr,sres)=>{
		if(serr){
			console.log(serr);
      return
		}
		let $ = cheerio.load(sres.text);
		//console.log($.html());
		try{
			var goods = [];
			$('.goods-list ul li .item').each((i,val)=> {
				var item = $(val);
				var ite = {};
				var name = item.find('.desc').find('.title').children().text();
				var img = item.find('.pic').find('img').attr('src');
				if(img==undefined){
					img = item.find('.pic').find('img').attr('data-original');
					ite = {'img':'http:'+img,'name':name};
				}else if(name==""||name==undefined){
					ite = {};
				}else{
					ite = {'img':'http:'+img,'name':name};
				}
				if(ite.img!=undefined||ite.name!=undefined){
          goods.push(ite);
				}
				
			});
			res.send(goods);
		}catch(e){
      console.log(e);
		}
	});
}).listen(3001,()=>{
  console.log('port 3001 is running')
});

