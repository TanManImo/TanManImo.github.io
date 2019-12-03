// base con
const con = {
	base: 8,
	max_hp: 8,
	min_hp: 4,
	values: 3,
	range: []
};
con.range =  Array.from(new Array(con.max_hp-con.min_hp+1), (x, i) => i + con.min_hp);
// 4 5 6 7 8

// base wis
const wis = {
	base: 12,
	max_mp: 26,
	min_mp: 14,
	values: 7,
	range: []
};
wis.range =  Array.from(new Array(wis.max_mp-wis.min_mp+1), (x, i) => i + wis.min_mp);
// 14 15 16 17 18 19 20 21 22 23 24 25 26