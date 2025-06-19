import {
    // Model,
    Sequelize,
} from 'sequelize';
import * as teacher_overall_evaluations_model from './teacher_overall_evaluations_model';
import * as user_teacher_model from './user_teacher_model';
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
    TeacherOverallEvaluationsModel: typeof teacher_overall_evaluations_model.DataModel;
    UserTeachersModel: typeof user_teacher_model.DataModel;
    // Project: typeof project_model.DataModel;
    sequelize: Sequelize;
}
const db = async function (): Promise<models> {
    const TeacherOverallEvaluationsModel =
        teacher_overall_evaluations_model.init(sequelize);
    const UserTeachersModel = user_teacher_model.init(sequelize);
    // const Project = project_model.init(sequelize);

    await sequelize.sync();

    TeacherOverallEvaluationsModel.hasOne(UserTeachersModel, {
        sourceKey: 'branch_teacher_id',
        foreignKey: 'id',
        as: 'teacher',
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
        TeacherOverallEvaluationsModel,
        UserTeachersModel,
        // Project,

        sequelize,
    };
    return models;
};
export default db;
