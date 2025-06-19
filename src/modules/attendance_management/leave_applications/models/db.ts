import {
    // Model,
    Sequelize,
} from 'sequelize';
import * as leave_applications_model from './leave_applications_model';
import * as user_student_informations_model from './user_student_informations_model';
import * as branch_staffs_model from './branch_staffs_model';
import * as branch_teachers_model from './branch_teachers_model';
import * as leave_types_model from './leave_types_model';
import * as user_students_model from './user_students_model';
import * as user_staffs_model from './user_staffs_model';
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
    LeaveApplicationsModel: typeof leave_applications_model.DataModel;
    UserStudentInformationsModel: typeof user_student_informations_model.DataModel;
    BranchStaffsModel: typeof branch_staffs_model.DataModel;
    BranchTeachersModel: typeof branch_teachers_model.DataModel;
    LeaveTypesModel: typeof leave_types_model.DataModel;
    UserStudentsModel: typeof user_students_model.DataModel;
    UserStaffsModel: typeof user_staffs_model.DataModel;
    UserTeachersModel: typeof user_teacher_model.DataModel;
    // Project: typeof project_model.DataModel;
    sequelize: Sequelize;
}
const db = async function (): Promise<models> {
    const LeaveApplicationsModel = leave_applications_model.init(sequelize);
    const UserStudentInformationsModel =
        user_student_informations_model.init(sequelize);
    const BranchStaffsModel = branch_staffs_model.init(sequelize);
    const BranchTeachersModel = branch_teachers_model.init(sequelize);
    const LeaveTypesModel = leave_types_model.init(sequelize);
    const UserStudentsModel = user_students_model.init(sequelize);
    const UserStaffsModel = user_staffs_model.init(sequelize);
    const UserTeachersModel = user_teacher_model.init(sequelize);
    // const Project = project_model.init(sequelize);

    await sequelize.sync();

    LeaveApplicationsModel.hasOne(LeaveTypesModel, {
        sourceKey: 'leave_type_id',
        foreignKey: 'id',
        as: 'leave_type',
    });

    LeaveApplicationsModel.hasOne(UserStudentsModel, {
        sourceKey: 'branch_student_id',
        foreignKey: 'id',
        as: 'student',
    });

    LeaveApplicationsModel.hasOne(UserStaffsModel, {
        sourceKey: 'branch_staff_id',
        foreignKey: 'id',
        as: 'staff',
    });

    LeaveApplicationsModel.hasOne(UserTeachersModel, {
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
        LeaveApplicationsModel,
        UserStudentInformationsModel,
        BranchStaffsModel,
        BranchTeachersModel,
        LeaveTypesModel,
        UserStudentsModel,
        UserStaffsModel,
        UserTeachersModel,
        // Project,

        sequelize,
    };
    return models;
};
export default db;
