$(document).ready(function() {
	/***************** DATA SECTION *****************/	
	// load data section
	var fields = [];
	$(".fields").each(function(){
		fields.push($(this).html());
	});
	
	var start = 0;
	var rowLimit = 10;
	
	$('.rowNumber').click(function(event){
		$('#rowData').html($(this).html());
		rowLimit = $('#rowData').html();
		$('#crawlerData').find("tr:gt(0)").remove();
		loadData(start, rowLimit);
	});
	
	loadData(start, rowLimit);
	
	$('#data_tab').click(function(){
		$('#crawlerData').find("tr:gt(0)").remove();
		loadData(start, rowLimit);
	});
	
	function loadData(start, rowLimit) {
		$.ajax({
			url: "/data",
			type: "GET",
			data: { 
				'crawlerName': $('#crawlerName').val(),
				'rowLimit': rowLimit,
				'start': start
			},
			success: function(res) {
				var rowCount = res.split(",", 1);
				res = res.slice(res.indexOf(',')+1);
				var data = $.parseJSON(res);
				$.each(data, function(i, obj) {
					var rowData = "";
					for (var j = 0; j < fields.length; j++) {
						if (fields[j] == "request_url") {
							rowData = rowData + "<td><a href='" + obj[fields[j]] + "' target='_blank'>" + obj[fields[j]] + "</a></td>";
						} else {
							rowData = rowData + "<td>" + obj[fields[j]] + "</td>";
						}
					}
					$('#crawlerData').append(
						"<tr>" + rowData + "</tr>"	
					);
				});
				
				$("#p").pagination({
			        items: rowCount,
			        itemsOnPage: rowLimit,
			        cssStyle: 'light-theme',
			        onPageClick: function(pageNumber, event) { 
			        	getPageData(rowLimit * (pageNumber-1), rowLimit);
			        }
			    });
			}
		});
	}
	
	function getPageData(start, rowLimit) {
		$.ajax({
			url: "/data",
			type: "GET",
			data: { 
				'crawlerName': $('#crawlerName').val(),
				'rowLimit': rowLimit,
				'start': start
			},
			success: function(res) {
				var rowCount = res.split(",", 1);
				res = res.slice(res.indexOf(',')+1);
				var data = $.parseJSON(res);
				$('#crawlerData').find("tr:gt(0)").remove();
				$.each(data, function(i, obj) {
					var rowData = "";
					for (var j = 0; j < fields.length; j++) { 
						if (fields[j] == "request_url") {
							rowData = rowData + "<td><a href='" + obj[fields[j]] + "' target='_blank'>" + obj[fields[j]] + "</a></td>";
						} else {
							rowData = rowData + "<td>" + obj[fields[j]] + "</td>";
						}
					}
					$('#crawlerData').append(
							"<tr>" + rowData + "</tr>"	
					);
				});
			}
		});
	}

});