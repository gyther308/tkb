const weekday = ["CN", "Hai", "Ba", "Bon", "Nam", "Sau", "Bay", "CN"];
const d = new Date();
const range = document.createRange();
const selection = window.getSelection();
let isChanging = true;
let classSection, columns, arrTD, a;
let h2, body, p, nextField;

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
			console.error('Co loi xay ra:', error);
			window.alert('There was an error loading data.');
		});
}

function save_data() {
	let data = "", arrClass;
	for (let i = 1; i < weekday.length; ++i) {
		arrClass = document.querySelectorAll('.' + weekday[i]);
		for (let j = 0; j < arrClass.length; ++j){
			if (arrClass[j].textContent == "_") data += "";
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
	a[0].textContent = "Thời khóa biểu"; a[1].textContent = "12C1";
	a[0].style.color = a[1].style.color = "#FFFFFF";
	a[1].style.borderBottom = a[0].style.borderBottom = "none";
	let classList, sameClassElements;
	columns.forEach(function(column) {
		column.contentEditable = "false";
		column.onclick = function(event) {
			event.stopPropagation();
			columns.forEach(function(col) {
				col.classList.remove('selected');
				col.classList.add('blurred');
			});
			classList = column.classList[0];
			sameClassElements = classSection[classList];
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
	a[1].onclick = function() {}
}

function clickOff () {
	a[0].textContent = "Thoát chỉnh sửa"; a[1].textContent = "Copy";
	a[0].style.color = "#0000FF"; a[1].style.color = "#00FF00";
	a[1].style.borderBottom = a[0].style.borderBottom = "1px solid #00FFFF";
	columns.forEach(function(col) {
		col.classList.remove('selected');
		col.classList.remove('blurred');
		if (col.tagName === "TD")
			col.contentEditable = "true";
		col.onclick = function() {};
	});
	h2.classList.remove('blurred');
	body.onclick = function() {};
	a[1].onclick = function() {
		save_data();
	}
	for (let i = 0; i < arrTD.length; ++i) {
		arrTD[i].addEventListener('keydown', function(event) {
			if (event.key === 'Enter') {
				event.preventDefault();
				if (i + 1 < arrTD.length) {
					if (i + 7 < arrTD.length) nextField = arrTD[i + 7];
					else nextField = arrTD[i - 41];
					range.selectNodeContents(nextField);
					range.collapse(false);
					selection.removeAllRanges();
					selection.addRange(range);
				}
				else arrTD[i].blur();
			}
		});
	}
}

function InitializeVariables () {
	columns = document.querySelectorAll('td, th');
	arrTD = document.querySelectorAll('td');
	a = document.querySelectorAll('a');
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
		"next-day" : document.querySelectorAll("." + weekday[d.getDay() + 1])
	};
}

document.addEventListener('DOMContentLoaded', function () {
	InitializeVariables();
	load_data();
	clickOn();
	p.onclick = function(event) {
		event.stopPropagation();
		if (isChanging)
			clickOff();
		else
			clickOn();
		isChanging ^= true;
	};
});