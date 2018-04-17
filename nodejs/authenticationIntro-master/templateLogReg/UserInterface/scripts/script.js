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

function GenerateSearchAmountOptions()
{
	var output = '<option value="0">Valitse määrä...</option>';
	var skipArray = new Array(1);
	
	// Loop through chainData and generate select options
	for (var i = 0; i < chainData.length; i++)
	{
		for (var d = 0; d < chainData[i].Transactions.length; d++)
		{
			var id = chainData[i].Transactions[d].Amount;
			
			// Check if id is in skipArray
			if (!skipArray.includes(id))
			{
				output += '<option value="' + id + '">ID ' + id + '</option>';
				skipArray.push(id);
			}
		}
	}
	
	$('#search-amount').html(output)
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

function SearchByAmount(key = 0)
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
			if (chainData[i].Transactions[d].Amount == key)
			{
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
			AddResultRow(chainData[i].Transactions[d].Sender,
			chainData[i].Transactions[d].Recipient,
			chainData[i].Transactions[d].Amount);
		}
	}
	console.log('JsonToDataTable done!');
}

function AddResultRow(Sender, Receiver, Amount)
{
	var tranList = $('#transaction-list');
	var transactions = tranList.html();
	var output = '<tr id="transaction-row">';
	console.log('AddResultRow started...');
	
	// Add Sender field in row
	output += '<td><button class="btn btn-data" onclick="SearchBySender(\'' + Sender + '\')" title="Hae lähettäjän tunnuksella">' + Sender + '</button></td>';
	
	// Add Receiver field in row
	output += '<td><button class="btn btn-data" onclick="SearchByReceiver(\'' + Receiver + '\')" title="Hae vastaanottajan tunnuksella">' + Receiver + '</button></td>';
	
	// Add Amount field in row
	output += '<td><button class="btn btn-data" onclick="SearchByAmount(\'' + Amount + '\')" title="Hae määrällä">' + Amount + '</button></td>';
	
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
			
			var blockchainData = JSON.stringify(data);
			chainData = blockchainData.chain;
			console.log(chainData);
		},
		dataType: "json",

	});
	
	// Generate table from blockchain data for chain view page
	JsonToDataTable();
	
	// Generate options for form selects
	GenerateSearchSenderOptions();
	GenerateSearchReceiverOptions();
	GenerateSearchAmountOptions();
	
	// Reset search title
	$("#search-title").html("Kaikki transaktiot:");
}