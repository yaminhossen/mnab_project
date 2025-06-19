import db from '../models/db';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { responseObject } from '../../../common_types/object';
import response from '../helpers/response';
import error_trace from '../helpers/error_trace';
import custom_error from '../helpers/custom_error';

async function assignment_wise_sub(
    fastify_instance: FastifyInstance,
    req: FastifyRequest,
): Promise<responseObject> {
    let models = await db();
    let params = req.params as any;
    let user = (req as any).user;

    try {
        let data1 = await models.UserStudentInformationsModel.findOne({
            where: {
                user_student_id: user?.id,
            },
        });

        let data = await models.AssignmentsModel.findAll({
            where: {
                class_id: data1?.s_class,
            },
            include: [
                {
                    model: models.BranchClassSubjecsModel,
                    as: 'subject',
                },
            ],
            attributes: {
                exclude: ['password'],
            },
        });

        // Declare type-safe array
        let uniqueAssignments: InstanceType<typeof models.AssignmentsModel>[] =
            [];
        let uniqueSubjectsMap = new Map<number, boolean>();

        data.forEach((item) => {
            if (!uniqueSubjectsMap.has(item.subject_id || 0)) {
                uniqueSubjectsMap.set(item.subject_id || 0, true);
                uniqueAssignments.push(item);
            }
        });

        if (uniqueAssignments.length > 0) {
            return response(200, 'data fetched', uniqueAssignments);
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

export default assignment_wise_sub;
