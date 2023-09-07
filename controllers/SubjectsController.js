const TableModel = require("../models/TableTimeModel");
const {generateWorkTime} = require("../componets/generateWeekInfo.js");

class SubjectController {
    static createSubject = async (uid, req, res, next)=>{
        try{   
            let { classRoomsId="[]", longName, shortName, color=`rgba(${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 10)}, ${Math.floor(Math.random() * 10)})`, tableId } = req.body;
            classRoomsId = JSON.parse(classRoomsId);
            const table = await TableModel.getTableById(tableId, uid);
            if(table){
                const subjectId = Date.now();
                const workTime = generateWorkTime({weekDays: table.weekDays});
                const subjects = table.subjects;

                subjects.push({subjectId, longName, shortName, color, classRoomsId, wholeLessonsCount:0, workTime});
                const newTable = await TableModel.updateTable({_id: tableId, userId: uid}, {subjects});
                return res.json({table: newTable});
            }
            return res.json({errorMessage: "wrong table id"});
        }catch(err){
            return next(err);
        }
    }
    static updateSubject = async (uid, req, res, next)=>{
        try{   
            let { longName, shortName, color, classRoomsId="[]", subjectId, tableId } = req.body;
            classRoomsId = JSON.parse(classRoomsId);

            const table = await TableModel.getTableById(tableId, uid);
            if(table){
                const subjects = table.subjects.map((evt)=>{
                    if(+evt.subjectId === +subjectId){
                        const obj =  {};
                        if(longName) obj.longName = longName;
                        if(shortName) obj.shortName = shortName;
                        if(color) obj.color = color;
                        if(classRoomsId) obj.classRoomsId = classRoomsId;
                        return { ...evt, ...obj };
                    }
                    return evt;
                });
                const newTable = await TableModel.updateTable({_id: tableId, userId: uid}, {subjects});
                return res.json({table: newTable});
            }
            return res.json({errorMessage: "wrong table id"});
        }catch(err){
            return next(err);
        }
    }
    static deleteSubject = async (uid, req, res, next)=>{
        try{   
            const { subjectId, tableId } = req.body;
            const table = await TableModel.getTableById(tableId, uid);
            if(table){
                let {lessons, teachers, classes, subjects, classRooms} = table;
                subjects = subjects.filter((evt)=> +evt.subjectId !== +subjectId);
                let lesson;
                lessons = lessons.filter((evt)=> {
                    if(+evt.subjectId !== +subjectId) return evt;
                    lesson = evt
                });
                if(lesson){
                    teachers = teachers.map((evt) => +evt.teacherId === +lesson.teacherId ? {...evt, wholeLessonsCount: +evt.wholeLessonsCount - +lesson.lessonsCount} : evt);
                    classes = classes.map((evt) => +evt.classId === +lesson.classId ? {...evt, wholeLessonsCount: +evt.wholeLessonsCount - +lesson.lessonsCount} : evt);
                    classRooms = classRooms.map((evt) => lesson.classRoomsId.filter((e) => +evt.classRoomId == +e).length !== 0 ? {...evt, wholeLessonsCount: +evt.wholeLessonsCount - +lesson.lessonsCount} : evt);
                    const newTable = await TableModel.updateTable({_id: tableId, userId: uid}, {subjects, teachers, classes, lessons, classRooms});
                    return res.json({table: newTable});
                }
                const newTable = await TableModel.updateTable({_id: tableId, userId: uid}, {subjects});
                return res.json({table: newTable});
            }
            return res.json({errorMessage: "wrong table id"});
        }catch(err){
            return next(err);
        }
    }
}

module.exports = SubjectController;