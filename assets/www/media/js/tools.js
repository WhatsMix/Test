var tools = {
    formatDateDayAndStringMonth: function(d){
       console.log(d);
        //var info = d.split('-');//2013-03-31 dimanche
        //console.log(info)
        //var date =  new Date(info[0],info[1],info[2]);
       
       date = Date.parse(d);
        console.log(date)
       if(date==null || !date.getDay)return null;
        return tools.days[date.getDay()]+" "+(date.getDate())+" "+tools.months[date.getMonth()];
    },
    days:["DIMANCHE","LUNDI","MARDI","MERCREDI","JEUDI","VENDREDI","SAMEDI"],
    months:["JANVIER","FEVRIER","MARS","AVRIL","MAI","JUIN","JUILLET","AOUT","SEPTEMBRE","OCTOBRE","NOVEMBRE","DECEMBRE"]
    
}