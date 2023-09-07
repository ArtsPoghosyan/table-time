const TableModel = require("../models/TableTimeModel");
const {generateWorkTime} = require("../componets/generateWeekInfo.js");

class ClassesController {
    static createClass = async (uid, req, res, next)=>{
        try{   
            let { longName, shortName, color=`rgba(${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 10)}, ${Math.floor(Math.random() * 10)})`, classSupervisors="[]", tableId } = req.body;
            classSupervisors = JSON.parse(classSupervisors);
            const table = await TableModel.getTableById(tableId, uid);
            if(table){
                let {teachers, classes, weekDays} = table;
                const classId = Date.now();
                const workTime = generateWorkTime({weekDays});
                
                if(classSupervisors.length !== 0){
                    teachers = teachers.map((evt)=>{
                        if(classSupervisors.filter((e)=> +e === +evt.teacherId).length !== 0){
                            return {...evt,classIdWhoesSupervisor: [...evt.classIdWhoesSupervisor, classId]}
                        }
                        return evt;
                    });
                }
                classes.push({classId, longName, shortName, color, classSupervisors, wholeLessonsCount:0, workTime});
                const newTable = await TableModel.updateTable({_id: tableId, userId: uid}, {classes, teachers});
                return res.json({table: newTable});
            }
            return res.json({errorMessage: "wrong table id"});
        }catch(err){
            return next(err);
        }
    }
    static updateClass = async (uid, req, res, next)=>{
        try{   
            let { longName, shortName, color, classSupervisors="[]", classId, tableId } = req.body;
            classSupervisors = JSON.parse(classSupervisors);
            const table = await TableModel.getTableById(tableId, uid);
            if(table){
                const teachers = table.teachers.map((evt)=>{
                    if(classSupervisors.filter((e) => +e === +evt.teacherId).length !== 0){
                        const classIdWhoesSupervisor = evt.classIdWhoesSupervisor.filter((e) => +e !== +classId);
                        classIdWhoesSupervisor.push(classId);
                        return {...evt, classIdWhoesSupervisor}
                    }
                    return {...evt, classIdWhoesSupervisor: evt.classIdWhoesSupervisor.filter((e) => +e !== +classId)};
                });
                const classes = table.classes.map((evt)=>{
                    if(+evt.classId === +classId){
                        const obj = {};
                        if(longName) obj.longName = longName;
                        if(shortName) obj.shortName = shortName;
                        if(color) obj.color = color;
                        if(classSupervisors) obj.classSupervisors = classSupervisors;
                        return {
                            ...evt,
                            ...obj
                        }
                    }
                    return evt;
                });
                const newTable = await TableModel.updateTable({_id: tableId, userId: uid}, {classes, teachers});
                return res.json({table: newTable});
            }
            return res.json({errorMessage: "wrong table id"});
        }catch(err){
            return next(err);
        }
    }
    static deleteClass = async (uid, req, res, next)=>{
        try{   
            const { classId, tableId } = req.body;
            const table = await TableModel.getTableById(tableId, uid);
            if(table){
                let {teachers, lessons, subjects, classes, classRooms} = table;
                let sup;
                let lesson;
                classes = classes.filter((evt)=> {
                    if(+evt.classId !== +classId) return evt;
                    sup = evt
                });
                lessons = lessons.filter((evt)=> {
                    if(+evt.classId !== +classId) return evt;
                    lesson = evt;
                });
                if(sup && sup.classSupervisors && sup.classSupervisors.length !== 0){
                    teachers = teachers.map((evt) => ({ ...evt, classIdWhoesSupervisor: evt.classIdWhoesSupervisor.filter((e) => +e !== +sup.classId)}));
                }
                if(lesson){
                    teachers = teachers.map((evt) => +evt.teacherId === +lesson.teacherId ? {...evt, wholeLessonsCount: +evt.wholeLessonsCount - +lesson.lessonsCount} : evt);      
                    subjects = subjects.map((evt) => +evt.subjectId === +lesson.subjectId ? {...evt, wholeLessonsCount: +evt.wholeLessonsCount - +lesson.lessonsCount} : evt);
                    classRooms = classRooms.map((evt) => lesson.classRoomsId.filter((e) => +evt.classRoomId == +e).length !== 0 ? {...evt, wholeLessonsCount: +evt.wholeLessonsCount - +lesson.lessonsCount} : evt);
                    const newTable = await TableModel.updateTable({_id: tableId, userId: uid}, {subjects, teachers, classes, lessons, classRooms});
                    return res.json({table: newTable});
                }
                const newTable = await TableModel.updateTable({_id: tableId, userId: uid}, {classes, teachers});
                return res.json({table: newTable});
            }
            return res.json({errorMessage: "wrong table id"});
        }catch(err){
            return next(err);
        }
    }
}

module.exports = ClassesController;