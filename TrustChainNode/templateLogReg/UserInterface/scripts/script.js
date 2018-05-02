// Global variable for storing the current page the user is viewing at the moment.
var currentPage = 'page-front';

// Blockchain data is global, functions except Refresh should not change the data
var chainData = '';
var localIp = '';
var sender = '';
var receiver = '';
var amount = '1';


$(document).ready(function () {
	$.ajax({

		type: "GET",
		url: "http://localhost:3000/ip",
		success: function (ip) {
			//$('#transaction-result').html("Transaktio tallennettu!");
			//$('#transaction-result').html(data);
			localIp = ip;
			//alert(localIp);
		},

	})

	$("#mine").click(function () {
		$.ajax({

			type: "GET",
			url: "http://localhost:8080/" + localIp + ":12345/mine",

			success: function (data1) {
				//alert(JSON.stringify(data1));
				$('#search-title').html(JSON.stringify(data1));
				//$('#transaction-result').html(data);

			},
			dataType: "json",
		});
	});
});


//Run when the page loads
document.addEventListener('DOMContentLoaded', function () {

	// Hide pages at start, only page-front will be visible
	$('#page-transaction').hide();
	$('#page-chain').hide();
	$('#page-user').hide();
}, false);

function LoadPage(name) {
	//console.log('LoadPage started...');
	//console.log('Hiding current page: ' + currentPage);

	// Hide previous page
	$('#' + currentPage).hide();

	//console.log('Showing new page: ' + name);

	// Show page that was requested
	$('#' + name).show();
	currentPage = name;

	// If page is chain view page, load latest data
	if (name == 'page-chain') {
		// GET JSON data
		Refresh();
	}

	//console.log('currentPage new value is ' + currentPage);
	//console.log('LoadPage done!');
}

function NewTransaction() {
	$('#transaction-result').html("Lähetetään tietoja...");

	var sender = $('#transaction-sender').val();
	var receiver = $('#transaction-receiver').val();



	if (!isNaN($('#transaction-amount').val())) {
		//do some thing if it's a number
		amount = $('#transaction-amount').val();
	} else {
		//do some thing if it's NOT a number
		amount = '0';
	}


	var data =
		{
			"Amount": Number(amount),
			"Recipient": receiver,
			"Sender": sender
		};

	var jsonstring = JSON.stringify(data);
	alert(jsonstring);
	$.ajax({

		type: "GET",
		url: "http://localhost:3000/ip",
		success: function (ip) {
			//$('#transaction-result').html("Transaktio tallennettu!");
			//$('#transaction-result').html(data);
			localIp = ip;
		},

	}).done(function () {
		console.log("DONE!");
		$.ajax({
			type: "POST",
			url: "http://localhost:8080/http://" + localIp + ":12345/transactions/new",
			data: jsonstring,
			success: function (data) {
				console.log(data);
			},
			dataType: "json",
		});
	});



	// $.ajax({
	// 	crossorigin:true,
	// 	type: "POST",
	// 	url: "http://localhost:8080/http://10.211.48.117:12345/transactions/new",
	// 	data: jsonstring,
	// 	success: function(data){
	// 		$('#transaction-result').html("Transaktio tallennettu!");
	// 		$('#transaction-result').html(data);
	// 	},
	// 	dataType: "json",
	// });




}

function GenerateSearchSenderOptions() {
	var output = '<option value="0">Valitse lähettäjä...</option>';
	var skipArray = new Array(1);

	// Loop through chainData and generate select options
	for (var i = 0; i < chainData.length; i++) {
		for (var d = 0; d < chainData[i].Transactions.length; d++) {
			var id = chainData[i].Transactions[d].Sender;

			// Check if id is in skipArray
			if (!skipArray.includes(id)) {
				output += '<option value="' + id + '">ID ' + id + '</option>';
				skipArray.push(id);
			}
		}
	}

	$('#search-sender').html(output)
}

function GenerateSearchReceiverOptions() {
	var output = '<option value="0">Valitse vastaanottaja...</option>';
	var skipArray = new Array(1);

	// Loop through chainData and generate select options
	for (var i = 0; i < chainData.length; i++) {
		for (var d = 0; d < chainData[i].Transactions.length; d++) {
			var id = chainData[i].Transactions[d].Recipient;

			// Check if id is in skipArray
			if (!skipArray.includes(id)) {
				output += '<option value="' + id + '">ID ' + id + '</option>';
				skipArray.push(id);
			}
		}
	}

	$('#search-receiver').html(output)
}

function GenerateSearchAmountOptions() {
	var output = '<option value="0">Valitse määrä...</option>';
	var skipArray = new Array(1);

	// Loop through chainData and generate select options
	for (var i = 0; i < chainData.length; i++) {
		for (var d = 0; d < chainData[i].Transactions.length; d++) {
			var id = chainData[i].Transactions[d].Amount;

			// Check if id is in skipArray
			if (!skipArray.includes(id)) {
				output += '<option value="' + id + '">' + id + '</option>';
				skipArray.push(id);
			}
		}
	}

	$('#search-amount').html(output)
}

