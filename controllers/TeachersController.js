const TableModel = require("../models/TableTimeModel");
const {generateWorkTime} = require("../componets/generateWeekInfo.js");

class TeachersController {
    static createTeacher = async (uid, req, res, next)=>{
        try{   
            let { name, lastName, shortName, email="", phone="", classRoomsId="[]", gender="female", classIdWhoesSupervisor="[]", color=`rgba(${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 10)}, ${Math.floor(Math.random() * 10)})`, tableId } = req.body;
            classIdWhoesSupervisor = JSON.parse(classIdWhoesSupervisor);
            classRoomsId = JSON.parse(classRoomsId);

            const table = await TableModel.getTableById(tableId, uid);
            if(table){
                const teacherId = Date.now();
                let {classes, weekDays, teachers} = table;
                const workTime = generateWorkTime({weekDays});
                if(classIdWhoesSupervisor.length !== 0){
                    classes = classes.map((evt)=>{
                        if(classIdWhoesSupervisor.filter((e)=> +e === +evt.classId).length !== 0){
                            return {...evt, classSupervisors: [...evt.classSupervisors, teacherId]}
                        }
                        return evt;
                    });
                }
                teachers.push({teacherId, name, lastName, shortName, email, phone, classIdWhoesSupervisor, classRoomsId, gender, color, wholeLessonsCount:0, workTime});
                const newTable = await TableModel.updateTable({_id: tableId, userId: uid}, {classes, teachers});
                return res.json({table: newTable});
            }
            return res.json({errorMessage: "wrong table id"});
        }catch(err){
            return next(err);
        }
    }
    static updateTeacher = async (uid, req, res, next)=>{
        try{   
            let { teacherId, name, lastName, shortName, email, phone, classIdWhoesSupervisor="[]", classRoomsId="[]", gender, color, tableId } = req.body;
            classIdWhoesSupervisor = JSON.parse(classIdWhoesSupervisor);
            classRoomsId = JSON.parse(classIdWhoesSupervisor);

            const table = await TableModel.getTableById(tableId, uid);
            if(table){
                const classes = table.classes.map((evt)=>{
                    if(classIdWhoesSupervisor.filter((e) => +e === +evt.classId).length !== 0){
                        const classSupervisors = evt.classSupervisors.filter((e) => +e !== +teacherId);
                        classSupervisors.push(teacherId);
                        return {...evt, classSupervisors}
                    }
                    return {...evt, classSupervisors: evt.classSupervisors.filter((e) => +e !== +teacherId)};
                });
                const teachers = table.teachers.map((evt)=>{
                    if(+evt.teacherId === +teacherId){
                        const obj =  {};
                        if(name) obj.name = name;
                        if(lastName) obj.lastName = lastName;
                        if(shortName) obj.shortName = shortName;
                        if(email) obj.email = email;
                        if(phone) obj.phone = phone;
                        if(color) obj.color = color;
                        if(gender) obj.gender = gender;
                        if(classIdWhoesSupervisor) obj.classIdWhoesSupervisor = classIdWhoesSupervisor;
                        if(classRoomsId) obj.classRoomsId = classRoomsId;
                        
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
    static deleteTeacher = async (uid, req, res, next)=>{
        try{   
            const { teacherId, tableId } = req.body;
            const table = await TableModel.getTableById(tableId, uid);
            if(table){
                let {classes, lessons, subjects, teachers, classRooms} = table;
                let lesson;
                let teach;
                teachers = teachers.filter((evt)=> {
                    if(+evt.teacherId !== +teacherId) return evt;
                    teach = evt
                });
                lessons = lessons.filter((evt)=> {
                    if(+evt.teacherId !== +teacherId) return evt;
                    lesson = evt
                });
                if(teach && teach.classIdWhoesSupervisor && teach.classIdWhoesSupervisor.length !== 0){
                    classes = classes.map((evt) => ({...evt, classSupervisors: evt.classSupervisors.filter((e) => +e !== teach.teacherId)}));
                }
                if(lesson){
                    teachers = teachers.map((evt) => +evt.teacherId === +lesson.teacherId ? {...evt, wholeLessonsCount: +evt.wholeLessonsCount - +lesson.lessonsCount} : evt);
                    classes = classes.map((evt) => +evt.classId === +lesson.classId ? {...evt, wholeLessonsCount: +evt.wholeLessonsCount - +lesson.lessonsCount} : evt);
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

module.exports = TeachersController;