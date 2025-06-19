import { Sequelize } from 'sequelize';
import * as branch_class_routine_day_times_model from './branch_class_routine_day_times_model';
import * as branch_class_subject_teachers_model from './branch_class_subject_teachers_model';
import * as branch_building_rooms_model from './branche_building_rooms_model';
import * as branch_class_subjects_model from './branch_class_subjects_model';
import * as branch_class_teachers_model from './user_teacher_model';
import * as branch_classes_model from './branch_classes_model';
require('dotenv').config();

let host = process?.env.DB_HOST || '';
let port = process?.env.DB_PORT || '';
let user = process?.env.DB_USER || '';
let pass = process?.env.DB_PASSWORD || '';
let database = process?.env.DB_DATABASE || '';

const sequelize = new Sequelize(
    `mysql://${user}:${pass}@${host}:${port}/${database}`,
    {
        logging: false,
    },
);

interface models {
    BranchClassRoutineDayTimesModel: typeof branch_class_routine_day_times_model.DataModel;
    BranchClassSubjectTeachersModel: typeof branch_class_subject_teachers_model.DataModel;
    BranchBuildingRoomsModel: typeof branch_building_rooms_model.DataModel;
    BranchClassSubjectsModel: typeof branch_class_subjects_model.DataModel;
    BranchClassTeachersModel: typeof branch_class_teachers_model.DataModel;
    BranchClassesModel: typeof branch_classes_model.DataModel;
    sequelize: Sequelize;
}

const db = async function (): Promise<models> {
    const BranchClassRoutineDayTimesModel =
        branch_class_routine_day_times_model.init(sequelize);
    const BranchClassSubjectTeachersModel =
        branch_class_subject_teachers_model.init(sequelize);
    const BranchBuildingRoomsModel =
        branch_building_rooms_model.init(sequelize);
    const BranchClassSubjectsModel =
        branch_class_subjects_model.init(sequelize);
    const BranchClassTeachersModel =
        branch_class_teachers_model.init(sequelize);
    const BranchClassesModel = branch_classes_model.init(sequelize);

    await sequelize.sync();

    // Define associations
    BranchClassRoutineDayTimesModel.belongsTo(BranchClassTeachersModel, {
        foreignKey: 'branch_teacher_id',
        as: 'teacher',
    });

    // Each routine slot belongs to a subject
    BranchClassRoutineDayTimesModel.belongsTo(BranchClassSubjectsModel, {
        foreignKey: 'branch_class_subject_id',
        as: 'subject',
    });

    // Each routine slot belongs to a room
    BranchClassRoutineDayTimesModel.belongsTo(BranchBuildingRoomsModel, {
        foreignKey: 'branch_class_room_id',
        as: 'room',
    });

    // Each routine slot belongs to a class (via branch_class_id, assuming branch_class_routine_id relates to BranchClassesModel)
    BranchClassRoutineDayTimesModel.belongsTo(BranchClassesModel, {
        foreignKey: 'branch_class_id',
        as: 'class',
    });

    // BranchClassTeachersModel relationships
    // Each teacher belongs to a class
    BranchClassTeachersModel.belongsTo(BranchClassesModel, {
        foreignKey: 'branch_class_id',
        as: 'class',
    });

    // BranchClassSubjectsModel relationships
    // Each subject belongs to a class
    BranchClassSubjectsModel.belongsTo(BranchClassesModel, {
        foreignKey: 'branch_class_id',
        as: 'class',
    });

    // BranchClassSubjectTeachersModel relationships
    // Each subject-teacher assignment belongs to a class
    BranchClassSubjectTeachersModel.belongsTo(BranchClassesModel, {
        foreignKey: 'branch_class_id',
        as: 'class',
    });

    // Each subject-teacher assignment belongs to a teacher
    BranchClassSubjectTeachersModel.belongsTo(BranchClassTeachersModel, {
        foreignKey: 'branch_teacher_id',
        as: 'teacher',
    });

    // Each subject-teacher assignment belongs to a subject
    BranchClassSubjectTeachersModel.belongsTo(BranchClassSubjectsModel, {
        foreignKey: 'branch_class_subject_id',
        as: 'subject',
    });

    let models: models = {
        BranchClassRoutineDayTimesModel,
        BranchClassSubjectTeachersModel,
        BranchBuildingRoomsModel,
        BranchClassSubjectsModel,
        BranchClassTeachersModel,
        BranchClassesModel,
        sequelize,
    };
    return models;
};

export default db;
