module.exports = {
	'init' : function(app, pool){
		init(app, pool);
	}
}

function init(app, pool){
	app.all('/score', function (req, res) {
		pool.getConnection(function(err, connection) {
			connection.query( 'select * from STUDENT where LEFT(NUM, 1) = 1', function(err, rows) {
				connection.release();
				var one = '';
				var two = '';
				var third = '';
					rows.forEach(function(value){
						one = one + '<tr>';
						one = one + '<th>' + value.NUM + '</th>';
						one = one + '<th>' + value.NAME + '</th>';
						one = one + '<th>' + value.BAD_SCORE + '</th>';
						one = one + '</tr>';
					});
					pool.getConnection(function(err, connection) {
						connection.query( 'select * from STUDENT where LEFT(NUM, 1) = 2', function(err, rows) {
							connection.release();
							
							rows.forEach(function(value){
								two = two + '<tr>';
								two = two + '<th>' + value.NUM + '</th>';
								two = two + '<th>' + value.NAME + '</th>';
								two = two + '<th>' + value.BAD_SCORE + '</th>';
								two = two + '</tr>';
							});
							pool.getConnection(function(err, connection) {
								connection.query( 'select * from STUDENT where LEFT(NUM, 1) = 3', function(err, rows) {
									connection.release();
									rows.forEach(function(value){
										third = third + '<tr>';
										third = third + '<th>' + value.NUM + '</th>';
										third = third + '<th>' + value.NAME + '</th>';
										third = third + '<th>' + value.BAD_SCORE + '</th>';
										third = third + '</tr>';
									});
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
        <title>벌점 상세 보기</title>
        <meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="http://fonts.googleapis.com/earlyaccess/nanumgothiccoding.css">
        <link rel="stylesheet" href="./css/materialize.css">
		<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.1/jquery.min.js"></script>
        <script type="text/javascript" src="./js/materialize.js"></script>
		<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
	</head>
	<body>
	<nav class="default" role="navigation">
		<div class="nav-wrapper" style="background-color:#191919;">
			<a href="#!" class="brand-logo center">벌점 리스트</a>
			<a href="#" data-activates="mobile-demo" class="button-collapse show-on-large"><i class="material-icons">menu</i></a>
			<ul class="right hide-on-med-and-down">
				<li><a href="#">Login</a></li>
				<li><a class="waves-effect red waves-light btn">Sign up</a></li>
			</ul>
			<ul class="side-nav" id="mobile-demo">
				<li><a href="./main">홈</a></li>
				<li><a href="./main">외출/현장체험학습 신청</a></li>
				<li><a href="./main">노래 신청</a></li>
				<li><a href="./main">분실물 등록</a></li>
			</ul>
		</div>
		</nav>
	  
	  
		 <div class="row">
        <div class="col s4 m4">
          <div class="card darken-1">
            <div class="card-content white-text">
              <span  style="color:black;"  class="card-title">1학년</span>
              <table>
        <thead>
          <tr>
              <th>학번</th>
              <th>이름</th>
              <th>벌점</th>
          </tr>
        </thead>

        <tbody>
		${one}
        </tbody>
      </table>
            </div>
          </div>
        </div>
		
		
        <div class="col s4 m4">
          <div class="card darken-1">
            <div class="card-content white-text">
              <span style="color:black;"  class="card-title">2학년</span>
              <table>
        <thead>
          <tr>
              <th>학번</th>
              <th>이름</th>
              <th>벌점</th>
          </tr>
        </thead>

        <tbody>
		${two}
        </tbody>
      </table>
            </div>
          </div>
        </div>
		
		
        <div class="col s4 m4">
          <div class="card  darken-1">
            <div class="card-content white-text">
              <span style="color:black;" class="card-title">3학년</span>
             <table>
        <thead>
          <tr>
              <th>학번</th>
              <th>이름</th>
              <th>벌점</th>
          </tr>
        </thead>

        <tbody>
		${third}
        </tbody>
      </table>
            </div>
          </div>
        </div>
      </div>
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
}