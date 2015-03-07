$(document).ready(function(){
	"use strict";

	var root = 'http://localhost:3000';


	function handleError(error) {
		console.error("error", error, arguments);
	}
/*
	function appendToList(list, post) {
		var newElement = $("<li/>");
		newElement.text(post.title + "  |  "+ post.id);
		// newElement.text(post.id);
		list.append(newElement);
	}
	
	function processResponse(response) {
		var list = $('ul#ul1');

		var i=0;
		$.each(response, function(){
			// response[i]
			console.log(this.title);
			appendToList(list, this);

			// if (++i >= 5) {
				// return false;
			// }

		});
	}
*/



	// List categories ---
		$.ajax({
			url: root + '/categories',
		  	method: 'GET'
		}).then(processCategoryResponse, handleError);


		function appendCatagory(list, post) {
			list = $("select#categories");
			var newElement = $("<option value="+post.id+">");

			newElement.text(post.name);
			
			list.append(newElement);
		}


		function processCategoryResponse(response) {
			var list = $('div.categories');
			
			$.each(response, function(){
				appendCatagory(list, this);
			});

		}

	// END of List categories ---






	// Add news ---
		$("button#button1").click(function() {
				
			$.ajax({
			  url: root + '/password',
			  method: 'GET'
			}).then(addNews);

		});


		function addNews(response) {
			var user_pass = prompt("Enter password", "");

			$.each(response, function(){
				
				if (user_pass == this.password) {
					
					var input_val = $("input#input1").val();

					var category = $("select#categories").val();


					// Insert news
					$.ajax('http://localhost:3000/news', {
			  			method: 'POST',
			  			data: {
			    			title: input_val,
			    			categoryId: category
			  			}
					}).then(function(data) {
			  			console.log(data);
					});


					// Empty the div
					$("div.news").empty();

					// Get the new list of news
					$.ajax({
						url: root + '/news',
						method: 'GET'
					}).then(processNewsResponse, handleError);

				} else {
					alert("Wrong password");
				}

			});
		}

	// END of Add news ---





	// List news ---

		$.ajax({
			url: root + '/news',
		  	method: 'GET'
		}).then(processNewsResponse, handleError);


		function processNewsResponse(response) {
			var list = $('div.news');
			var newElement = $("<li/>");

			$.each(response, function(){

				var newsTitle = this.title;
				var newsId = this.id;//
				var categoryId = this.categoryId;//

				$.ajax({
					url: root + '/categories/'+this.categoryId,
					method: 'GET'
				}).then(function(data) {

					var categoryName = data.name;

					list = $("div.news");					
					newElement = $("<li/>");
					
					newElement.text(newsTitle + " | "+ newsId + " | " + categoryId + " | " + categoryName);
					list.append(newElement);

				});

			});
																		
		}

	// END of List news ---



});