var express = require('express');
var app = express();
var request = require('request');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var utf8 = require('utf8');
var multer = require('multer'); // express에 multer모듈 적용 (for 파일업로드)
var upload = multer({ dest: 'photo/' })
var upload = multer({ dest: 'document/' })


//	app.use(express.bodyParser());

var pool  = mysql.createPool({
	host     : 'localhost',
	port     : 3306, 
	user     : 'root',
	password : require('./config').password,
	database : 'camp'
});

require('./main.js').init(app, pool);
require('./adminPage.js').init(app, pool);

app.use('/photo', express.static('photo'));
app.use('/document', express.static('document'));
app.use('/', express.static('static'));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

//탈출
app.post('/upload/gogo', upload.single('file'), function(req, res){
	console.log(req.body.reason);
	console.log(req.body.place);
	console.log(req.body.name);
	console.log(req.body.start_date);
	console.log(req.body.end_date);
	console.log(req.file.path);
	res.send('<script>history.go(-2);</script>');
	pool.getConnection(function(err, connection) {
		connection.query( 'INSERT INTO GOGO(NAME, GO_DATE, END_DATE, PLACE, REASON, FILE_URL) VALUES('
		+ mysql.escape(req.body.name) + ', ' 
		+ mysql.escape(req.body.start_date) + ', ' 
		+ mysql.escape(req.body.end_date) + ', ' 
		+ mysql.escape(req.body.place) + ', ' 
		+ mysql.escape(req.body.reason) + ', ' 
		+ mysql.escape(req.file.path) + ')' , function(err, rows) {
			connection.release();
		});
	});
});

//게임 경고 현황 설정
app.post('/set/pc_count', function(req, res){
	console.log(req.body.count);
	res.send('<script>history.go(-2);</script>');
	var fs = require('fs');
	fs.writeFile('./count.txt', req.body.count, function(err) {
		if(err) throw err;
		console.log('File write completed');
	});
});

//잃어버린 목록
app.post('/upload/lost', upload.single('file'), function(req, res){
	console.log(req.body.name);
	console.log(req.body.thing_name);
	console.log(req.body.get_place);
	console.log(req.body.store_place);
	console.log(req.body.date);
	console.log(req.file.path);
	res.send('<script>history.go(-2);</script>');
	var sql = 'INSERT INTO LOST(NAME, GET_NAME, GET_DATE, GET_PLACE, STORE_PLACE, PHOTO_URL) VALUES ('
			+ mysql.escape(req.body.name) + ', ' + mysql.escape(req.body.thing_name) + ', '
			+ mysql.escape(req.body.date) + ', ' + mysql.escape(req.body.get_place) + ', ' 
			+ mysql.escape(req.body.store_place) + ', '	+ mysql.escape(req.file.path) + ')';
			
	console.log(sql);
	pool.getConnection(function(err, connection) {
		connection.query(sql, function(err, rows) {
			connection.release();

		});
	});
});

//노래 신청
app.post('/request/song', upload.single('file'), function(req, res){
	console.log(req.body.name);
	console.log(req.body.song_title);
	console.log(req.body.date);
	res.send('<script>history.go(-2);</script>');
	pool.getConnection(function(err, connection) {
		connection.query( 'INSERT INTO SONG(SONG_NAME, PLAY_DATE) VALUES(' +
			mysql.escape(req.body.song_title) + ', ' + 
			mysql.escape(req.body.date) + ')', function(err, rows) {
			connection.release();

		});
	});
});


app.get('/dynamic', function(req, res){
  var lis = '';
  for(var i = 0; i <5; i++){
      lis += '<li>coding ' + i + '</li>';
  }
  // 자바스크립트 새로운 표준 formatted text 기능
  // ` `(grave accent) 사용을 통해서 JS에서 여려줄의 코드를 넣을 수 없는 문제를 해결
  var output =
  `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
    </head>
    <body>
      hello Dynamic html~~!
          <ul>
              ${lis} <!--문자열 내에서 변수 사용-->
          </ul>
    </body>
  </html>`;
  res.send(output);
});
