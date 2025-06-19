import db from '../models/db';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { responseObject } from '../../../common_types/object';
import response from '../helpers/response';
import error_trace from '../helpers/error_trace';
import custom_error from '../helpers/custom_error';

// async function details(
//     fastify_instance: FastifyInstance,
//     req: FastifyRequest,
// ): Promise<responseObject> {
//     throw new Error('500 test');
// }

async function class_routine_auth(
    fastify_instance: FastifyInstance,
    req: FastifyRequest,
): Promise<responseObject> {
    let models = await db();
    let branch_class_routine_day_times_model =
        models.BranchClassRoutineDayTimesModel;
    let branch_class_subjects_model = models.BranchClassSubjecsModel;
    let branch_building_rooms_model = models.BranchBuildingRoomsModel;
    let branch_teachers_model = models.BranchTeachersModel;
    let user_teachers_model = models.UserTeachersModel;
    let params = req.params as any;
    let body = req.body as any;
    let user = (req as any).user;
    console.log('body', req.body);

    try {
        let data1 = await models.UserStudentInformationsModel.findOne({
            where: {
                user_student_id: user?.id,
            },
        });
        let data = await models.BranchClassRoutinesModel.findAll({
            where: {
                branch_class_id: data1?.s_class,
                branch_class_section_id: data1?.section || 0,
                status: 'active',
            },
            include: [
                {
                    model: branch_class_subjects_model,
                    as: 'subject',
                },
                {
                    model: branch_class_routine_day_times_model,
                    as: 'routines',
                    separate: true, // Important for hasMany to allow order inside include
                    order: [['day_no', 'ASC']],
                    include: [
                        {
                            model: branch_teachers_model,
                            as: 'b_teacher',
                            include: [
                                {
                                    model: user_teachers_model,
                                    as: 'teacher',
                                },
                            ],
                        },
                        {
                            model: branch_building_rooms_model,
                            as: 'room',
                        },
                    ],
                },
            ],
        });

        let s_class = await models.BranchClassesModel.findOne({
            where: {
                id: data1?.s_class,
            },
        });
        let section = await models.BranchClassSectionsModel.findOne({
            where: {
                id: data1?.section || 0,
            },
        });

        if (data) {
            return response(200, 'data found', { data, s_class, section });
        } else {
            throw new custom_error('not found', 404, 'data not found');
        }
    } catch (error: any) {
        let uid = await error_trace(models, error, req.url, req.params);
        if (error instanceof custom_error) {
            error.uid = uid;
        } else {
            throw new custom_error('server error', 500, error.message, uid);
        }
        throw error;
    }
}

export default class_routine_auth;
