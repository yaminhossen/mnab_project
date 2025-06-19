import {
    // Model,
    Sequelize,
} from 'sequelize';
import * as branch_class_fees_model from './branch_class_fees_model';
import * as branch_classes_model from './branch_classes_model';
import * as branch_class_fee_types_model from './branch_class_fee_types_model';
import * as branch_admin_model from './branch_admin_model';
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
    BranchClassFeesModel: typeof branch_class_fees_model.DataModel;
    BranchClassesModel: typeof branch_classes_model.DataModel;
    BranchClassFeeTypesModel: typeof branch_class_fee_types_model.DataModel;
    BranchAdminsModel: typeof branch_admin_model.DataModel;
    // Project: typeof project_model.DataModel;
    sequelize: Sequelize;
}
const db = async function (): Promise<models> {
    const BranchClassFeesModel = branch_class_fees_model.init(sequelize);
    const BranchClassesModel = branch_classes_model.init(sequelize);
    const BranchClassFeeTypesModel =
        branch_class_fee_types_model.init(sequelize);
    const BranchAdminsModel = branch_admin_model.init(sequelize);
    // const Project = project_model.init(sequelize);

    await sequelize.sync();

    BranchClassFeesModel.hasOne(BranchClassesModel, {
        sourceKey: 'branch_class_id',
        foreignKey: 'id',
        as: 'class',
    });
    BranchClassFeesModel.hasOne(BranchClassFeeTypesModel, {
        sourceKey: 'fee_type_id',
        foreignKey: 'id',
        as: 'fee_types',
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
        BranchClassFeesModel,
        BranchClassesModel,
        BranchClassFeeTypesModel,
        BranchAdminsModel,
        // Project,

        sequelize,
    };
    return models;
};
export default db;
