var currentPage = 'page-login';
var login = false;

$(document).ready(function () {
	console.log("ready!");

	$( "#painike" ).click(function() {
		$.ajax({

			type: "GET",
			url: "http://10.211.48.117:3000/chain1",
	
			success: function (data) {
				
				var kokochain = JSON.stringify(data);
				console.log(kokochain);
			},
			dataType: "json",

		});
	  });
});


//Run when the page loads
document.addEventListener('DOMContentLoaded', function(){
	
	// Hide pages that are normally hidden
	$('#page-transaction').hide();
	$('#page-chain').hide();
	$('#page-user').hide();
	
	// Hide pages based on if there is an active login
	if (login == false)
	{
		$('#page-front').hide();
	}
	else
	{
		$('#page-login').hide();
	}
}, false);

function LoadPage(name)
{
	// Check for an active login, if it doesn't exist show the login page
	if (login == false) name = 'page-login';
	console.log('LoadPage started...');
	console.log('Hiding current page: ' + currentPage);
	
	// Hide previous page
	$('#' + currentPage).hide();
	console.log('Showing new page: ' + name);
	
	// Show page that was requested
	$('#' + name).show();
	currentPage = name;
	console.log('currentPage new value is ' + currentPage);
	
	// DEBUG AddResultRow()
	AddResultRow("mk20k3", "h5s24u", "mgktj4 - Pasi Komulainen", "lf9sk5 - Pete Kilponen", "j3s922", "Osien kasaaminen", "11.04.2018")
	
	console.log('LoadPage done!');
}

function Login()
{
	console.log('Login started...');
	var user = $('#login-username').value;
	var pass = $('#login-password').value;
	
	login = true;
	console.log('login variable is now true');
	LoadPage('page-front');
	console.log('Login done!');
}

function Logout()
{
	console.log('Logout started...');
	login = false;
	LoadPage('page-login');
	console.log('Logout done!');
}

function SortByID()
{
	$('#sort-id-glyph').attr('class', 'glyphicon glyphicon-sort-by-attributes-alt');
}

function AddResultRow(ID, Block, Sender, Receiver, Product, Work, Time)
{
	var tranList = $('#transaction-list');
	var transactions = tranList.html();
	var output = '<tr id="t-' + ID + '">';
	console.log('AddResultRow started...');
	console.log('Transaction ID: ' + ID);
	
	// Add ID field in row
	output += '<td><button class="btn" onclick="SearchByID(\'' + ID + '\')">' + ID + '</button></td>';
	
	// Add Block field in row
	output += '<td><button class="btn" onclick="SearchByBlock(\'' + Block + '\')">' + Block + '</button></td>';
	
	// Add Sender field in row
	output += '<td><button class="btn" onclick="SearchBySender(\'' + Sender + '\')">' + Sender + '</button></td>';
	
	// Add Receiver field in row
	output += '<td><button class="btn" onclick="SearchByReceiver(\'' + Receiver + '\')">' + Receiver + '</button></td>';
	
	// Add Product field in row
	output += '<td><button class="btn" onclick="SearchByProduct(\'' + Product + '\')">' + Product + '</button></td>';
	
	// Add Work field in row
	output += '<td><button class="btn" onclick="SearchByWork(\'' + Work + '\')">' + Work + '</button></td>';
	
	// Add Time field in row
	output += '<td><button class="btn" onclick="SearchByTime(\'' + Time + '\')">' + Time + '</button></td>';
	
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

