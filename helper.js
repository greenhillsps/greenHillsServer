exports.countSalary=(arr)=>{
    var salary=0;
      for(var i=0;i<=arr.length-1;i++){
          salary+=arr[i].totalSalary
      }

      return salary
}