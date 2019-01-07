jQuery(document).ready(function() {
	//Getting class number passed by classBoard.js
	var CLASSSIZE = 25;
	var CLASSNUMBER = localStorage.getItem("startDiscussionClassNumber");
	//DISCUSSION CLASS
	var Discussion = function(classNumber) {
		this.classNumber = classNumber;
		this.classLowerBound = this.calculateLowerBound(classNumber);
		this.classUpperBound = this.calculateUpperBound(classNumber);
		this.students = this.loadStudents(classNumber);
	}

	Discussion.prototype.calculateLowerBound = function (classNumber) {
		var classLowerBound = (classNumber * CLASSSIZE) - CLASSSIZE;
		return classLowerBound;
	}
	Discussion.prototype.calculateUpperBound = function(classNumber) {
		var classUpperBound = (classNumber * CLASSSIZE);
		return classUpperBound;
	}
	Discussion.prototype.loadStudents = function(classNumber) {
		var students = [];
		var tracker = 0;
		for (x = 0; x < CLASSSIZE-1; x++) {
			var studentName = localStorage.getItem(this.classNumber + "-" + x);
			if (studentName !== "null" && studentName !== null && studentName !== "" && studentName !== " ") {
				students.push([studentName, 0]);
				console.log("[LOAD SEATS]Loaded student " + students[tracker][0] + " with score " + students[tracker][1]);
				tracker = tracker + 1;
			} else {
				students.push(["empty", 0]);
				console.log("[LOAD SEATS]Loaded empty seat with score " + students[tracker][1]);
				tracker = tracker + 1;
			}
		}
		return students;
	}
	Discussion.prototype.displayStudents = function() {
		for (x = 0; x < this.students.length; x++) {
			var studentName = this.students[x][0];
			var studentScore = this.students[x][1];
			if(studentName !== "empty") {
				buildCard(this.students[x][0], this.students[x][1], x);
			} else {

			}
		}
		console.log("[BOARD]Displayed Students");
	}
	buildCard = function(studentName, score, seatNumber) {
		var slotOffsets = [
			[85, 31.5],
			[85, 18.5],
			[85, 5.5],
			[72, 5.5],
			[59, 5.5],
			[46, 5.5],
			[33, 5.5],
			[20, 5.5],
			[8, 5.5],
			[8, 18.5],
			[8, 31.5],
			[8, 44.5],
			[8, 57.5],
			[8, 70.5],
			[8, 83.5],
			[20, 83.5],
			[33, 83.5],
			[46, 83.5],
			[59, 83.5],
			[72, 83.5],
			[85, 83.5],
			[85, 70.5],
			[85, 57.5],
			[85, 44.5]
		];
		$("<div/>", {
		  id: studentName,
		  class: "studentCard"
		}).appendTo("#board");
		$("<div/>", {
			text: studentName,
			class: "cardTop"
		}).appendTo("#" + studentName);
		$("<div/>", {
			class: "buttonLayer"
		}).appendTo("#" + studentName);
		for(v = -1; v < 2; v++) {
			$("<button/>", {
				class: "scoringButton",
				type: "button",
				value: v,
				text: v
			}).appendTo($("#" + studentName).children().eq(1));
		}
		$("<div/>", {
			class: "scoreLayer",
			text: score
		}).appendTo("#" + studentName);
		$('#' + studentName).css("top", slotOffsets[seatNumber][0] + "%");
		$('#' + studentName).css("left", slotOffsets[seatNumber][1] + "%");
	}
	Discussion.prototype.awardPoints = function(studentName, points) {
		for (x = 0; x < this.students.length; x++) {
			if (this.students[x][0] == studentName) {
				this.students[x][1] += parseFloat(points);
				$('#log-content').append("<li class='log-text'>" + this.students[x][0] + " was attributed " + points + " point(s)" + "</li>");
				console.log("[SCORING]Student " + this.students[x][0] + " was awarded " + points + " point(s)");
				console.log("[SCORING]" + this.students[x][0] + "\'s total: " + this.students[x][1]);
			}
		}
	}
	Discussion.prototype.refreshScores = function() {
		for (x = 0; x < this.students.length; x ++) {
			var student = this.students[x][0];
			var newScore = this.students[x][1];
			if (student !== "empty") {
				var oldScore = $("#board").children("#" + student).children(".scoreLayer");
				$(oldScore).text(newScore);
			}
		}
	}
	Discussion.prototype.exportScores = function() {
		for (x = 0; x < this.students.length; x++) {
			var student = this.students[x][0];
			var score = this.students[x][1];
			if(student !== "empty") {
				$('#student-list').prepend("<li class='student-grades'>" + student + ": " + score + "</li>")
			}
		}
	}

	$(function() {
    	var board = new Discussion(CLASSNUMBER);
    	board.displayStudents();

    	$(document).on("mouseenter", '.studentCard', function(e) {
    		var studentSelected = jQuery(this);
    		studentSelected.children(".scoreLayer").hide();
    		studentSelected.children(".buttonLayer").show();
    	});

    	$(document).on("mouseleave", '.studentCard', function(e) {
    		var studentSelected = jQuery(this);
    		studentSelected.children(".scoreLayer").show();
    		studentSelected.children(".buttonLayer").hide();
    	});

    	$(document).on("click", '.scoringButton', function(e) {
		var studentSelected = jQuery(this).parent().parent().attr("id");
		var pointsAwarded = jQuery(this).val();
		board.awardPoints(studentSelected, pointsAwarded);
		board.refreshScores();
		});

		$('#finish').click( function() {
			$('#blur').show();
			board.exportScores();
			$('#log').show();
			$('#log').children().show();
			$('#log').children().children().show();
		});

		$('#exit-log').click( function() {
			$('#student-list').empty();
			$('#blur').hide();
			$('#log').hide();
			$('#log').children().hide();
			$('#log').children().children().hide();
			$('#student-list').empty();
		});
	});
	$("#main").keypress( function(e){
		if(e.keyCode == 32){
       		$("#commentSelect").toggle();
   		}
	});

	// $(document).on("click", '.scoringButton', function(e) {
	// 	var studentSelected = jQuery(this).parent().parent().attr("id");
	// 	var pointsAwarded = jQuery(this).val();
	// 	board.awardPoints(studentSelected, pointsAwarded);
	// });
});

//Defined outside of JQuery scope for onclick access
//Global Comment Variables
	var comment1 = "Contribution was made";
	var comment2 = "Contribution had evidence";
	var comment3 = "Contribution changed flow of conversation";
	var comment4 = "Contribution provided a new interpretation";
	var comment5 = "Point restated the obvious";
	var comment6 = "Point negatively contributed";
function addComment(commentNumber) {
		console.log("[COMMENT]Event Fired");
		if (commentNumber == 1) {
			$('#log-content').append("<li class='log-text'>" + comment1 + "</li>");
		} else if (commentNumber == 2) {
			$('#log-content').append("<li class='log-text'>" + comment2 + "</li>");
		} else if (commentNumber == 3) {
			$('#log-content').append("<li class='log-text'>" + comment3 + "</li>");
		} else if (commentNumber == 4) {
			$('#log-content').append("<li class='log-text'>" + comment4 + "</li>");
		} else if (commentNumber == 5) {
			$('#log-content').append("<li class='log-text'>" + comment5 + "</li>");
		} else {
			$('#log-content').append("<li class='log-text'>" + comment6 + "</li>");
		}
	}