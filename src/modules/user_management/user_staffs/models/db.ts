import {
    // Model,
    Sequelize,
} from 'sequelize';
import * as user_staffs_model from './user_staffs_model';
import * as user_staff_informations_model from './user_staff_informations_model';
import * as branch_staffs_model from './branch_staffs_model';
import * as branch_admins_model from './branch_admins_model';
import * as task_users_model from './task_users_model';
import * as branches_model from './branches_model';
import * as user_admins_model from './user_admins_model';
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
    UserStaffsModel: typeof user_staffs_model.DataModel;
    UserStaffInformationsModel: typeof user_staff_informations_model.DataModel;
    BranchStaffsModel: typeof branch_staffs_model.DataModel;
    BranchAdminsModel: typeof branch_admins_model.DataModel;
    TaskUsersModel: typeof task_users_model.DataModel;
    BranchesModel: typeof branches_model.DataModel;
    UserAdminsModel: typeof user_admins_model.DataModel;
    // Project: typeof project_model.DataModel;
    sequelize: Sequelize;
}
const db = async function (): Promise<models> {
    const UserStaffsModel = user_staffs_model.init(sequelize);
    const UserStaffInformationsModel =
        user_staff_informations_model.init(sequelize);
    const BranchStaffsModel = branch_staffs_model.init(sequelize);
    const BranchAdminsModel = branch_admins_model.init(sequelize);
    const TaskUsersModel = task_users_model.init(sequelize);
    const BranchesModel = branches_model.init(sequelize);
    const UserAdminsModel = user_admins_model.init(sequelize);
    // const Project = project_model.init(sequelize);

    await sequelize.sync();

    UserStaffsModel.hasOne(UserStaffInformationsModel, {
        sourceKey: 'id',
        foreignKey: 'user_staff_id',
        as: 'staff_infos',
    });

    UserStaffsModel.hasOne(BranchStaffsModel, {
        sourceKey: 'id',
        foreignKey: 'user_staff_id',
        as: 'staffs',
    });
    UserStaffsModel.hasOne(TaskUsersModel, {
        sourceKey: 'id',
        foreignKey: 'staff_id',
        as: 'taskstaffs',
    });
    BranchStaffsModel.hasOne(BranchesModel, {
        sourceKey: 'branch_id',
        foreignKey: 'id',
        as: 'branch',
    });

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
        UserStaffsModel,
        UserStaffInformationsModel,
        BranchStaffsModel,
        BranchAdminsModel,
        TaskUsersModel,
        BranchesModel,
        UserAdminsModel,
        // Project,

        sequelize,
    };
    return models;
};
export default db;
