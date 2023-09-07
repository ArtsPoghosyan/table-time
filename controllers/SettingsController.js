const TableModel = require("../models/TableTimeModel");
const {updateWeekDays, updateWeekDayName, updateWeekDayHours, updateWeekDayHoursInfo,updateWorkDayName, generateWorkTime} = require("../componets/generateWeekInfo.js");

class SettingsController {
    static updateTableInfo = async (uid, req, res, next)=>{
        try{
            const { name, year, tableId } = req.body;
            const objOption = {};
            if(name) objOption.name = name;
            if(year) objOption.year = year;

            const table = await TableModel.updateTable({_id: tableId, userId: uid}, objOption);
            return res.json({table});
        }catch(err){
            return next(err);
        }
    }
    static updateTableDays = async (uid, req, res, next)=>{
        try{
            const { daysCount, tableId } = req.body;
            if(+daysCount < 1 || +daysCount > 7){
                return res.json({errorMessage: "week days count cann't be small from 1 and big from 7"});
            }
            const table = await TableModel.getTableById(tableId, uid);
            if(+table.weekDaysCount === +daysCount){
                return res.json({table});
            }
            const weekDays = updateWeekDays({oldWeekDays: table.weekDays, newWeekDaysCount: daysCount, oldWeekDaysCount: table.weekDaysCount});
            const workTime = generateWorkTime({weekDays});
            const teachers = table.teachers.map((evt)=> ({...evt, workTime}));
            const classes = table.classes.map((evt)=> ({...evt, workTime}));
            const subjects = table.subjects.map((evt)=> ({...evt, workTime}));
            const classRooms = table.classRooms.map((evt)=> ({...evt, workTime}));
            const newTable = await TableModel.updateTable({_id: tableId, userId: uid}, {weekDays, weekDaysCount: daysCount, teachers, subjects, classes, classRooms});
            return res.json({table: newTable});
        }catch(err){
            return next(err);
        }
    }
    static updateTableDayName = async (uid, req, res, next)=>{
        try{
            const { oldDayName, newDayName, newShortName, tableId } = req.body;
            const table = await TableModel.getTableById(tableId, uid);
            const weekDays = updateWeekDayName({oldWeekDays: table.weekDays, oldDayName, newDayName, newShortName});
            const workTime = updateWorkDayName({oldWeekDays: table.weekDays, oldDayName, newDayName, newShortName});
            const teachers = table.teachers.map((evt)=> ({...evt, workTime}));
            const classes = table.classes.map((evt)=> ({...evt, workTime}));
            const subjects = table.subjects.map((evt)=> ({...evt, workTime}));
            const classRooms = table.classRooms.map((evt)=> ({...evt, workTime}));
            const newTable = await TableModel.updateTable({_id: tableId, userId: uid}, {weekDays, teachers, subjects, classes, classRooms});
            return res.json({table: newTable});
        }catch(err){
            return next(err);
        }
    }
    static updateTableDaysHours = async (uid, req, res, next)=>{
        try{
            const { tableId, newHoursCount } = req.body;
            if(+newHoursCount < 1 || +newHoursCount > 31){
                return res.json({errorMessage: "day hours count cann't be small from 1 and big from 31"});
            }
            const table = await TableModel.getTableById(tableId, uid);
            if(table.daysHours === newHoursCount){
                return res.json({table});
            }
            const weekDays = updateWeekDayHours({oldHoursCount: table.daysHours, newHoursCount, weekDays: table.weekDays});
            const workTime = generateWorkTime({weekDays});
            const teachers = table.teachers.map((evt)=> ({...evt, workTime}));
            const classes = table.classes.map((evt)=> ({...evt, workTime}));
            const subjects = table.subjects.map((evt)=> ({...evt, workTime}));
            const classRooms = table.classRooms.map((evt)=> ({...evt, workTime}));
            const newTable = await TableModel.updateTable({_id: tableId, userId: uid}, {weekDays, daysHours: newHoursCount, teachers, subjects, classes, classRooms});
            return res.json({table: newTable});
        }catch(err){
            return next(err);
        }
    }
    static updateTableDaysHourInfo = async (uid, req, res, next)=>{
        try{
            const { tableId, id, newName, shortName, newTimeStart, newTimeEnd } = req.body;
            const table = await TableModel.getTableById(tableId, uid);
            const weekDays = updateWeekDayHoursInfo({oldWeekDays: table.weekDays, id, newName, shortName, newTimeStart, newTimeEnd});
            const workTime = generateWorkTime({weekDays});
            const teachers = table.teachers.map((evt)=> ({...evt, workTime}));
            const classes = table.classes.map((evt)=> ({...evt, workTime}));
            const subjects = table.subjects.map((evt)=> ({...evt, workTime}));
            const classRooms = table.classRooms.map((evt)=> ({...evt, workTime}));
            const newTable = await TableModel.updateTable({_id: tableId, userId: uid}, {weekDays, teachers, subjects, classes, classRooms});
            return res.json({table: newTable});
        }catch(err){
            return next(err);
        }
    }
}

module.exports = SettingsController;