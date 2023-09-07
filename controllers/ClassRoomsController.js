const TableModel = require("../models/TableTimeModel");
const {generateWorkTime} = require("../componets/generateWeekInfo.js");

class ClassRoomsController {
    static createClassRoom = async (uid, req, res, next)=>{
        try{   
            const { longName, shortName, color=`rgba(${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 10)}, ${Math.floor(Math.random() * 10)})`, tableId } = req.body;
            const table = await TableModel.getTableById(tableId, uid);
            if(table){
                let {classRooms,weekDays} = table;
                const workTime = generateWorkTime({weekDays});
                classRooms.push({classRoomId: Date.now(), longName, shortName, color, wholeLessonsCount:0, lessonsCount:0, workTime});
                const newTable = await TableModel.updateTable({_id: tableId, userId: uid}, {classRooms});
                return res.json({table: newTable});
            }
            return res.json({errorMessage: "wrong table id"});
        }catch(err){
            return next(err);
        }
    }
    static updateClassRoom = async (uid, req, res, next)=>{
        try{   
            const { longName, shortName, color, classRoomId, tableId } = req.body;
            const table = await TableModel.getTableById(tableId, uid);
            if(table){
                const classRooms = table.classRooms.map((evt)=>{
                    if(+evt.classRoomId === +classRoomId){
                        const obj =  {};
                        if(longName) obj.longName = longName;
                        if(shortName) obj.shortName = shortName;
                        if(color) obj.color = color;
                        return {
                            ...evt,
                            ...obj
                        }
                    }
                    return evt;
                });
                const newTable = await TableModel.updateTable({_id: tableId, userId: uid}, {classRooms});
                return res.json({table: newTable});
            }
            return res.json({errorMessage: "wrong table id"});
        }catch(err){
            return next(err);
        }
    }
    static deleteClassRoom = async (uid, req, res, next)=>{
        try{   
            const { classRoomId, tableId } = req.body;
            const table = await TableModel.getTableById(tableId, uid);
            if(table){
                const classRooms = table.classRooms.filter((evt)=> +evt.classRoomId !== +classRoomId);
                const newTable = await TableModel.updateTable({_id: tableId, userId: uid}, {classRooms});
                return res.json({table: newTable});
            }
            return res.json({errorMessage: "wrong table id"});
        }catch(err){
            return next(err);
        }
    }
}

module.exports = ClassRoomsController;