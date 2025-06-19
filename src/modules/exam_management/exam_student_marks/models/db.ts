import {
    // Model,
    Sequelize,
} from 'sequelize';
import * as exam_student_marks_model from './exam_student_marks_model';
import * as exams_model from './exams_model';
import * as branch_class_subjects_model from './branch_class_subjects_model';
import * as branch_classes_model from './branch_classes_model';
// import * as project_model from '../../user_admin copy/models/project_model';
require('dotenv').config();

let host = process?.env.DB_HOST || '';
let post = process?.env.DB_PORT || '';
let user = process?.env.DB_USER || '';
let pass = process?.env.DB_PASSWORD || '';
let database = process?.env.DB_DATABASE || '';

const sequelize = new Sequelize(
    `mysql://${user}:${pass}@${host}:${post}/${database}`,
    {
        logging: false,
    },
);

interface models {
    ExamStudentMarksModel: typeof exam_student_marks_model.DataModel;
    ExamsModel: typeof exams_model.DataModel;
    BranchClassSubjectsModel: typeof branch_class_subjects_model.DataModel;
    BranchClassesModel: typeof branch_classes_model.DataModel;
    // Project: typeof project_model.DataModel;
    sequelize: Sequelize;
}
const db = async function (): Promise<models> {
    const ExamStudentMarksModel = exam_student_marks_model.init(sequelize);
    const ExamsModel = exams_model.init(sequelize);
    const BranchClassSubjectsModel =
        branch_class_subjects_model.init(sequelize);
    const BranchClassesModel = branch_classes_model.init(sequelize);
    // const Project = project_model.init(sequelize);

    await sequelize.sync();

    ExamStudentMarksModel.hasOne(ExamsModel, {
        sourceKey: 'exam_id',
        foreignKey: 'id',
        as: 'exams',
    });

    ExamStudentMarksModel.hasOne(BranchClassSubjectsModel, {
        sourceKey: 'subject_id',
        foreignKey: 'id',
        as: 'subject',
    });
    ExamStudentMarksModel.hasOne(BranchClassesModel, {
        sourceKey: 'class_id',
        foreignKey: 'id',
        as: 'a_class',
    });

    let models: models = {
        ExamStudentMarksModel,
        ExamsModel,
        BranchClassSubjectsModel,
        BranchClassesModel,
        // Project,

        sequelize,
    };
    return models;
};
export default db;
