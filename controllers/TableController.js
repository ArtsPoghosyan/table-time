const TableModel = require("../models/TableTimeModel");
const {generateWeekDaysWithHours} = require("../componets/generateWeekInfo.js");
class TableController {
    static getTables = async (uid, req, res, next)=>{
        try{
            const tables = await TableModel.getTablesByUserId(uid);
            return res.json({tables});
        }catch(err){
            return next(err);
        }
    }
    static getTableTime = async (uid, req, res, next)=>{
        try{
            const { tableId } = req.body;
            const table = await TableModel.getTableById(tableId, uid);
            if(table.userId == uid){
                return res.json({table});
            }
            return res.json({errorMessage: "this table don't belong your"});
        }catch(err){
            return next(err);
        }
    }
    static createTableTime = async (uid, req, res, next)=>{
        try{
            const weekDays = generateWeekDaysWithHours({});
            await TableModel.createTable({userId: uid, weekDays});
            const tables = await TableModel.getTablesByUserId(uid);
            return res.json({tables});
        }catch(err){
            return next(err);
        }
    }
    static deleteTableTime = async (uid, req, res, next)=>{
        try{
            const { tableId } = req.body;
            await TableModel.deleteTable(tableId, uid);
            const tables = await TableModel.getTablesByUserId(uid);
            return res.json({tables});
        }catch(err){
            return next(err);
        }
    }
}

module.exports = TableController;