var express = require('express');
var app = express();
var request = require('request');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var utf8 = require('utf8');

//app.use(bodyParser.json());

var pool  = mysql.createPool({
	host     : 'localhost',
	port     : 3306, 
	user     : 'root',
	password : require('./config').password,
	database : 'SW_CAMP'
});

app.use(express.static('static'));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

app.all('/', function (req, res) {
    console.log(req.path);
    res.send("Hello World!");

});

//TODO : 로그 저장 필요

//getTeacher 과 같은 함수
app.all('/tt', function (req, res) {

	pool.getConnection(function(err, connection) {
	  // Use the connection 
	  connection.query('SELECT something FROM sometable', function (error, results, fields) {
		// And done with the connection. 
		connection.release();
	 
		// Handle error after the release. 
		if (error) throw error;
	 
		// Don't use the connection here, it has been returned to the pool. 
	  });
	});
    console.log(req.path);
    var id = req.body.ID;
    var pw = req.body.PW;
	var sql = 'SELECT TEACHER_DATA.TEACHER_UUID TEACHER_UUID, TEACHER_DATA.TEACHER_NAME TEACHER_NAME, ' 
	+ 'PERMISSION_DATA.STUDENT_MANAGE STUDENT_MANAGE, PERMISSION_DATA.SCORE_MANAGE SCORE_MANAGE FROM TEACHER_DATA JOIN PERMISSION_DATA ON PERMISSION_DATA.PERMISSION_TYPE = TEACHER_DATA.PERMISSION_TYPE WHERE TEACHER_DATA.ID = '
	+ mysql.escape(id) + ' AND TEACHER_DATA.PW = ' + mysql.escape(pw);
    res.header("Content-Type", "application/json; charset=utf-8");
	console.log(sql);
    var query = connection.query(sql, function (err, rows) {
        if (err) {
			saveLog(rows[0].TEACHER_UUID, req.path, sql, 0);
            throw err;
        }
        res.json(rows[0]);
		if(rows[0] != null)
			saveLog(rows[0].TEACHER_UUID, req.path, sql, 1);
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