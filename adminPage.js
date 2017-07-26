module.exports = {
	'init' : function(app, pool){
		init(app, pool);
	}
}

function init(app, pool){
	app.all('/admin_page', function (req, res) {			
		var songs = '';
		var lost = '';
		var go = '';
		pool.getConnection(function(err, connection) {
			connection.query( 'select * from SONG group by SONG_NAME', function(err, rows) {
				connection.release();
				console.log(rows);

				rows.forEach(function(value){
					songs = songs + '<tr>';
					songs = songs + '<th>' + value.SONG_NAME + '</th>';
					songs = songs + '<th>' + value.PLAY_DATE + '</th>';
					songs = songs + '</tr>';						
				});
						pool.getConnection(function(err, connection) {
			connection.query( 'select * from LOST', function(err, rows) {
				connection.release();
				console.log(rows);

				rows.forEach(function(value){
					lost = lost + '<tr>';
					lost = lost + '<th>' + value.NAME + '</th>';
					lost = lost + '<th>' + value.GET_NAME + '</th>';
					lost = lost + '<th>' + value.GET_DATE + '</th>';
					lost = lost + '<th>' + value.GET_PLACE + '</th>';
					lost = lost + '<th>' + value.STORE_PLACE + '</th>';
					lost = lost + '<th><a class="waves-effect waves-light btn" href="' + value.PHOTO_URL + '">다운</a></th>';
					lost = lost + '</tr>'
				});
		pool.getConnection(function(err, connection) {
			connection.query( 'select * from GOGO', function(err, rows) {
				connection.release();
				console.log(rows);

				rows.forEach(function(value){
					
					go = go + '<tr>';
					go = go + '<th>' + value.NAME + '</th>';
					go = go + '<th>' + value.GO_DATE + '</th>';
					go = go + '<th>' + value.END_DATE+ '</th>';
					go = go + '<th>' + value.PLACE+ '</th>';
					go = go + '<th>' + value.REASON+ '</th>';
					go = go + '<th><a class="waves-effect waves-light btn" href="' + value.FILE_URL + '">다운</a></th>';
					go = go + '</tr>';

				});
		var output = `
		<html>
    <head>
        <title>SD OS ADMIN</title>
        <meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="http://fonts.googleapis.com/earlyaccess/nanumgothiccoding.css">
        <link rel="stylesheet" href="./css/materialize.css">
		<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.1/jquery.min.js"></script>

        <style>
            th{
                color: black;
            }
            body{
                margin-top: 1%;
            }
        </style>
        <script type="text/javascript" src="./js/materialize.js"></script>
		<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    </head>
	<body>

    <div style="width:50%; float:left; height:40%;" >
        <div style="float:top;" >
            <div class="card  darken-1">
                <div class="card-content black-text">
                    <span class="card-title">기상음악 신청 목록</span>
                    <table border="1" class="centered responsive-table">
                        <thead>
                        <tr>
                            <th>음악</th>
                            <th>일시</th>
                        </tr>
                        </thead>
                        <tbody>
                        ${songs}
		
	           </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div style="float:bottom; height:initial;" >
            <div class="card  darken-1">
                <div class="card-content black-text">
                    <span class="card-title">분실물 목록</span>
                    <table border="1" class="centered responsive-table">
                        <thead>
                        <tr>
                            <th>찾은사람</th>
                            <th>물건</th>
                            <th>일시</th>
		 <th>찾은장소</th>
		 <th>보관장소</th>
		 <th>물건사진</th>
                        </tr>
                        </thead>
                        <tbody>
                        ${lost}                     
		   </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <div style="width:49%; float:right;" >
        <div style="float:top;" >
            <div class="card  darken-1">
                <div class="card-content black-text" style="height:initial;">
                    <span class="card-title">외출/체험학습 신청 목록</span>
                    <table border="1" class="centered responsive-table">
                        <thead>
                        <tr>
                            <th>이름</th>
                            <th>외출날짜</th>
                            <th>귀교날짜</th>
						 <th>외출장소</th>
						 <th>외출사유</th>
						 <th>문서</th>
                        </tr>
                        </thead>
                        <tbody>
		${go}                        
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <div class="fixed-action-btn">
        <a class="btn-floating btn-large red">
            <i class="large material-icons">mode_edit</i>
        </a>
        <ul>
            <li><a class="btn-floating red"><i class="material-icons">add_alert</i></a></li>
            <li><a class="btn-floating yellow darken-1"><i class="material-icons">warning</i></a></li>
            <li><a class="btn-floating blue"><i class="material-icons">assignment_late</i></a></li>
        </ul>
    </div>

    </body>
</html>
`
res.send(output);
			});
		});
			});
		});
			});
		});
		
	});
}