function SearchBySender(key = 0) {
	// Get key from option value when key is NULL, meaning it was called from onchange
	if (key == 0) {
		key = $('select#search-sender option:checked').val();

		if (key == 0) {
			JsonToDataTable();
			return;
		}
	}

	ClearResults();

	// Show only chainData records containing the selected key
	for (var i = 0; i < chainData.length; i++) {
		for (var d = 0; d < chainData[i].Transactions.length; d++) {
			if (chainData[i].Transactions[d].Sender == key) {
				AddResultRow(chainData[i].Transactions[d].Sender,
					chainData[i].Transactions[d].Recipient,
					chainData[i].Transactions[d].Amount);
			}
		}
	}

	// Generate / flush options for form selects
	GenerateSearchReceiverOptions();
	GenerateSearchAmountOptions();

	// Flush values of work and date inputs
	$("#search-work").val("");
	$("#search-date-min").val("");
	$("#search-date-max").val("");

	$("#search-title").html("Tulokset lähettäjällä: " + key);
}

function SearchByReceiver(key = 0) {
	// Get key from option value when key is NULL, meaning it was called from onchange
	if (key == 0) {
		key = $('select#search-receiver option:checked').val();

		if (key == 0) {
			JsonToDataTable();
			return;
		}
	}

	ClearResults();

	// Show only chainData records containing the selected key
	for (var i = 0; i < chainData.length; i++) {
		for (var d = 0; d < chainData[i].Transactions.length; d++) {
			if (chainData[i].Transactions[d].Recipient == key) {
				AddResultRow(chainData[i].Transactions[d].Sender,
					chainData[i].Transactions[d].Recipient,
					chainData[i].Transactions[d].Amount);
			}
		}
	}

	// Generate / flush options for form selects
	GenerateSearchSenderOptions();
	GenerateSearchAmountOptions();

	$("#search-title").html("Tulokset vastaanottajalla: " + key);
}

function SearchByAmount(key = 0) {
	// Get key from option value when key is NULL, meaning it was called from onchange
	if (key == 0) {
		key = $('select#search-product option:checked').val();

		if (key == 0) {
			JsonToDataTable();
			return;
		}
	}

	ClearResults();

	// Show only chainData records containing the selected key
	for (var i = 0; i < chainData.length; i++) {
		for (var d = 0; d < chainData[i].Transactions.length; d++) {
			if (chainData[i].Transactions[d].Amount == key) {
				AddResultRow(chainData[i].Transactions[d].Sender,
					chainData[i].Transactions[d].Recipient,
					chainData[i].Transactions[d].Amount);
			}
		}
	}

	// Generate / flush options for form selects
	GenerateSearchSenderOptions();
	GenerateSearchReceiverOptions();

	$("#search-title").html("Tulokset määrällä: " + key);
}

function JsonToDataTable() {
	//console.log('JsonToDataTable started...');

	//console.log('chainData: ' + chainData);	

	// Call a function to clear the search results before outputting new ones
	ClearResults();

	for (var i = 0; i < chainData.length; i++) {
		for (var d = 0; d < chainData[i].Transactions.length; d++) {
			AddResultRow(chainData[i].Transactions[d].Sender,
				chainData[i].Transactions[d].Recipient,
				chainData[i].Transactions[d].Amount);
		}
	}
	//console.log('JsonToDataTable done!');
}

function AddResultRow(Sender, Receiver, Amount) {
	var tranList = $('#transaction-list');
	var transactions = tranList.html();
	var output = '<tr id="transaction-row">';
	//console.log('AddResultRow started...');

	// Add Sender field in row
	output += '<td><button class="btn btn-data" onclick="SearchBySender(\'' + Sender + '\')" title="Hae lähettäjän tunnuksella">' + Sender + '</button></td>';

	// Add Receiver field in row
	output += '<td><button class="btn btn-data" onclick="SearchByReceiver(\'' + Receiver + '\')" title="Hae vastaanottajan tunnuksella">' + Receiver + '</button></td>';

	// Add Amount field in row
	output += '<td><button class="btn btn-data" onclick="SearchByAmount(\'' + Amount + '\')" title="Hae määrällä">' + Amount + '</button></td>';

	//console.log('output to be added: ' + output);

	tranList.html(transactions + output);
	//console.log('AddResultRow done!');
}

function ClearResults() {
	//console.log('ClearResults started...');
	$('#transaction-list').html("");
	//console.log('ClearResults done!');
}

function Refresh() {
	$("#search-title").html("Haetaan transaktioita...");

	// Get chain data from database



	// $.ajax({

	// 	type: "GET",
	// 	url: "http://localhost:3000/chain",

	// 	success: function (data) {
	// 		alert(data)
	// 		//console.log(data);
	// 		chainData = data.chain;
	// 		//console.log(chainData);

	// 		// Generate table from blockchain data for chain view page
	// 		JsonToDataTable();

	// 		// Generate options for form selects
	// 		GenerateSearchSenderOptions();
	// 		GenerateSearchReceiverOptions();
	// 		GenerateSearchAmountOptions();

	// 		// Reset search title
	// 		$("#search-title").html("Kaikki transaktiot:");
	// 	},
	// 	dataType: "json",

	// });


	$.ajax({
		type: "GET",
		url: "http://" + localIp + ":12345/chain",
		data: jsonstring,
		success: function (data) {
			console.log(data);
			//console.log(data);
			chainData = data.chain;
			//console.log(chainData);

			// Generate table from blockchain data for chain view page
			JsonToDataTable();

			// Generate options for form selects
			GenerateSearchSenderOptions();
			GenerateSearchReceiverOptions();
			GenerateSearchAmountOptions();

			// Reset search title
			$("#search-title").html("Kaikki transaktiot:");
		},
		dataType: "json",
	});



}