import {
    // Model,
    Sequelize,
} from 'sequelize';
import * as academic_calendars_model from './academic_calendars_model';
import * as academic_calendar_event_types_model from './academic_calendar_event_types_model';
import * as branch_admin_model from './branch_admin_model';
import * as branch_staffs_model from './branch_staffs_model';
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
    AcademicCalendarsModel: typeof academic_calendars_model.DataModel;
    BranchAdminsModel: typeof branch_admin_model.DataModel;
    BranchStaffsModel: typeof branch_staffs_model.DataModel;
    AcademicCalendarEventTypesModel: typeof academic_calendar_event_types_model.DataModel;
    // Project: typeof project_model.DataModel;
    sequelize: Sequelize;
}
const db = async function (): Promise<models> {
    const AcademicCalendarsModel = academic_calendars_model.init(sequelize);
    const BranchAdminsModel = branch_admin_model.init(sequelize);
    const BranchStaffsModel = branch_staffs_model.init(sequelize);
    const AcademicCalendarEventTypesModel =
        academic_calendar_event_types_model.init(sequelize);
    // const Project = project_model.init(sequelize);

    await sequelize.sync();

    AcademicCalendarsModel.hasOne(AcademicCalendarEventTypesModel, {
        sourceKey: 'event_type_id',
        foreignKey: 'id',
        as: 'event',
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
        AcademicCalendarsModel,
        BranchAdminsModel,
        BranchStaffsModel,
        AcademicCalendarEventTypesModel,
        // Project,

        sequelize,
    };
    return models;
};
export default db;
