const TableModel = require("../models/TableTimeModel");
const {generateWorkTime} = require("../componets/generateWeekInfo.js");

class LessonsController {
    static createLesson = async (uid, req, res, next)=>{
        try{   
            let { tableId, teacherId, subjectId, classId, classRoomsId="[]", lessonsCount=1 } = req.body;
            classRoomsId = JSON.parse(classRoomsId);
            if(tableId && teacherId && subjectId && classId){
                const table = await TableModel.getTableById(tableId, uid);
                if(table){
                    const subjects = table.subjects.map((evt) => +evt.subjectId === +subjectId ? {...evt, wholeLessonsCount: +evt.wholeLessonsCount + +lessonsCount} : evt);
                    const teachers = table.teachers.map((evt) => +evt.teacherId === +teacherId ? {...evt, wholeLessonsCount: +evt.wholeLessonsCount + +lessonsCount} : evt);
                    const classes = table.classes.map((evt) => +evt.classId === +classId ? {...evt, wholeLessonsCount: +evt.wholeLessonsCount + +lessonsCount} : evt);
                    const classRooms = table.classRooms.map((evt) => (classRoomsId.filter((e) => +e === +evt.classRoomId).length !== 0) ? {...evt, wholeLessonsCount: +evt.wholeLessonsCount + +lessonsCount} : evt);
                    const lessons = table.lessons;
                    lessons.push({lessonId: Date.now(), teacherId, subjectId, classId, classRoomsId, lessonsCount});
                    const newTable = await TableModel.updateTable({_id: tableId, userId: uid}, {lessons, subjects, teachers, classes, classRooms});
                    return res.json({table: newTable});
                }

                return res.json({errorMessage: "wrong table id"});
            }
            return res.json({errorMessage: "not full writed form for create lesson"});
        }catch(err){
            return next(err);
        }
    }
    static updateLesson = async (uid, req, res, next)=>{
        try{   
            let { lessonId, tableId, teacherId, subjectId, classId, classRoomsId="[]", lessonsCount } = req.body;
            classRoomsId = JSON.parse(classRoomsId);
            const table = await TableModel.getTableById(tableId, uid);
            if(table){
                let {teachers, subjects, classes, classRooms} = table;
                const lessons = table.lessons.map((evt)=>{
                    if(+evt.lessonId === +lessonId){

                        const obj =  {};
                        if(lessonsCount) {
                            obj.lessonsCount = lessonsCount;
                            teachers = teachers.map((e) => +evt.teacherId === +e.teacherId ? {...e, wholeLessonsCount: (+e.wholeLessonsCount - +evt.lessonsCount) + +lessonsCount} : e);
                            subjects = subjects.map((e) => +evt.subjectId === +e.subjectId ? {...e, wholeLessonsCount: (+e.wholeLessonsCount - +evt.lessonsCount) + +lessonsCount} : e);
                            classes = classes.map((e) => +evt.classId === +e.classId ? {...e, wholeLessonsCount: (+e.wholeLessonsCount - +evt.lessonsCount) + +lessonsCount} : e);
                            classRooms = classRooms.map((e) => classRoomsId.filter((ev) => +ev === +e.classRoomId).length !== 0 ? {...e, wholeLessonsCount: (+e.wholeLessonsCount - +evt.lessonsCount) + +lessonsCount} : e);
                        }
                        if(teacherId) {
                            obj.teacherId = teacherId;
                            teachers = teachers.map((e) => (+evt.teacherId === +e.teacherId) && (+e.teacherId === +teacherId) ? e : +evt.teacherId === +e.teacherId ? {...e, wholeLessonsCount: +e.wholeLessonsCount - (+lessonsCount || +evt.lessonsCount)} : +e.teacherId === +teacherId ? {...e, wholeLessonsCount: +e.wholeLessonsCount + (+lessonsCount || +evt.lessonsCount)} : e);
                        };
                        if(subjectId) {
                            obj.subjectId = subjectId;
                            subjects = subjects.map((e) => (+evt.subjectId === +e.subjectId) && (+e.subjectId === +subjectId) ? e : +evt.subjectId === +e.subjectId ? {...e, wholeLessonsCount: +e.wholeLessonsCount - (+lessonsCount || +evt.lessonsCount)} : +e.subjectId === +subjectId ? {...e, wholeLessonsCount: +e.wholeLessonsCount + (+lessonsCount || +evt.lessonsCount)} : e);
                        }
                        if(classId){ 
                            obj.classId = classId;
                            classes = classes.map((e) => (+evt.classId === +e.classId) && (+e.classId === +classId) ? e : +evt.classId === +e.classId ? {...e, wholeLessonsCount: +e.wholeLessonsCount - (+lessonsCount || +evt.lessonsCount)} : +e.classId === +classId ? {...e, wholeLessonsCount: +e.wholeLessonsCount + (+lessonsCount || +evt.lessonsCount)} : e);
                        };
                        if(classRoomsId) {
                            obj.classRoomsId = classRoomsId;
                            classRooms = classRooms.map((e) => classRoomsId.filter((ev) => +evt.classRoomsId.filter((even) => +even === +ev).length !== 0) ? {...e, wholeLessonsCount: +e.wholeLessonsCount - (+lessonsCount || +evt.lessonsCount)} : +e.classRoomsId.filter((even) => +even === +ev).length !== 0 ? {...e, wholeLessonsCount: +e.wholeLessonsCount + (+lessonsCount || +evt.lessonsCount)} : e);
                        }
                        return {
                            ...evt,
                            ...obj
                        }
                    }
                    return evt;
                });
                const newTable = await TableModel.updateTable({_id: tableId, userId: uid}, {lessons, teachers, subjects, classes, classRooms});
                return res.json({table: newTable});
            }
            return res.json({errorMessage: "wrong table id"});
        }catch(err){
            return next(err);
        }
    }
    static deleteLesson = async (uid, req, res, next)=>{
        try{   
            const { lessonId, tableId } = req.body;
            const table = await TableModel.getTableById(tableId, uid);
            if(table){
                let lesson;
                const lessons = table.lessons.filter((evt)=> {
                    if(+evt.lessonId !== +lessonId) return evt;
                    lesson = evt;
                });
                const subjects = table.subjects.map((evt) => evt.subjectId == lesson.subjectId ? {...evt, wholeLessonsCount: +evt.wholeLessonsCount - +lesson.lessonsCount} : evt);
                const teachers = table.teachers.map((evt) => evt.teacherId == lesson.teacherId ? {...evt, wholeLessonsCount: +evt.wholeLessonsCount - +lesson.lessonsCount} : evt);
                const classes = table.classes.map((evt) => evt.classId == lesson.classId ? {...evt, wholeLessonsCount: +evt.wholeLessonsCount - +lesson.lessonsCount} : evt);
                const classRooms = table.classRooms.map((evt) => lesson.classRoomsId.filter((e) => +evt.classRoomId == +e).length !== 0 ? {...evt, wholeLessonsCount: +evt.wholeLessonsCount - +lesson.lessonsCount} : evt);
                const newTable = await TableModel.updateTable({_id: tableId, userId: uid}, {lessons, subjects, teachers, classes, classRooms});
                return res.json({table: newTable});
            }
            return res.json({errorMessage: "wrong table id"});
        }catch(err){
            return next(err);
        }
    }
}

module.exports = LessonsController;