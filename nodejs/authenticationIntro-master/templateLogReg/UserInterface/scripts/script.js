// Global variable for storing the current page the user is viewing at the moment.
var currentPage = 'page-front';
var chainData = '';

//Run when the page loads
document.addEventListener('DOMContentLoaded', function(){
	
	// Hide pages at start, only page-front will be visible
	$('#page-transaction').hide();
	$('#page-chain').hide();
	$('#page-user').hide();
	
	// GET JSON from db to UI at start, another call from refresh button at search?
	Refresh();
}, false);

function LoadPage(name)
{
	console.log('LoadPage started...');
	console.log('Hiding current page: ' + currentPage);
	
	// Hide previous page
	$('#' + currentPage).hide();
	
	console.log('Showing new page: ' + name);
	
	// Show page that was requested
	$('#' + name).show();
	currentPage = name;
	
	console.log('currentPage new value is ' + currentPage);
	console.log('LoadPage done!');
}

function GenerateSearchSenderOptions()
{
	var output = '<option value="0">Valitse lähettäjä...</option>';
	var skipArray = new Array(1);
	
	// Loop through chainData and generate select options
	for (var i = 0; i < chainData.length; i++)
	{
		for (var d = 0; d < chainData[i].Transactions.length; d++)
		{
			var id = chainData[i].Transactions[d].Sender;
			
			// Check if id is in skipArray
			if (!skipArray.includes(id))
			{
				output += '<option value="' + id + '">ID ' + id + '</option>';
				skipArray.push(id);
			}
		}
	}
	
	$('#search-sender').html(output)
}

function GenerateSearchReceiverOptions()
{
	var output = '<option value="0">Valitse vastaanottaja...</option>';
	var skipArray = new Array(1);
	
	// Loop through chainData and generate select options
	for (var i = 0; i < chainData.length; i++)
	{
		for (var d = 0; d < chainData[i].Transactions.length; d++)
		{
			var id = chainData[i].Transactions[d].Receiver;
			
			// Check if id is in skipArray
			if (!skipArray.includes(id))
			{
				output += '<option value="' + id + '">ID ' + id + '</option>';
				skipArray.push(id);
			}
		}
	}
	
	$('#search-receiver').html(output)
}

function GenerateSearchProductOptions()
{
	var output = '<option value="0">Valitse tuoteavain...</option>';
	var skipArray = new Array(1);
	
	// Loop through chainData and generate select options
	for (var i = 0; i < chainData.length; i++)
	{
		for (var d = 0; d < chainData[i].Transactions.length; d++)
		{
			var id = chainData[i].Transactions[d].Product;
			
			// Check if id is in skipArray
			if (!skipArray.includes(id))
			{
				output += '<option value="' + id + '">ID ' + id + '</option>';
				skipArray.push(id);
			}
		}
	}
	
	$('#search-product').html(output)
}

function SearchBySender(key = 0)
{
	// Get key from option value when key is NULL, meaning it was called from onchange
	if (key == 0)
	{
		key = $('select#search-sender option:checked').val();
		
		if (key == 0)
		{
			JsonToDataTable();
			return;
		}
	}
	
	ClearResults();
	
	// Show only chainData records containing the selected key
	for (var i = 0; i < chainData.length; i++)
	{
		for (var d = 0; d < chainData[i].Transactions.length; d++)
		{
			if (chainData[i].Transactions[d].Sender == key)
			{
				AddResultRow(chainData[i].Transactions[d].ID,
				chainData[i].Transactions[d].Block,
				chainData[i].Transactions[d].Sender,
				chainData[i].Transactions[d].Receiver,
				chainData[i].Transactions[d].Product,
				chainData[i].Transactions[d].Work,
				chainData[i].Transactions[d].Time);
			}
		}
	}
	
	// Generate / flush options for form selects
	GenerateSearchReceiverOptions();
	GenerateSearchProductOptions();
	
	// Flush values of work and date inputs
	$("#search-work").val("");
	$("#search-date-min").val("");
	$("#search-date-max").val("");
	
	$("#search-title").html("Tulokset lähettäjällä: " + key);
}

