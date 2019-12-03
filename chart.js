var form = document.querySelector(".form");
var form_elements = form.querySelectorAll(".form__input");
for (var i = 1; i < form_elements.length; i++) {
	form_elements[i].addEventListener("input", function(e) {
		this.querySelector(".input__value").innerHTML = e.target.value + " / " + e.target.max;
	});
}

var info = document.querySelector(".info");
info.addEventListener("click", function() {
	document.querySelector(".info__popup").classList.remove("display__none");
});

var info_close = document.querySelector(".info__close");
info_close.addEventListener("click", function() {
	document.querySelector(".info__popup").classList.add("display__none");
})

var isChartCreated = 0;
var roll = document.querySelector(".roll");
var menu = document.querySelector(".menu");
var menu_condensed = document.querySelector(".menu__icon");
var stats_info = document.querySelector(".stats");
var stats_hide = document.querySelector(".stats__hide");
var toggle = document.querySelector(".toggle");
var toggle_button = document.querySelector(".toggle__button");
var toggled = 0;
function toggleChart() {
	if (!toggled) {
		toggled = 1;
		document.getElementById("mpChart").classList.remove("display__none");
		document.getElementById("hpChart").classList.add("display__none");
		toggle_button.innerHTML = "View <span class='con'>HP</span>";
	} else {
		toggled = 0;
		document.getElementById("mpChart").classList.add("display__none");
		document.getElementById("hpChart").classList.remove("display__none");
		toggle_button.innerHTML = "View <span class='wis'>MP</span>";
	}
}

// defaults 
var formData = {
	trials: 1,
	lvl: 1,
	con: 12,
	wis: 14
};
function getFormData() {
	formData.trials = form.querySelector(".input__roll").value;
	formData.lvl = form.querySelector(".input__lvl").value;
	formData.con = form.querySelector(".input__con").value;
	formData.wis = form.querySelector(".input__wis").value;
	return formData;
}

// Create chart here
var button_cancel = document.querySelector(".cancel");
button_cancel.addEventListener("click", function() {
	menu.classList.add("display__none");
	stats_info.classList.remove("display__none");
	toggle.classList.remove("display__none");
});
roll.addEventListener("click", function() {
	if (!isChartCreated) {
		prepareData(getFormData());
		start();
		populateStats(stats_info);
		createChart();
		isChartCreated = 1;
		stats_info.classList.remove("display__none");
		toggle.classList.remove("display__none");
		toggle_button.addEventListener("click", function() {
			toggleChart();
		});
		button_cancel.classList.remove("display__none");
		menu.classList.add("display__none");
	} else {
		prepareData(getFormData());
		start();
		populateStats(stats_info);
		updateChart();
		toggle.classList.remove("display__none");
		stats_info.classList.remove("display__none");
		menu.classList.add("display__none");
	}
});

var stats_hidden = 0;
var foldable_stats = document.querySelector(".stats__foldable");
stats_hide.addEventListener("click", function() {
	if (!stats_hidden) {
		foldable_stats.classList.add("display__none");
		this.innerHTML = "Show Stats";
		stats_hidden = 1;
	} else {
		foldable_stats.classList.remove("display__none");
		this.innerHTML = "Hide Stats";
		stats_hidden = 0;
	}
});

