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

async function class_wise_subject(
    fastify_instance: FastifyInstance,
    req: FastifyRequest,
): Promise<responseObject> {
    let models = await db();
    let params = req.params as any;
    let user = (req as any).user;
    console.log(
        'oklk----------------------------------.----------------------------------------------------------',
    );
    const { Sequelize } = require('sequelize');

    try {
        let data = await models.BranchClassSubjectTeachersModel.findAll({
            attributes: [
                'branch_class_subject_id',
                [
                    Sequelize.fn(
                        'COUNT',
                        Sequelize.col('branch_class_subject_id'),
                    ),
                    'count',
                ],
                [Sequelize.col('bb_sub.id'), 'id'],
                [Sequelize.col('bb_sub.name'), 'name'],
            ],
            where: {
                branch_class_id: params.id,
                branch_teacher_id: user?.id,
            },
            include: [
                {
                    model: models.BranchClassSubjecsModel,
                    as: 'bb_sub',
                },
            ],
            group: ['branch_class_subject_id'],
            order: [['branch_class_subject_id', 'ASC']],
            raw: true,
        });

        if (data) {
            return response(200, 'data found', data);
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

export default class_wise_subject;
