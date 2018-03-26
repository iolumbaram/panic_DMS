var sleep = require('sleep');
var express = require('express');
var stdin = process.openStdin();
var bodyParser = require("body-parser");

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 8001;

server.listen(port, function() {
    console.log('Server listening at port %d', port);
});

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

var case_info={
	id: null,
	timestamp: null,
	location: null,
	address: null,
	status: null,
    counter: null,
    battery: null,
	db: null
}


//from Andrew's side
app.post('/caseupdate', function(req, res) {
    case_info.id = req.body.hardware_serial
    console.log(req.body)
	var db_caseInfo = getCaseInfo(case_info.id)
	console.log(">> "+db_caseInfo)
    case_info.timestamp = getTime()
    console.log(req.body.payload_fields.analog_in_201)
    case_info.status = req.body.payload_fields.digital_in_1
    case_info.battery = req.body.payload_fields.analog_in_201
	case_info.counter =req.body.payload_fields.analog_in_202
	case_info.address = db_caseInfo.address
	case_info.db = db_caseInfo
	console.log(case_info)
    io.sockets.emit('button_status', case_info);
    // io.sockets.emit('case1_status', _firstTimestamp);
    // io.sockets.emit('case1_status', case_info);
    res.end(String("button_received"));
});



//from My Responder side
app.post('/mrupdate', function(req, res) {
    var mr_location = req.body.location;	//(LAT,LNG)
    var mr_status = req.body.status;	//PEND | RESOLVED
	var updates = {
        status: mr_status,
        id: req.body.id
	}
	console.log(req.body)
	io.sockets.emit('mr_status', updates);
    res.end(String("mr_received"));
});

function updateCase(case_no, status){
	
}
var _firstTimestamp = {
    timestamp: null
  }
io.on('connection', function (socket) {
    socket.on('case1_status', function (data) {
        _firstTimestamp.timestamp=data.timestamp
        // io.sockets.emit('case1_status', _firstTimestamp);
        

    });
});

function getCaseInfo(id) {
    var emergency_case = null;
    console.log(id);
    //TODO:: Change this with a database
    switch (id) {
      case 'b':
          var emergency_case = {
              case_no: null,
              time_lodged: null,
              last_update: null,
              status: "ACTIVE",
              id: "b",
              name: "B Wee Lit Hau",
              contact: 87654321,
              district: "East",
              type: "HDB",
              blockname: "Killiney",
              address: "234B Hougang Ave 56",
              unitno:"#07-34",
              postalcode: "S654321",
              lat: 1.372944,
              lng: 103.98253
          };
          break;

      case 'c':
          var emergency_case = {
              case_no: null,
              time_lodged: null,
              last_update: null,
              status: "ACTIVE",
              id: "c",
              name: "C Wee Lit Hau",
              contact: 87654321,
              district: "East",
              type: "HDB",
              blockname: "Hougang",
              address: "234C Hougang Ave 56",
              unitno:"#07-89",
              postalcode: "S654321",
              lat: 1.372944,
              lng: 103.78253
          };
          break;s

      /*case '70B3D5499920AF63':
          var emergency_case = {
              case_no: "70B3D5499920AF63",
              time_lodged: null,
              last_update: null,
              status: "ACTIVE",
              id: "1",
              name: "Lim Ah Beng",
              contact: 98811223,
              district: "Central",
              type: "HDB",
              blockname: "Golden Jasmine",
              address: "152B Bishan St 11",
              unitno:"#11-271",
              postalcode: "S572152",
              lat: 1.345302,
              lng: 103.854054
          };
          break;*/

       case '70B3D5499920AF63':
          var emergency_case = {
              case_no: "70B3D5499920AF63",
              time_lodged: null,
              last_update: null,
              status: "ACTIVE",
              id: "1",
              name: "Lim Ah Beng",
              contact: 98811223,
              district: "Central",
              type: "Private",
              blockname: "Raffles City Tower",
              address: "250 North Bridge Road",
              unitno:"#05-01", //andrew
              postalcode: "S179101",
              lat: 1.293966,
              lng: 103.852541
          };
          break;

    //   case '70B3D5499920AF64':
    //     var emergency_case = {
    //         case_no: "70B3D5499920AF64",
    //         time_lodged: null,
    //         last_update: null,
    //         status: "ACTIVE",
    //         id: "2",
    //         name: "Amy Lee",
    //         contact: 98811223,
    //         district: "Central",
    //         type: "HDB",
    //         blockname: "Golden Jasmine",
    //         address: "152B Bishan St 11",
    //         unitno:"#11-271",
    //         postalcode: "S572152",
    //         lat: 1.345302,
    //         lng: 103.854054
    //     };
    //       break;


      case '70B3D5499920AF64':
          var emergency_case = {
              case_no: "70B3D5499920AF64",
              time_lodged: null,
              last_update: null,
              status: "ACTIVE",
              id: "2",
              name: "Amy Lee",
              contact: 98811223,
              district: "Central",
              type: "Private",
              blockname: "Raffles City Tower",
              address: "250 North Bridge Road",
              unitno:"#05-01",
              postalcode: "S572152",
              lat: 1.293966,
              lng: 103.852541
          };
            break;
      

      case 'south':
          var emergency_case = {
              case_no: null,
              time_lodged: null,
              last_update: null,
              status: "ACTIVE",
              id: "south",
              name: "Tan Xiang Xiang",
              contact: 87654321,
              district: "South",
              type: "HDB",
              blockname: "Skyville @ Dawson",
              address: "88 Dawson Rd",
              unitno:"#06-41",
              postalcode: "S142088",
              lat: 1.295798,
              lng: 103.809378
          };
          break;
    }
	return emergency_case
}


function getTime() {
    var date = new Date();
	var time = date.getHours()*60*60+date.getMinutes()*60+date.getSeconds()			
	return time;
}