var button_download = document.querySelector(".download");
button_download.addEventListener("click", function() {
	const top_header = "Level,Con,Wis\r\n";
	const top_header_info = player.lvl + "," + player.con + "," + player.wis + "\r\n";
	const hp_header = "HP,HP ROLLS\r\n";
	const mp_header = "MP,MP ROLLS\r\n";

	let hp_csv = Object.keys(hp_trial_list).map(key => {
		return key + "," + hp_trial_list[key] + "\r\n";
	}).join("");

	hp_csv = top_header+top_header_info+hp_header+hp_csv;

	let mp_csv = Object.keys(mp_trial_list).map(key => {
		return key + "," + mp_trial_list[key] + "\r\n";
	}).join("");

	mp_csv = top_header+top_header_info+mp_header+mp_csv;

	const hp_filename = "con_data.csv";
	const mp_filename = "wis_data.csv";
	var hp_blob = new Blob([hp_csv], { type: 'text/csv;charset=utf-8;' });
	var mp_blob = new Blob([mp_csv], { type: 'text/csv;charset=utf-8;' });

	if (navigator.msSaveBlob) {
		navigator.msSaveBlob(blob, hp_filename);
		navigator.msSaveBlob(blob, hp_filename);
	} else {
		var hp_link = document.createElement("a");
		var mp_link = document.createElement("a");
		setTimeout(function() {
			if (hp_link.download !== undefined) {
	            var url = URL.createObjectURL(hp_blob);
	            hp_link.setAttribute("href", url);
	            hp_link.setAttribute("download", hp_filename);
	            hp_link.style.visibility = 'hidden';
	            document.body.appendChild(hp_link);
	            hp_link.click();
	            document.body.removeChild(hp_link);
	        }
		}, 0);
        setTimeout(function() {
        	if (mp_link.download !== undefined) {
	            var url = URL.createObjectURL(mp_blob);
	            mp_link.setAttribute("href", url);
	            mp_link.setAttribute("download", mp_filename);
	            mp_link.style.visibility = 'hidden';
	            document.body.appendChild(mp_link);
	            mp_link.click();
	            document.body.removeChild(mp_link);
	        }
        }, 1000);
	}

	/*const items = Object.values(hp_trial_list);
	const replacer = (key, value) => value === null ? "" : value;
	const header = Object.keys(items);
	let csv = items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer).join(',')));
	csv.unshift(header.join(','));
	csv = csv.join('\r\n');
	console.log(csv);*/
});

menu_condensed.addEventListener("click", function() {
	toggle.classList.add("display__none");
	stats_info.classList.add("display__none");
	menu.classList.remove("display__none");
});

var ctx = document.getElementById('hpChart').getContext('2d');
var hpChart, mpChart;
var ctx2 = document.getElementById('mpChart').getContext('2d');
function createChart() {
	hpChart = new Chart(ctx, {
	    type: 'bar',
	    data: {
	        labels: Object.keys(hp_trial_list).map((x, i) => x + " HP"),
	        datasets: [{
	            label: '# of Rolls',
	            data: Object.values(hp_trial_list),
	            backgroundColor: "rgba(255,125,0,.7)",
	            fontColor: "rgba(255,255,255,1)",
	            borderWidth: 1
	        }]
	    },
	    options: {
	    	maintainAspectRatio: false,
	    	legend: {
	    		labels: {
	    			fontColor: "rgba(255,255,255,1)"
	    		}
	    	},
	        scales: {
	            yAxes: [{
	                ticks: {
	                    beginAtZero: true,
	                    fontColor: "rgba(255,255,255,1)"
	                },
	                gridLines: {
	                	color: "rgba(0,0,0,.5)"
	                }
	            }],
	            xAxes: [{
	            	ticks: {
	            		fontColor: "rgba(255,255,255,1)"
	            	},
	                gridLines: {
	                	color: "rgba(0,0,0,.5)"
	                }
	            }]
	        }
	    }
	});
	//var ctx2 = document.getElementById('mpChart').getContext('2d');
	mpChart = new Chart(ctx2, {
	    type: 'bar',
	    data: {

	        labels: Object.keys(mp_trial_list).map((x, i) => x + " MP"),
	        datasets: [{
	            label: '# of Rolls',
	            data: Object.values(mp_trial_list),
	            backgroundColor: "rgba(0,125,255,.7)",
	            borderWidth: 1
	        }]
	    },
	    options: {
	    	maintainAspectRatio: false,
	    	legend: {
	    		labels: {
	    			fontColor: "rgba(255,255,255,1)"
	    		}
	    	},
	        scales: {
	            yAxes: [{
	                ticks: {
	                    beginAtZero: true,
	                    fontColor: "rgba(255,255,255,1)"
	                },
	                gridLines: {
	                	color: "rgba(0,0,0,.5)"
	                }
	            }],
	            xAxes: [{
	            	ticks: {
	            		fontColor: "rgba(255,255,255,1)"
	            	},
	                gridLines: {
	                	color: "rgba(0,0,0,.5)"
	                }
	            }]
	        }
	    }
	});
}

function updateChart() {
	hpChart.data.labels = Object.keys(hp_trial_list).map((x, i) => x + " HP");
	hpChart.data.datasets[0].data = Object.values(hp_trial_list);
	hpChart.update();
	mpChart.data.labels = Object.keys(mp_trial_list).map((x, i) => x + " MP");
	mpChart.data.datasets[0].data = Object.values(mp_trial_list);
	mpChart.update();
}