"use strict"

var request = require('request');
var cheerio = require('cheerio');
var RSS = require('rss');

var digi="http://www.ourradio.hk/index.php/radio-program/tech/digi";
var mystery="http://www.ourradio.hk/index.php/radio-program/newage/mystery";
var hk="http://www.hkpeanut.com/archives/19043";
var mysteryBackup="http://m1.hkpeanut.com/life/nosurprise?show=all";
var hkpug="http://www.hkpug.org/podcast/feed/podcast/";
var randgad="http://download.randgad.com/feed.xml";
var ourradioUrl="http://www.ourradio.hk";
var mikeleefile="http://www.openskyarchive.com/podcastfeed.php?show_id=38";
var cmm="http://feeds.feedburner.com/cmmp14";
var warrior="http://www.ourradio.hk/index.php/radio-program/talk/warrior";

exports.handler=function(event,context,cb){
	var digi="http://www.ourradio.hk/index.php/radio-program/tech/digi";
    var mystery="http://www.ourradio.hk/index.php/radio-program/newage/mystery";
    if(event.code=="mystery"){
      var url=mystery;
      var cat="mystery";
      var desc="mystery";
      var title="無奇不有";
      var img="https://scontent-hkg3-1.xx.fbcdn.net/v/t1.0-1/p200x200/10353716_720428991363725_2869408499533067513_n.jpg?oh=0833fe19516f2438f8286ac229543b41&oe=591546F5";
    }else if (event.code=="digi") {
      var url=digi;
      var cat="Technology";
      var desc="數碼生活頻道";
      var title="數碼生活頻道";
      var img="https://pbs.twimg.com/profile_images/768772073787228160/o8FxLsPs_400x400.jpg";
    }else{
      context.error("error",null);
    }

    var feed = new RSS({
        title: title,
        description: title,
        feed_url: url,
        site_url: url,
        image_url:img,
        categories: [cat],
        pubDate: 'May 20, 2012 04:00:00 GMT',
        ttl: '60'
    });

    request(url,function (err,response,html) {
      console.log(url);
        var $ = cheerio.load(html, {
            normalizeWhitespace: true,
            xmlMode: true
        });
        var items=[];
        var a=0;
        var now;
        var rss;




        do{
            now='.leading-'+a;
            $(now).filter(function(){
                var data = $(this);
                data.find('p').find('a').each(function(i,elem){
                    var enc={file:"",url:""};
                    var json = {title:"",description:"",url:"",enclosure:enc,rating:""};
                    if(!$(this).parent().hasClass("readmore")){
                        var no=i+1;
                        json.title=data.find('h2').text()+" part "+no;
                        json.description=data.find('p').text();
                        //enc.file=ourradioUrl+$(this).attr('href');
                        enc.url=ourradioUrl+$(this).attr('href');
                        feed.item(json);
                    }
                });
            });
            a++;
        }while(a<=6){
            var xml = feed.xml();
            //writerss(rssfile,xml);
            cb(null,xml);
            //console.log("RSS Feed updated");
        }

    });
}
