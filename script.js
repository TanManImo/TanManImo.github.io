var player;
var stats;
var top_tier;
var trial;
var hp_trial_list;
var mp_trial_list;

function prepareData(form) {

	form.lvl = parseInt(form.lvl,10);
	form.con = parseInt(form.con,10);
	form.wis = parseInt(form.wis,10);
	form.trials = parseInt(form.trials,10);
	form.hp_gear = parseInt(form.hp_gear,10);
	form.hp_collection = parseInt(form.hp_collection,10);
	form.hp_percent = (parseFloat(form.hp_percent)/100)+1;
	form.mp_gear = parseInt(form.mp_gear,10);
	form.mp_collection = parseInt(form.mp_collection,10);
	form.mp_percent = (parseFloat(form.mp_percent)/100)+1;

	player = {
		lvl: form.lvl > 0 && form.lvl <= 55 ? form.lvl : 1,
		con: form.con >= 8 && form.con <= 18 ? form.con : 12,
		wis: form.wis >= 12 && form.wis <= 18 ? form.wis : 14,
		hp_gear: form.hp_gear > 0 ? form.hp_gear : 0,
		hp_collection: form.hp_collection > 0 ? form.hp_collection : 0,
		hp_percent: form.hp_percent > 1 ? form.hp_percent : 1,
		mp_gear: form.mp_gear > 0 ? form.mp_gear : 0,
		mp_collection: form.mp_collection > 0 ? form.mp_collection : 0,
		mp_percent: form.mp_percent > 1 ? form.mp_percent : 1
	};

	stats = {
		max_hp: Math.floor((((10+player.con)+((player.lvl-1)*(con.range[Math.floor(player.con/4)]))) * player.hp_percent)) + player.hp_gear + player.hp_collection,
		min_hp: Math.floor((((10+player.con)+((player.lvl-1)*(con.range[Math.floor((player.con/4))-(con.values-1)]))) * player.hp_percent)) + player.hp_gear + player.hp_collection,
		avg_hp: 0,
		max_mp: Math.floor((((10+player.wis)+((player.lvl-1)*(wis.range[player.wis-wis.base+wis.values-1]))) * player.mp_percent)) + player.mp_gear + player.mp_collection,
		min_mp: Math.floor((((10+player.wis)+((player.lvl-1)*(wis.range[player.wis-wis.base]))) * player.mp_percent)) + player.mp_gear + player.mp_collection,
		avg_mp: 0
	}
	stats.avg_hp = (stats.max_hp+stats.min_hp)/2;
	stats.avg_mp = (stats.max_mp+stats.min_mp)/2;

	top_tier = {
		hp: Math.floor((10+player.con)+((player.lvl-1)*(con.range[Math.floor(player.con/4)]-.5))),
		hp_per_lvl: 0,
		hp_count: 0,
		mp: Math.floor((10+player.wis)+((player.lvl-1)*(wis.range[player.wis-wis.base+wis.values-1]-1.7))),
		mp_per_lvl: 0,
		mp_count: 0

	};
	top_tier.hp_per_lvl = (top_tier.hp-(10+player.con))/(player.lvl-1);
	top_tier.mp_per_lvl = (top_tier.mp-(10+player.wis))/(player.lvl-1);

	trial = {
		count: form.trials > 0 ? form.trials : 100,
		max_hp: stats.min_hp,
		min_hp: stats.max_hp,
		max_mp: stats.min_mp,
		min_mp: stats.max_mp,
		avg_hp: 0,
		avg_mp: 0,
		max_hp_per_lvl: 0,
		min_hp_per_lvl: 0,
		max_mp_per_lvl: 0,
		min_mp_per_lvl: 0,
		avg_hp_per_lvl: 0,
		avg_mp_per_lvl: 0
	};

	hp_trial_list = {};
	mp_trial_list = {};
}

