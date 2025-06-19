import db from '../models/db';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { responseObject } from '../../../common_types/object';
import response from '../helpers/response';
import error_trace from '../helpers/error_trace';
import custom_error from '../helpers/custom_error';

async function teacher_wise_class_routine(
    fastify_instance: FastifyInstance,
    req: FastifyRequest,
): Promise<responseObject> {
    let models = await db();
    let user = (req as any).user;

    try {
        // Step 1: Find matching records in branch_class_subject_teachers
        const teacherSubjects =
            await models.BranchClassSubjectTeachersModel.findAll({
                where: {
                    branch_teacher_id: user?.id, // Match with authenticated user ID
                },
                attributes: ['branch_class_subject_id', 'branch_class_id'],
                include: [
                    {
                        model: models.BranchClassesModel,
                        as: 'class',
                        attributes: ['id'],
                        required: false,
                    },
                ],
            });

        if (!teacherSubjects || teacherSubjects.length === 0) {
            throw new custom_error(
                'not found',
                404,
                'No subjects assigned to this teacher',
            );
        }

        // Extract branch_class_subject_ids for filtering
        const subjectIds = teacherSubjects.map(
            (ts: any) => ts.branch_class_subject_id,
        );

        // Step 2: Query branch_class_routine_day_times with filtered data
        const data = await models.BranchClassRoutineDayTimesModel.findAll({
            where: {
                branch_class_subject_id: subjectIds,
                branch_teacher_id: user?.id,
            },
            attributes: [
                'id',
                'branch_id',
                'branch_class_routine_id',
                'branch_teacher_id',
                'branch_class_subject_id',
                'branch_class_room_id',
                'day',
                'day_name',
                'day_no',
                'start_time',
                'end_time',
            ],
            include: [
                {
                    model: models.BranchClassTeachersModel,
                    as: 'teacher',
                    attributes: ['id', 'name', 'email'],
                    required: false,
                },
                {
                    model: models.BranchBuildingRoomsModel,
                    as: 'room',
                    attributes: ['id', 'room_code', 'room_name'],
                    required: false,
                },
                {
                    model: models.BranchClassSubjectsModel,
                    as: 'subject',
                    attributes: ['id', 'name', 'code'],
                    include: [
                        {
                            model: models.BranchClassesModel,
                            as: 'class',
                            attributes: ['id', 'name'],
                            required: false,
                        },
                    ],
                    required: false,
                },
            ],
            order: [
                // Sort by class id in ascending order
                [
                    { model: models.BranchClassSubjectsModel, as: 'subject' },
                    { model: models.BranchClassesModel, as: 'class' },
                    'id',
                    'ASC',
                ],
            ],
        });

        // Step 3: Map branch_class_id to each routine record
        const enhancedData = data.map((routine: any) => {
            const teacherSubject = teacherSubjects.find(
                (ts: any) =>
                    ts.branch_class_subject_id ===
                    routine.branch_class_subject_id,
            );
            return {
                ...routine.toJSON(),
                branch_class_id: teacherSubject
                    ? teacherSubject.branch_class_id
                    : null,
            };
        });

        if (enhancedData.length > 0) {
            return response(200, 'data found', enhancedData);
        } else {
            throw new custom_error('not found', 404, 'Class routine not found');
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

export default teacher_wise_class_routine;
