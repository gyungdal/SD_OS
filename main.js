module.exports = {
	'init' : function(app, pool){
		init(app, pool);
	}
}

function init(app, pool){
	app.all('/main', function (req, res) {
		pool.getConnection(function(err, connection) {
			connection.query( ' select * from STUDENT ORDER BY BAD_SCORE DESC LIMIT 1', function(err, rows) {
				connection.release();
				var high_bad_score = `${rows[0].NAME}(${rows[0].NUM}) - ${rows[0].BAD_SCORE}점`;
						
				var fs = require('fs');
				fs.readFile('./count.txt', 'utf8', function(err, data) {
					var count = data;
					
					pool.getConnection(function(err, connection) {
						connection.query( 'select * from SONG group by SONG_NAME', function(err, rows) {
							connection.release();
							var songs = '';
							var temp = 0;
							for(var i = (rows.length > 3 ? rows.length - 3 : 0);i<rows.length;i++){
								songs = songs + `<p> ${temp}. ${rows[i].SONG_NAME}</p>`; 
								temp = temp + 1;
							}
							
							pool.getConnection(function(err, connection) {
								connection.query( 'select * from NOTICE', function(err, rows) {
									connection.release();
									var notices = '';
									for(var i = (rows.length > 3 ? rows.length - 3 : 0);i<rows.length;i++){
										notices = notices + `<p> ${i}. ${rows[i].TEXT}</p>`; 
									}
									
									pool.getConnection(function(err, connection) {
										connection.query( 'select * from LOST', function(err, rows) {
											connection.release();
											var losts = '';
											console.log(rows.length);
											for(var i = (rows.length > 3 ? rows.length - 3 : 0);i<rows.length;i++){
												console.log(i);
												losts = losts + `<p> ${rows[i].GET_NAME} - ${rows[i].GET_PLACE} 에서 습득, ${rows[i].STORE_PLACE}에서 보관중</p>`; 
											}
											var output = `
													<html>
												<head>
													<title>SD OS</title>
													<meta charset="utf-8">
													<meta name="viewport" content="width=device-width, initial-scale=1">
													<link href="http://fonts.googleapis.com/earlyaccess/nanumgothiccoding.css">
													<link rel="stylesheet" href="./css/materialize.min.css">
													<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.1/jquery.min.js"></script>
													<script type="text/javascript" src="./js/materialize.min.js"></script>
													<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
													<link rel="stylesheet" href="./css/main.css">
												</head>
												<body>
												<nav class="default" role="navigation">
													<div class="nav-wrapper">
														<a href="#!" class="brand-logo center">메인 페이지</a>
														<a href="#" data-activates="mobile-demo" class="button-collapse show-on-large"><i class="material-icons">menu</i></a>
														<ul class="right hide-on-med-and-down">
															<li><a href="#">Login</a></li>
															<li><a class="waves-effect red waves-light btn">Sign up</a></li>
														</ul>
														<ul class="side-nav" id="mobile-demo">
															<li><a href="./main">홈</a></li>
															<li><a href="./gogo.html">외출/현장체험학습 신청</a></li>
															<li><a href="./song.html">노래 신청</a></li>
															<li><a href="./lostFound.html">분실물 등록</a></li>
														</ul>
													</div>
													</nav>

													<div class="row">
														<div class="col s12 m6" id="point">
														<div class="card blue-grey darken-1">
															<div class="card-content white-text">
															<span class="card-title">학기 최대 벌점자</span>
															<p>${high_bad_score}</p>
															</div>
															<div class="card-action">
															<a href="./score">상세 페이지</a>
															</div>
														</div>
														</div>
														<div class="col s12 m6" id="song">
														<div class="card blue-grey darken-1">
															<div class="card-content white-text">
															<span class="card-title">내일의 노래</span>
															${songs}
															</div>
														</div>
														</div>
														<div class="col s12 m6" id="game">
														<div class="card blue-grey darken-1">
															<div class="card-content white-text">
															<span class="card-title">게임 경고 현황</span>
															<h3>${count}</h3>
															</div>
														</div>
														</div>
													</div>
													</div>

													<div class="row">
														<div id="text_box_1">
															<div class="container">
																<h4>기숙사 실시간 공지사항</h4>
																${notices}
															</div>
														</div>
														<div id="text_box_2">
															<div class="container">
																<h4>분실물 현황</h4>
																${losts}
															</div>
														</div>
													</div>
													<footer>
														
													</footer>
												</body>
												<script>
													$('.button-collapse').sideNav({
													  menuWidth: 300, // Default is 240
													  edge: 'left', // Choose the horizontal origin
													  closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
													});
												</script>
											</html>
											`;
											res.send(output);
										});
									});
								});
							});
						});
					});
				});
			});
		});
	});
}