function start() {
	var rng = 0;
	for (var i = 0; i < trial.count; i++) {
		var hp = (10 + player.con);
		var mp = (10 + player.wis);

		for (var j = 2; j <= player.lvl; j++) {
			rng = Math.floor(Math.random()*(con.values))+Math.floor((player.con-con.base)/4);
			hp += con.range[rng];
			rng = Math.floor(Math.random()*(wis.values))+(player.wis-wis.base);
			mp += wis.range[rng];
		}

		hp = Math.floor(hp * player.hp_percent) + player.hp_gear + player.hp_collection;
		mp = Math.floor(mp * player.mp_percent) + player.mp_gear + player.mp_collection;

		if (hp > trial.max_hp) trial.max_hp = hp;
		if (hp < trial.min_hp) trial.min_hp = hp;
		if (mp > trial.max_mp) trial.max_mp = mp;
		if (mp < trial.min_mp) trial.min_mp = mp;

		if (hp_trial_list[hp] === undefined) hp_trial_list[hp] = 1;
		else hp_trial_list[hp]++;
		if (mp_trial_list[mp] === undefined) mp_trial_list[mp] = 1;
		else mp_trial_list[mp]++;

		trial.avg_hp += hp;
		trial.avg_mp += mp;
	}
	trial.avg_hp /= trial.count;
	trial.avg_mp /= trial.count;
	trial.max_hp_per_lvl = ((trial.max_hp-player.hp_gear-player.hp_collection-(10+player.con))/player.hp_percent)/(player.lvl-1);
	trial.min_hp_per_lvl = ((trial.min_hp-player.hp_gear-player.hp_collection-(10+player.con))/player.hp_percent)/(player.lvl-1);
	trial.avg_hp_per_lvl = ((trial.avg_hp-player.hp_gear-player.hp_collection-(10+player.con))/player.hp_percent)/(player.lvl-1);
	trial.max_mp_per_lvl = ((trial.max_mp-player.mp_gear-player.mp_collection-(10+player.wis))/player.mp_percent)/(player.lvl-1);
	trial.min_mp_per_lvl = ((trial.min_mp-player.mp_gear-player.mp_collection-(10+player.wis))/player.mp_percent)/(player.lvl-1);
	trial.avg_mp_per_lvl = ((trial.avg_mp-player.mp_gear-player.mp_collection-(10+player.wis))/player.mp_percent)/(player.lvl-1);
}

function populateStats() {
	document.querySelector(".stats__lvl").innerHTML = player.lvl;
	document.querySelector(".stats__con").innerHTML = player.con;
	document.querySelector(".stats__con__max").innerHTML = trial.max_hp + " / " + stats.max_hp + " (" + trial.max_hp_per_lvl.toFixed(2) + " HP/Level)";
	document.querySelector(".stats__con__min").innerHTML = trial.min_hp + " / " + stats.min_hp + " (" + trial.min_hp_per_lvl.toFixed(2) + " HP/Level)";
	document.querySelector(".stats__con__avg").innerHTML = trial.avg_hp.toFixed(0) + " / " + stats.avg_hp.toFixed(0) + " (" + trial.avg_hp_per_lvl.toFixed(2) + " HP/Level)";
	document.querySelector(".stats__wis").innerHTML = player.wis;
	document.querySelector(".stats__wis__max").innerHTML = trial.max_mp + " / " + stats.max_mp + " (" + trial.max_mp_per_lvl.toFixed(2) + " MP/Level)";
	document.querySelector(".stats__wis__min").innerHTML = trial.min_mp + " / " + stats.min_mp + " (" + trial.min_mp_per_lvl.toFixed(2) + " MP/Level)";
	document.querySelector(".stats__wis__avg").innerHTML = trial.avg_mp.toFixed(0) + " / " + stats.avg_mp.toFixed(0) + " (" + trial.avg_mp_per_lvl.toFixed(2) + " MP/Level)";
	document.querySelector(".stats__trials").innerHTML = "Rolled stats " + trial.count.toLocaleString() + " times";
}
