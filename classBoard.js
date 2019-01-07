//TEST FUNCTION

//TAB CONTENT
jQuery(document).ready(function() {
	//CONSTANTS
	var CLASSSIZE = 25;
	//GLOBAL VARIABLES
	var tabNumber = 1;
	var absort = false;
	//TAB Display Function
	$('.tabs .tab-links a').on('click', function(e)  {
		currentAttrValue = jQuery(this).attr('href');
		console.log(currentAttrValue);
        //showHideTabs
        jQuery('.tabs ' + currentAttrValue).show().siblings().hide();
        //activeClass
        jQuery('.tab-links').find('li').removeClass('active');
        jQuery(this).children().addClass('active');
        e.preventDefault();

        tabNumber = currentAttrValue.charAt(4);
        updateStudentDraggables();
    });
	//Erases TextAreas
    function eraseText(tabNumber) {
	    	document.getElementById("studentInput" + tabNumber).value = "";
	}

	//STUDENTPACKAGER CLASS
		//CONSTRUCTOR
		var StudentPackager = function(data, cNumber) {
			this.studentArray = seperateNames(data);
			this.studentPackage = [];
			this.classNumber = cNumber;
		}
		//static methods
		function seperateNames(string) {
			var trimmedString = string.trim();
			return trimmedString.split(" ");
		}
		//packager methods
		StudentPackager.prototype.package = function() {
			var nameList = [];
			for (x = 0; x < this.studentArray.length; x++) {
				nameList.push(this.studentArray[x]);
				nameList[x] = new Student(this.studentArray[x], this.classNumber);
				this.studentPackage.push(nameList[x]);
			}
		}
		StudentPackager.prototype.getPackage = function(index) {
			return this.studentPackage;
		}
		StudentPackager.prototype.unPackage = function(index) {

		}
	//STUDENT PACKAGER CLASS END

	//STUDENT CLASS
		//CONSTRUCTOR
		var Student = function(name, cNumber) {
			this.classNumber = cNumber;
			this.studentName = name;
		}
		//Student mutators/accessors
		Student.prototype.getName = function() {
			return this.studentName;
		}
		Student.prototype.setName = function(name) {
			this.studentName = name;
		}
		Student.prototype.getClassNumber = function() {
			return this.studentName;
		}
		Student.prototype.setClassNumber = function(cNumber) {
			this.classNumber = cNumber;
		}
	//STUDENT CLASS END
		function bubbleSort(studentPackage) {
			var sort = true;
			do {
				sort = false;
				for(x = 0; x < studentPackage.length - 1; x++){
					if(studentPackage[x].getName().charCodeAt(0) > studentPackage[x + 1].getName().charCodeAt(0))
					 {
						var temp = studentPackage[x];
						studentPackage[x] = studentPackage[x + 1];
						studentPackage[x + 1] = temp;
						sort = true;
					}
				}
			} while (sort);
			return studentPackage;
		}
		function alphabeticalMerge(studentPackage, left, right, middle) {
			var tempArray = [];
			var index1 = left;
			var index2 = middle + 1;
			var index3 = 0;

			while (index1 <= middle && index2 <= right) {
				if (studentPackage[index] < studentPackage[index2]) {
					tempArray[index3] = studentPackage[index1];
					index1++;
				} else {
					tempArray[index3] = studentPackage[index2];
					index2++;
				}
				index3++;
				while (index1 <= middle) {
					tempArray[index3] = studentPackage[index1];
					index1++;
					index3++;
				}
				while (index2 <= right) {
					tempArray[index3] = studentPackage[index2];
					index3++;
					index3++;
				}
				for (x = 0; x < tempArray.length; x++) {
					studentPackage[left + index3] = tempArray[index3];
				}
			}
		}
		function alphabeticalSort(studentPackage, left, right) {
			console.log("Sort looped");
			if(left == right) return studentPackage;
			var middle = Math.floor((left + right) / 2);
			alphabeticalSort(studentPackage, left, middle);
			alphabeticalSort(studentPackage, middle + 1, right);
			alphabeticalMerge(studentPackage, left, middle, right);
			return studentPackage;
		}
	//STUDENT SAVER CLASS
	//Handles user input and stores to localStorage
		//CONSTRUCTOR
		
		var StudentSaver = function(studentInput, cNumber) {
			this.classLowerBound = this.calculateLowerBound(cNumber);
			this.classUpperBound = this.calculateUpperBound(cNumber);
			this.studentInput = studentInput;
			this.classNumber = cNumber;
		}
		StudentSaver.prototype = Object.create(Student.prototype);
		//calculate bounds methods
		StudentSaver.prototype.calculateLowerBound = function(classNumber) {
			var classLowerBound = (classNumber * CLASSSIZE) - CLASSSIZE;
			return classLowerBound;
		}
		StudentSaver.prototype.getLowerBound = function() {
			return this.classLowerBound;
		}
		StudentSaver.prototype.calculateUpperBound = function(classNumber) {
			var classUpperBound = (classNumber * CLASSSIZE);
			return classUpperBound;
		}
		//localStorage methods

		// StudentSaver.prototype.setStudents = function() {
		// 	console.log("[SET FUNCTION]setStudents_studentInput: " + this.studentInput);
		// 	console.log("[SET FUNCTION]setStudents_classNumber: " + this.classNumber);
		// 	var students = new StudentPackager(this.studentInput, this.classNumber);
		// 	students.package();
		// 	var package = [];
		// 	package = students.getPackage();
		// 	package = bubbleSort(package);
		// 	for (x = 0; x < CLASSSIZE; x++) {
		// 		localStorage.setItem(this.classLowerBound + x, null);
		// 	}
		// 	if (package.length == 0) {
		// 		window.alert("Nothing was submitted");
		// 	} else {
		// 		for (x = 0; x < package.length; x++) {
		// 			if (package[x].studentName !== " " && package[x].studentName !== null && package[x].studentName !== " ") {
		// 				localStorage.setItem(this.classLowerBound + x, package[x].studentName);
		// 				console.log("[SET FUNCTION]ItemStored: " + localStorage.getItem(this.classLowerBound + x));
		// 			}
		// 		}
		// 	}
		// }
		StudentSaver.prototype.removeAll = function() {
			for (x = this.classLowerBound; x < this.classUpperBound; x++) {
				localStorage.setItem(x, null);
			}
		}
		StudentSaver.prototype.addStudents = function() {
			var students = new StudentPackager(this.studentInput, this.classNumber);
			students.package();
			var package = [];
			package = students.getPackage();

			var currentStudentsInput = "";
			if (localStorage.getItem(this.classLowerBound) !== "null" && localStorage.getItem(this.classLowerBound) !== " " && localStorage.getItem(this.classLowerBound) !== "" && localStorage.getItem(this.classLowerBound) !== null) {
				currentStudentsInput = localStorage.getItem(this.classLowerBound);
			}
			for (x = this.classLowerBound+1; x < this.classUpperBound; x++) {
				if (localStorage.getItem(x) !== "null" && localStorage.getItem(x) !== " " && localStorage.getItem(x) !== "" && localStorage.getItem(x) !== null) {
					currentStudentsInput = " " + currentStudentsInput + " " + localStorage.getItem(x)
				} else {
					continue;
				}
			}
			console.log("[ADD FUNCTION]String Elements:" + currentStudentsInput);
			var currentStudents = new StudentPackager(currentStudentsInput, this.classNumber);
			currentStudents.package();
			var currentPackage = [];
			currentPackage = currentStudents.getPackage();

			var toAdd = package;
			for (x = 0; x < toAdd.length; x++) {
				if (toAdd[x] !== "null" && toAdd[x] !== " " && toAdd[x] !== "" && toAdd[x] !== null) {
				currentPackage.push(toAdd[x]);
				}
			}

			if (absort) {
				currentPackage = bubbleSort(currentPackage);
			}
			if (currentPackage.length <= CLASSSIZE) {
				for (x = 0; x < CLASSSIZE; x++) {
					localStorage.setItem(this.classLowerBound + x, null);
				}
				for (x = 0; x < currentPackage.length; x++) {
					if (currentPackage[x].studentName !== "null" && currentPackage[x].studentName !== " " && currentPackage[x].studentName !== "" && currentPackage[x].studentName !== null) {
						localStorage.setItem(this.classLowerBound + x, currentPackage[x].studentName);
						console.log("[ADD FUNCTION]Class Elements:" + localStorage.getItem(this.classLowerBound + x));
					}
				}
				eraseText(tabNumber);
			} else {
				window.alert("Too many students in the class (maximum is 25)");
			}
		}
		StudentSaver.prototype.removeStudent = function(student) {
			var index;
			var temp;
			for (x = this.classLowerBound; x < this.classUpperBound; x++) {
				var currentStudent = localStorage.getItem(x);
				if(student == currentStudent) {
					index = x;
					localStorage.setItem(x, null);
				}
			}
			for (x = index; x <= this.classUpperBound; x++) {
				temp = localStorage.getItem(x+1);
				localStorage.setItem(x, temp);
			}
		}
		//STUDENT SAVER CLASS END
	refreshStudents = function(classNumber) {
		var classLowerBound = null;
		var currentStudentCount = 0;
		classLowerBound = (classNumber * CLASSSIZE) - CLASSSIZE;
		$('#student-list' + classNumber).empty();
		for (x = 0; x < CLASSSIZE; x++) {
			if (localStorage.getItem(classLowerBound + x) !== 'null' && localStorage.getItem(classLowerBound + x) !== null) {
				$('#student-list' + classNumber).append("<li>" + localStorage.getItem(classLowerBound + x) + "</li>");
				currentStudentCount++;
			}
		}
		
		updateStudentDraggables();
		$("#studentInput" + classNumber).attr("placeholder", "Currently " + currentStudentCount + " students are in the class");
	}
	refreshSeats = function(classNumber) {
		for (x = 0; x < CLASSSIZE-1; x++) {
			var studentName = localStorage.getItem(classNumber + "-" + x);
			if (studentName !== 'null' && studentName !== null && studentName !== "" && studentName !== " ") {
				console.log("[REFRESH SEATS] loaded " + studentName);
				$("#"+classNumber+"student-slot"+x).append("<li class='studentName'>" + studentName + "</li>");
				console.log("[REFRESH SEATS] Target: " + "#"+classNumber+"student-slot"+x);
				console.log("[REFRESH SEATS]" + $("#"+classNumber+"student-slot"+x).children().text() + " was seated");
			} else {
				$("#"+classNumber+"student-slot"+x).empty();
				console.log("[REFRESH SEATS] Target: " + "#"+classNumber+"student-slot"+ x +" was cleared");
			};
		}
	}
	clearSeats = function(classNumber) {
		for (x = 0; x < CLASSSIZE-1; x++) {
			var studentName = localStorage.setItem(classNumber + "-" + x, "null");
		}
		console.log("[CLEAR SEATS] Class " + classNumber + " seats cleared" );
	}
	refreshClassName = function(classNumber) {
		var name = localStorage.getItem("tabName" + classNumber);
		if (name !== "null" && name !== null && name !== "") {
			$('#tabButtons').find('li').eq(classNumber - 1).html(name);
		}
	}
	setSeats = function(classNumber) {
		var slotOffsets = [
			[90, 46],
			[90, 36],
			[90, 26],
			[77, 26],
			[64, 26],
			[51, 26],
			[38, 26],
			[25, 26],
			[13, 26],
			[13, 36],
			[13, 46],
			[13, 56],
			[13, 66],
			[13, 76],
			[13, 86],
			[25, 86],
			[38, 86],
			[51, 86],
			[64, 86],
			[77, 86],
			[90, 86],
			[90, 76],
			[90, 66],
			[90, 56]
		];
		for(x = 0; x < CLASSSIZE-1; x++) {
			$('#student-layout' + classNumber).append("<div id ='"+classNumber+"student-slot"+x+"'class='student-slot'></div>");
		}
		for(x = 0; x < slotOffsets.length; x++) {
			$('#'+classNumber+"student-slot"+x).css("top", slotOffsets[x][0] + "%");
			$('#'+classNumber+"student-slot"+x).css("left", slotOffsets[x][1] + "%");
		}
		refreshSeats(classNumber);
	}
	dragStudent = function(ev) {
		ev.dataTransfer.setData("text", ev.target.text);
	}
	dropStudent = function(ev) {
		ev.preventDefault();
		var name = ev.dataTransfer.getData("text");
		ev.target.appendChild($())
	}
	hoverStudent = function(ev) {
		ev.preventDefault();
	}
	//Refreshes Student lists
	$(function() {
		refreshClassName(1);
		refreshClassName(2);
		refreshClassName(3);
		refreshClassName(4);
		refreshClassName(5);
		refreshClassName(6);
		console.log("[GLOBAL]Refreshed Class Names");
    	refreshStudents(1);
    	refreshStudents(2);
    	refreshStudents(3);
    	refreshStudents(4);
    	refreshStudents(5);
    	refreshStudents(6);
    	console.log("[GLOBAL]Refreshed Student Lists");
    	setSeats(1);
    	setSeats(2);
    	setSeats(3);
    	setSeats(4);
    	setSeats(5);
    	setSeats(6);
    	console.log("[GLOBAL]Positioned Seats");
    	updateStudentDraggables();
	});

	$(".absort").click( function() {
		if (absort == false) {
			$(".absort").css("background-color", "#00cc99");
			absort = true;
			console.log("[ABSORT]set " + absort);
		} else {
			$(".absort").css("background-color", "#862d2d");
			absort = false;
			console.log("[ABSORT]set " + absort);
		}
	});

	//Drag&Drop Functions
	updateStudentDraggables = function() {
		$('#student-list' + tabNumber).children().draggable({
			containment: '.tab-content',
			cursor: 'move',
			scroll: false,
			snap: '.tab-content',
			snapTolerance: 1,
			helper: 'clone',
			appendTo: '#student-layout' + tabNumber,
			start: studentDragStartHandler,
   			stop: studentDragStopHandler
		});
		$('.student-slot').children().draggable({
			containment: '.tab-content',
			cursor: 'move',
			scroll: false,
			snap: '.tab-content',
			snapTolerance: 1,
			helper: 'clone',
			start: studentDragStartHandler,
   			stop: studentDragStopHandler
		});
		$('.student-slot').droppable({
			drop: studentSlotHandler,
		});
		$('.trash').droppable({
			drop: studentRemovalHandler,
			hoverClass: "trash-hover"
		});
		// $('#student-list' + tabNumber).children().sortable();
	}
	function studentDragStartHandler(event, ui) {
	}
	function studentDragStopHandler(event, ui) {
	}
	function studentSlotHandler(event, ui) {
		var student = ui.draggable;
		var thisSeatNumber = $(this).attr("id").charAt(13);
		if($(this).attr("id").length > 13) {
			thisSeatNumber = thisSeatNumber + $(this).attr("id").charAt(14);
		}
		console.log("[DRAGGABLE]Dropped Seat: " + thisSeatNumber);
		var thatSeatNumber = student.parent().attr("id").charAt(13);
		if(student.parent().hasClass("student-lists")) {
			$(this).empty();
			$(this).append(student.clone());
			$(this).children().addClass("studentName");
			localStorage.setItem(tabNumber + "-" + thisSeatNumber, $(this).children().text());
			console.log("[SETSEATS]" + localStorage.getItem(tabNumber + "-" + thisSeatNumber) + " saved in " + tabNumber + "-" + thisSeatNumber);
		} else if (student.parent().hasClass("student-slot")) {
			if(student.parent().attr("id").length > 13) {
				thatSeatNumber = thatSeatNumber + student.parent().attr("id").charAt(14);
			}
			console.log("[DRAGGABLE]Dragged Seat: " + thatSeatNumber);
			if($(this).children().length < 1) {
				$(this).append(student);
				localStorage.setItem(tabNumber + "-" + thisSeatNumber, $(this).children().text());
				localStorage.setItem(tabNumber + "-" + thatSeatNumber, null);
			} else {
				var temp = student.text();
				var parent = student.parent();
				parent.empty();
				parent.append("<li>" + $(this).children().text() + "</li>");
				parent.children().addClass("studentName");
				$(this).children().text(temp);
				localStorage.setItem(tabNumber + "-" + thisSeatNumber, $(this).children().text());
				localStorage.setItem(tabNumber + "-" + thatSeatNumber, parent.children().text());
			}
		}
		updateStudentDraggables();
	}
	function studentRemovalHandler(event, ui) {
		var student = ui.draggable;
		var thatSeatNumber = student.parent().attr("id").charAt(13);
		if(student.hasClass("studentName")) {
			if(student.parent().attr("id").length > 13) {
				thatSeatNumber = thatSeatNumber + student.parent().attr("id").charAt(14);
			}
			localStorage.setItem(tabNumber + "-" + thatSeatNumber, null);
			student.parent().empty();
		} else {
			var name = student.text();
			var studentInput = new StudentSaver("", tabNumber);
			studentInput.removeStudent(name);
			refreshStudents(tabNumber);
		}
		updateStudentDraggables();
	}
	//TAB INPUT FUNCTIONS

	// $(".set").click( function() {
	// 	console.log("[SET FUNCTION]Set Function: Tab" + tabNumber);
	// 	console.log("[SET FUNCTION]TextArea Value: " + $('#studentInput' + tabNumber).val());
	// 	var studentInput = new StudentSaver($('#studentInput' + tabNumber).val(), tabNumber);
	// 	studentInput.setStudents();
	// 	refreshStudents(tabNumber);
	// 	eraseText(tabNumber);
	// });
	$(".clear-seats").click( function() {
		clearSeats(tabNumber);
		refreshSeats(tabNumber);
	});
	$(".removeall").click( function() {
		console.log("[REMOVEALL FUNCTION]Cleared Class List")
		var studentInput = new StudentSaver("", tabNumber);
		var confirm = window.confirm("Are you sure you wish to clear all students?");
		if (confirm == true) {
			studentInput.removeAll();
			clearSeats(tabNumber);
		} else {
			return;
		}
		refreshStudents(tabNumber);
		refreshSeats(tabNumber);
	});

	function addFromForm() {
		console.log("[ADD FUNCTION]Add Function: Tab" + tabNumber);
		console.log("[ADD FUNCTION]TextArea Value: " + $('#studentInput' + tabNumber).val());
		var temp = $('#studentInput' + tabNumber).val();
		if (temp == "" || temp == " " || temp == null || temp == "null") {
			return;
		} else {
			var studentInput = new StudentSaver($('#studentInput' + tabNumber).val(), tabNumber);
			studentInput.addStudents();
		}
		refreshStudents(tabNumber);
	}

	$(".add").click( function() {
		addFromForm();
	});

	$('.student-form').keypress(function(event){
    	var keycode = (event.keyCode ? event.keyCode : event.which);
		if(keycode == '13'){
        	addFromForm();
        	studentInput.text("");
		}
	});

	$("#tabButtons").on("dblclick", '.active', 'li', function(e) {
		var currentTab = jQuery(this);
		var newName = prompt("Enter new name", "");
		if (newName !== null && newName !== " ") {
			localStorage.setItem("tabName" + tabNumber, newName);
			console.log("[TABS]" + "tabName" + tabNumber + " set to " + newName);
		};
		refreshClassName(tabNumber);
	});

	// $(".store").click( function() {
	// 	var testerArray = [];
	// 	var Gabe = new Student("Gabe", 1);
	// 	var John = new Student("John", 1);
	// 	var Peter = new Student("Peter", 1);
	// 	var Jack = new Student("Jack", 1);
	// 	testerArray.push(Gabe);
	// 	testerArray.push(John);
	// 	testerArray.push(Peter);
	// 	testerArray.push(Jack);
	// 	var arry = bubbleSort(testerArray);
	// 	console.log("Complete");
	// 	for (x = 0; x < testerArray.length; x++){
	// 		console.log(arry[x].getName());
	// 	}
	// });

	// $('#store').click( function() {
	// 	storeNames(1, studentList);
	// });

	startDiscussion = function() {
		localStorage.setItem("startDiscussionClassNumber", tabNumber);
		console.log("[START DISCUSSION]Starting discussion on class " + tabNumber);
	}	
});
