const weekDays = require("./defaultValues.js");
const {generateFewHours, generateHours, updateHoursName, generateWorkHours} = require("./generateHoursInfo.js");

function generateWeekDaysWithHours({weekDaysName=weekDays, weekDaysCount=5}){
    const hours = generateHours({});
    const arr = [];

    for(let i = 0; i < weekDaysCount; i++){
        arr.push({
            ...weekDaysName[i],
            hours
        });
    }
    return arr;
}

function updateWeekDays({weekDaysName=weekDays, oldWeekDays, newWeekDaysCount, oldWeekDaysCount}){
    if(newWeekDaysCount < oldWeekDaysCount){
        return oldWeekDays.filter((evt, i)=> (i + 1) <= newWeekDaysCount ? true : false) 
    }

    if(newWeekDaysCount <= 7){
        const hours = oldWeekDays[0].hours;
        const arr = oldWeekDays;

        for(let i = arr.length; i < newWeekDaysCount; i++){
            arr.push({
                ...weekDaysName[i],
                hours
            });
        }
        return arr;
    }
    return oldWeekDays;
}
function updateWeekDayName({oldWeekDays, oldDayName, newDayName, newShortName}){
    return oldWeekDays.map((evt)=> evt.name === oldDayName ? {...evt, name: newDayName, shortName: newShortName} : evt);
}
function updateWeekDayHoursInfo(data){
    const hours = updateHoursName({...data, oldHours: data.oldWeekDays[0].hours});
    console.log(data);
    return data.oldWeekDays.map((evt)=> ({...evt, hours}));
}
function updateWeekDayHours({oldHoursCount, newHoursCount, weekDays}){
    let hours;
    if(oldHoursCount > newHoursCount){
        hours = generateFewHours({lengthHours: newHoursCount, weekDaysHours: weekDays[0].hours});
    }
    if(oldHoursCount < newHoursCount){
        hours = generateHours({lengthHours: newHoursCount, initalHour: weekDays[0].hours});
    }
    return weekDays.map((evt)=> ({...evt, hours}));
}
function generateWorkTime({weekDays}){
    const hours = generateWorkHours({hours: weekDays[0].hours});
    return weekDays.map((evt)=> ({dayName: evt.name, dayShortName: evt.shortName, hours}));
}
function updateWorkDayName({oldWeekDays, oldDayName, newDayName, newShortName}){
    return oldWeekDays.map((evt)=> evt.name === oldDayName ? {...evt, dayName: newDayName, dayShortName: newShortName} : evt);
}


module.exports = {generateWeekDaysWithHours, updateWeekDays, updateWeekDayName, updateWeekDayHours, updateWeekDayHoursInfo, generateWorkTime, updateWorkDayName};