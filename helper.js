const moment=require('moment');
//const { monthAndYear }=require('./helper');

exports.countSalary=(arr)=>{
    var salary=0;
      for(var i=0;i<=arr.length-1;i++){
          salary+=arr[i].totalSalary
      }
      return salary
}

exports.isSameMonth=(arr,date)=>{
   
   var allow=true
   for(var i=0;i<=arr.length-1;i++){
    if(monthAndYear(arr[i].incrementFromMonth)===monthAndYear(date)){
        allow=false;
        break
    }
   }
return allow
}

monthAndYear=(data)=>{
    return moment(data).format('MMMM/YYYY');
}

//find number of month by date
exports.numberOfMonth=(date)=>{
return moment().month(moment(date).format('MMMM')).format("M")
}