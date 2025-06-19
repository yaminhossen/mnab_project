import {
    // Model,
    Sequelize,
} from 'sequelize';
import * as branch_class_fee_waivers_model from './branch_class_fee_waivers_model';
import * as branch_admin_model from './branch_admin_model';
import * as branch_classes_model from './branch_classes_model';
import * as branch_class_fees_model from './branch_class_fees_model';
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
    BranchClassFeeWaiversModel: typeof branch_class_fee_waivers_model.DataModel;
    BranchAdminsModel: typeof branch_admin_model.DataModel;
    BranchClassesModel: typeof branch_classes_model.DataModel;
    BranchClassFeesModel: typeof branch_class_fees_model.DataModel;
    // Project: typeof project_model.DataModel;
    sequelize: Sequelize;
}
const db = async function (): Promise<models> {
    const BranchClassFeeWaiversModel =
        branch_class_fee_waivers_model.init(sequelize);
    const BranchAdminsModel = branch_admin_model.init(sequelize);
    const BranchClassesModel = branch_classes_model.init(sequelize);
    const BranchClassFeesModel = branch_class_fees_model.init(sequelize);
    // const Project = project_model.init(sequelize);

    await sequelize.sync();

    BranchClassFeeWaiversModel.hasOne(BranchClassesModel, {
        sourceKey: 'branch_class_id',
        foreignKey: 'id',
        as: 'class',
    });

    BranchClassFeeWaiversModel.hasOne(BranchClassFeesModel, {
        sourceKey: 'branch_class_fee_id',
        foreignKey: 'id',
        as: 'class_fee',
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
        BranchClassFeeWaiversModel,
        BranchAdminsModel,
        BranchClassesModel,
        BranchClassFeesModel,
        // Project,

        sequelize,
    };
    return models;
};
export default db;