function SearchByReceiver(key = 0)
{
	// Get key from option value when key is NULL, meaning it was called from onchange
	if (key == 0)
	{
		key = $('select#search-receiver option:checked').val();
		
		if (key == 0)
		{
			JsonToDataTable();
			return;
		}
	}
	
	ClearResults();
	
	// Show only chainData records containing the selected key
	for (var i = 0; i < chainData.length; i++)
	{
		for (var d = 0; d < chainData[i].Transactions.length; d++)
		{
			if (chainData[i].Transactions[d].Receiver == key)
			{
				AddResultRow(chainData[i].Transactions[d].ID,
				chainData[i].Transactions[d].Block,
				chainData[i].Transactions[d].Sender,
				chainData[i].Transactions[d].Receiver,
				chainData[i].Transactions[d].Product,
				chainData[i].Transactions[d].Work,
				chainData[i].Transactions[d].Time);
			}
		}
	}
	
	// Generate / flush options for form selects
	GenerateSearchSenderOptions();
	GenerateSearchProductOptions();
	
	// Flush values of work and date inputs
	$("#search-work").val("");
	$("#search-date-min").val("");
	$("#search-date-max").val("");
	
	$("#search-title").html("Tulokset vastaanottajalla: " + key);
}

function SearchByProduct(key = 0)
{
	// Get key from option value when key is NULL, meaning it was called from onchange
	if (key == 0)
	{
		key = $('select#search-product option:checked').val();
		
		if (key == 0)
		{
			JsonToDataTable();
			return;
		}
	}
	
	ClearResults();
	
	// Show only chainData records containing the selected key
	for (var i = 0; i < chainData.length; i++)
	{
		for (var d = 0; d < chainData[i].Transactions.length; d++)
		{
			if (chainData[i].Transactions[d].Product == key)
			{
				AddResultRow(chainData[i].Transactions[d].ID,
				chainData[i].Transactions[d].Block,
				chainData[i].Transactions[d].Sender,
				chainData[i].Transactions[d].Receiver,
				chainData[i].Transactions[d].Product,
				chainData[i].Transactions[d].Work,
				chainData[i].Transactions[d].Time);
			}
		}
	}
	
	// Generate / flush options for form selects
	GenerateSearchSenderOptions();
	GenerateSearchReceiverOptions();
	
	// Flush values of work and date inputs
	$("#search-work").val("");
	$("#search-date-min").val("");
	$("#search-date-max").val("");
	
	$("#search-title").html("Tulokset tuotteella: " + key);
}

function SearchByWork(key = 0)
{
	// Get key from option value when key is NULL, meaning it was called from onchange
	if (key == 0)
	{
		// Only search by text input if the length is over 1.
		if ($('input#search-work').val().length > 1)
		{
			key = $('input#search-work').val();
		}
		else
		{
			JsonToDataTable();
			return;
		}
	}
	
	ClearResults();
	
	// Show only chainData records containing the selected key
	for (var i = 0; i < chainData.length; i++)
	{
		for (var d = 0; d < chainData[i].Transactions.length; d++)
		{
			if (chainData[i].Transactions[d].Work.toLowerCase() == key.toLowerCase())
			{
				AddResultRow(chainData[i].Transactions[d].ID,
				chainData[i].Transactions[d].Block,
				chainData[i].Transactions[d].Sender,
				chainData[i].Transactions[d].Receiver,
				chainData[i].Transactions[d].Product,
				chainData[i].Transactions[d].Work,
				chainData[i].Transactions[d].Time);
			}
		}
	}
	
	// Generate / flush options for form selects
	GenerateSearchSenderOptions();
	GenerateSearchReceiverOptions();
	GenerateSearchProductOptions();
	
	// Flush values of work and date inputs
	$("#search-work").val("");
	$("#search-date-min").val("");
	$("#search-date-max").val("");
	
	$("#search-title").html("Tulokset työkuvauksella: " + key);
}

function SearchByTime(key = 0)
{
	// Get key from option value when key is NULL, meaning it was called from onchange
	if (key == 0)
	{
		// If not defined, min date is 01.01.1900
		if ($('#search-date-min').val().length < 1) min = new Date('1900-01-01');
		else min = new Date($('#search-date-min').val());
		
		// If not defined, max date is now
		if ($('#search-date-max').val().length < 1) max = new Date();
		else max = new Date($('#search-date-max').val());
	}
	
	else
	{
		var keyArr = key.split(".");
		var min = max = new Date(keyArr[1] + "/" + keyArr[0] + "/" + keyArr[2]);
	}

	
	ClearResults();
	
	for (var i = 0; i < chainData.length; i++)
	{
		for (var d = 0; d < chainData[i].Transactions.length; d++)
		{
			var dateArr = chainData[i].Transactions[d].Time.split(".")
			var transactionTime = new Date(dateArr[1] + "/" + dateArr[0] + "/" + dateArr[2]);
			
			if (transactionTime >= min && transactionTime <= max)
			{
				AddResultRow(chainData[i].Transactions[d].ID,
				chainData[i].Transactions[d].Block,
				chainData[i].Transactions[d].Sender,
				chainData[i].Transactions[d].Receiver,
				chainData[i].Transactions[d].Product,
				chainData[i].Transactions[d].Work,
				chainData[i].Transactions[d].Time);
			}
		}
	}
	
	// Generate / flush options for form selects
	GenerateSearchSenderOptions();
	GenerateSearchReceiverOptions();
	GenerateSearchProductOptions();
	
	// Flush values of work and date inputs
	$("#search-work").val("");
	$("#search-date-min").val("");
	$("#search-date-max").val("");
	
	var minDateString = min.getDate() + "." + (min.getMonth()+1) + "." + min.getFullYear();
	var maxDateString = max.getDate() + "." + (max.getMonth()+1) + "." + max.getFullYear();
	
	$("#search-title").html("Tulokset aikaväliltä: " + minDateString + " - " + maxDateString);
}

