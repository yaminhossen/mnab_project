import {
    // Model,
    Sequelize,
} from 'sequelize';
import * as assignments_model from './assignments_model';
import * as branch_class_subjects_model from './branch_class_subjects_model';
import * as branch_teachers_model from './branch_teachers_model';
import * as user_student_informations_model from './user_student_informations_model';
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
    AssignmentsModel: typeof assignments_model.DataModel;
    BranchClassSubjecsModel: typeof branch_class_subjects_model.DataModel;
    BranchTeachersModel: typeof branch_teachers_model.DataModel;
    UserStudentInformationsModel: typeof user_student_informations_model.DataModel;
    // Project: typeof project_model.DataModel;
    sequelize: Sequelize;
}
const db = async function (): Promise<models> {
    const AssignmentsModel = assignments_model.init(sequelize);
    const BranchClassSubjecsModel = branch_class_subjects_model.init(sequelize);
    const BranchTeachersModel = branch_teachers_model.init(sequelize);
    const UserStudentInformationsModel =
        user_student_informations_model.init(sequelize);
    // const Project = project_model.init(sequelize);

    await sequelize.sync();

    AssignmentsModel.hasOne(BranchClassSubjecsModel, {
        sourceKey: 'subject_id',
        foreignKey: 'id',
        as: 'subject',
    });

    // User.hasMany(Project, {
    //     sourceKey: 'id',
    //     foreignKey: 'user_id',
    //     as: 'projects',
    // });

    // User.hasOne(Project, {
    //     sourceKey: 'id',
    //     foreignKey: 'user_id',
    //     as: 'project',
    // });

    // Project.belongsToMany(User, {
    //     through: 'project_user',
    // });
    // User.belongsToMany(Project, {
    //     through: 'project_user',
    // });

    let models: models = {
        AssignmentsModel,
        BranchTeachersModel,
        UserStudentInformationsModel,
        BranchClassSubjecsModel,
        // Project,

        sequelize,
    };
    return models;
};
export default db;
