const moment =require('moment');
const number = 1; // 0 = Jan & 11 = Dec

console.log(moment().month(moment().format('MMMM')).format("M"));