function JsonToDataTable()
{
	console.log('JsonToDataTable started...');
	
	console.log('chainData: ' + chainData);	
	
	// Call a function to clear the search results before outputting new ones
	ClearResults();
	
	for (var i = 0; i < chainData.length; i++)
	{
		for (var d = 0; d < chainData[i].Transactions.length; d++)
		{
			AddResultRow(chainData[i].Transactions[d].ID,
			chainData[i].Transactions[d].Block,
			chainData[i].Transactions[d].Sender,
			chainData[i].Transactions[d].Receiver,
			chainData[i].Transactions[d].Product,
			chainData[i].Transactions[d].Work,
			chainData[i].Transactions[d].Time);
		}
	}
	console.log('JsonToDataTable done!');
}

function AddResultRow(ID, Block, Sender, Receiver, Product, Work, Time)
{
	var tranList = $('#transaction-list');
	var transactions = tranList.html();
	var output = '<tr id="t-' + ID + '">';
	console.log('AddResultRow started...');
	console.log('Transaction ID: ' + ID);
	
	// Add ID field in row
	output += '<td><button class="btn btn-data" onclick="SearchByID(\'' + ID + '\')" title="Hae transaktion tunnuksella">' + ID + '</button></td>';
	
	// Add Block field in row
	output += '<td><button class="btn btn-data" onclick="SearchByBlock(\'' + Block + '\')" title="Hae lohkon tunnuksella">' + Block + '</button></td>';
	
	// Add Sender field in row
	output += '<td><button class="btn btn-data" onclick="SearchBySender(\'' + Sender + '\')" title="Hae lähettäjän tunnuksella">' + Sender + '</button></td>';
	
	// Add Receiver field in row
	output += '<td><button class="btn btn-data" onclick="SearchByReceiver(\'' + Receiver + '\')" title="Hae vastaanottajan tunnuksella">' + Receiver + '</button></td>';
	
	// Add Product field in row
	output += '<td><button class="btn btn-data" onclick="SearchByProduct(\'' + Product + '\')" title="Hae tuotetunnuksella">' + Product + '</button></td>';
	
	// Add Work field in row
	output += '<td><button class="btn btn-data" onclick="SearchByWork(\'' + Work + '\')" title="Hae työkuvauksen perusteella">' + Work + '</button></td>';
	
	// Add Time field in row
	output += '<td><button class="btn btn-data" onclick="SearchByTime(\'' + Time + '\')" title="Hae transaktion ajan perusteella">' + Time + '</button></td>';
	
	console.log('output to be added: ' + output);
	
	tranList.html(transactions + output);
	console.log('AddResultRow done!');
}

function ClearResults()
{
	console.log('ClearResults started...');
	$('#transaction-list').html("");
	console.log('ClearResults done!');
}

function Refresh()
{
	// Get chain data from database
	$.ajax({
		
		type: "GET",
		url: "http://10.211.48.117:3000/chain1",

		success: function (data) {
			
			var chainData = JSON.stringify(data);
			console.log(chainData);
		},
		dataType: "json",

	});
	
	// Generate table from blockchain data for chain view page
	JsonToDataTable();
	
	// Generate options for form selects
	GenerateSearchSenderOptions();
	GenerateSearchReceiverOptions();
	GenerateSearchProductOptions();
	
	// Flush values of work and date inputs
	$("#search-work").val("");
	$("#search-date-min").val("");
	$("#search-date-max").val("");
	
	// Reset search title
	$("#search-title").html("Kaikki transaktiot:");
}