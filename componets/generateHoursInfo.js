const weekDays = require("./defaultValues");
function generateHours({durationHours=45, betweenHours=10, lengthHours=7, initalHour=[{id: 1, name: 1, shortName:1, timeStart: "08:10", timeEnd: "08:50"}]}){
    const arr = initalHour;

    for(let i = initalHour.length; i < lengthHours; i++){
        let x = arr[i - 1].timeEnd.split(":");
        let g = +x[1] + betweenHours;
        let timeStart = g >= 60 ? ((((+x[0] + 1) + "").length) <= 1 ? "0" + (+x[0] + 1) : (+x[0] + 1)) + ":" + (((g - 60) + "").length <= 1 ? "0" + (g - 60) : (g - 60)) : (((+x[0] + "").length) <= 1 ? "0" + +x[0] : +x[0]) + ":" + g; 

        let y = timeStart.split(":");
        let c = +y[1] + durationHours;
        let timeEnd = c >= 60 ? ((((+y[0] + 1) + "").length) <= 1 ? "0" + (+y[0] + 1) : (+y[0] + 1)) + ":" + (((c - 60) + "").length <= 1 ? "0" + (c - 60) : (c - 60)) : (((+y[0] + "").length) <= 1 ? "0" + +y[0] : +y[0]) + ":" + c; 
        arr.push({
            id: (i + 1),
            name: (i + 1),
            shortName: (i + 1),
            timeStart,
            timeEnd
        });
    }

    return arr;
}
function generateFewHours({lengthHours=1, weekDaysHours=[{id: 1, name: 1, shortName: 1, timeStart: "08:10", timeEnd: "08:50"}]}){
    return weekDaysHours.filter((evt)=>{
        if(evt.id && evt.id <= lengthHours){
            return evt;
        }
    });
}
function updateHoursName({oldHours, id, newName, shortName, newTimeStart, newTimeEnd}){
    return oldHours.map((evt) => +evt.id === +id ? {...evt, name: newName, shortName, timeStart: newTimeStart, timeEnd: newTimeEnd} : evt);
}
function generateWorkHours({hours}){
    return hours.map((evt) => ({hourId: evt.id, shortName: evt.shortName, state: "available"}));
}
module.exports = {generateHours, generateFewHours, updateHoursName, generateWorkHours};