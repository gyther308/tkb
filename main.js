const weekday = ["CN", "Hai", "Ba", "Bon", "Nam", "Sau", "Bay", "CN"];
const d = new Date();
const range = document.createRange();
const selection = window.getSelection();
let classSection, columns, arrTD, arrTD_subject, arrTH_subject, table_subject;
let h2, body, p;

function load_data() {
	let arrClass, arrData;
	fetch('data.txt')
		.then(response => response.text())
		.then(data => {
			const arr = data.split('\n').map(line => line.trim());
			for (let i = 1; i < weekday.length; ++i) {
				arrClass = classSection[weekday[i]];
				arrData = arr[i - 1].split(',');
				for (let j = 0; j < arrClass.length; ++j)
					arrClass[j].textContent = arrData[j] != "" ? arrData[j]: "_";
			}
			let today = document.getElementById(weekday[d.getDay()]);
			today.textContent = "•" + today.textContent + "•";
		})
		.catch(error => {
			console.error('Có lỗi xảy ra:', error);
			window.alert('There was an error loading data.');
		});
}

function reload() {
	const now = new Date();
	if (d.getDay() != now.getDay()) {
		location.reload();
	}
}

function save_data() {
	let data = "", arrClass;
	for (let i = 1; i < weekday.length; ++i) {
		arrClass = document.querySelectorAll('.' + weekday[i]);
		for (let j = 0; j < arrClass.length; ++j){
			if (arrClass[j].textContent === "_") data += "";
			else if (arrClass[j].textContent[0] != "•") data += arrClass[j].textContent;
			else data += arrClass[j].textContent[1] + arrClass[j].textContent[2];
			if (j + 1 < arrClass.length) data += ",";
		}
		data += "\n";
	}
	navigator.clipboard.writeText(data).then(function() {
		console.log('Đã sao chép vào clipboard');
		window.alert('Đã sao chép vào clipboard.');
	}).catch(function(error) {
		console.error('Sao chép vào clipboard thất bại:', error);
		window.alert('Sao chép vào clipboard thất bại.');
	});
}

function clickOn () {
	table_subject.style.display = "none";
	let sameClassElements;
	arrTD_subject.forEach(function(subject) {
		subject.onclick = {};
	});
	arrTD.forEach(function(TD) {
		TD.onclick = {};
		TD.style.border = "none";
	});
	columns.forEach(function(column) {
		column.onclick = function(event) {
			event.stopPropagation();
			columns.forEach(function(col) {
				col.classList.remove('selected');
				col.classList.add('blurred');
			});
			if (column.classList[0] === "am" || column.classList[0] === "pm")
				sameClassElements = [...classSection[column.classList[0]]];
			else
				sameClassElements = [...classSection[column.classList[0]], ...classSection["apm"]];
			sameClassElements.forEach(function(el) {
				el.classList.remove('blurred');
				el.classList.add('selected');
			});
			h2.classList.add('blurred');
		};
	});
	body.onclick = function() {
		columns.forEach(function(col) {
			col.classList.remove('selected');
			col.classList.remove('blurred');
		});
		h2.classList.remove('blurred');
	};
	p.onclick = function(event) {
		event.stopPropagation();
		changeMode(true);
	}
}

function clickOff () {
	table_subject.style.display = "block";
	let targetIndex = 0;
	columns.forEach(function(col) {
		col.classList.remove('selected');
		col.classList.remove('blurred');
		col.onclick = function() {};
	});
	h2.classList.remove('blurred');
	body.onclick = function() {};
	p.onclick = function() {};
	arrTD[targetIndex].style.border = "1px solid #ffffff";
	arrTD_subject.forEach(function(subject) {
		subject.onclick = function(event) {
			arrTD[targetIndex].textContent = subject.textContent;
			arrTD[targetIndex].style.border = "none";
			if (targetIndex + 14 < arrTD.length) {
				if (targetIndex + 21 < arrTD.length) targetIndex += 7;
				else if (targetIndex + 15 < arrTD.length) targetIndex -= 27;
				else targetIndex += 1;
			} else if (targetIndex + 1 < arrTD.length) {
				if (targetIndex + 7 < arrTD.length) targetIndex += 7;
				else targetIndex -= 6;
			} else {
				targetIndex = 0;
			}
			arrTD[targetIndex].style.border = "1px solid #ffffff";
		};
	});
	arrTD.forEach(function(TD) {
		TD.onclick = function(event) {
			arrTD[targetIndex].style.border = "none";
			targetIndex = Array.from(arrTD).indexOf(TD);
			arrTD[targetIndex].style.border = "1px solid #ffffff";
		};
	});
}

function changeMode (isChanging) {
	if (isChanging) {
		clickOff();
	} else {
		clickOn();
	}
}

function InitializeVariables () {
	columns = document.querySelectorAll('#table_main td, #table_main th');
	arrTD = document.querySelectorAll('#table_main td');
	arrTD_subject = document.querySelectorAll('#table_subject td');
	arrTH_subject = document.querySelectorAll('#table_subject th');
	table_subject = document.querySelector('#table_subject');
	body = document.querySelector('body');
	h2 = document.querySelector('h2');
	p = document.querySelector('p');
	classSection = {
		"Hai": document.querySelectorAll(".Hai"),
		"Ba": document.querySelectorAll(".Ba"),
		"Bon" : document.querySelectorAll(".Bon"),
		"Nam" : document.querySelectorAll(".Nam"),
		"Sau" : document.querySelectorAll(".Sau"),
		"Bay" : document.querySelectorAll(".Bay"),
		"CN" : document.querySelectorAll(".CN"),
		"am" : document.querySelectorAll(".am"),
		"pm" : document.querySelectorAll(".pm"),
		"apm" : document.querySelectorAll(".apm"),
		"next-day" : document.querySelectorAll("." + weekday[d.getDay() + 1])
	};
}

document.addEventListener('DOMContentLoaded', function () {
	InitializeVariables();
	load_data();
	setInterval(reload, 5000);
	clickOn();
	arrTH_subject[0].onclick = function(event) {
		event.stopPropagation();
		changeMode(false);
	};
	arrTH_subject[1].onclick = function(event) {
		event.stopPropagation();
		save_data();
		changeMode(false);
	};
});
