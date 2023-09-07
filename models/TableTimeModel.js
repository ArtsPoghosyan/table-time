const mongoose = require("../services/mongodb");

const TableSchema = new mongoose.Schema({
    userId: {
        type: Number,
        required: true
    },
    name: {
        type: String
    },
    year: {
        type: String
    },
    weekDaysCount: {
        type: Number,
        default: 5,
        required: true
    },
    daysHours: {
        type: Number,
        default: 7,
        required: true
    },
    weekDays: {
        type: Array,
        default: [],
        required: true
    },
    subjects: {
        type: Array,
        default: [],
        required: true
    },
    classes: {
        type: Array,
        default: [],
        required: true
    },
    teachers: {
        type: Array,
        default: [],
        required: true
    },
    classRooms: {
        type: Array,
        default: [],
        required: true
    },
    lessons: {
        type: Array,
        default: [],
        required: true
    }
}, {timestamps: true});
const TableM = mongoose.model("table", TableSchema);

class TableModel{
    static getTablesByUserId = async (userId) => await TableM.find({userId});
    static getTableById = async (_id, userId) => await TableM.findOne({_id, userId});
    static updateTable = async ({_id, userId}, data) => await TableM.findOneAndUpdate({_id, userId}, data, {new: true});
    static createTable = async (data) => await TableM.create(data);
    static deleteTable = async (_id, userId) => await TableM.findOneAndDelete({_id, userId});
}

module.exports = TableModel;
