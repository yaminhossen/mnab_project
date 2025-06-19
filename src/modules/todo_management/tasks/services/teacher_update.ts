import db from '../models/db';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { responseObject } from '../../../common_types/object';
import response from '../helpers/response';
import error_trace from '../helpers/error_trace';
import custom_error from '../helpers/custom_error';
import { InferCreationAttributes } from 'sequelize';

async function teacher_update(
    fastify_instance: FastifyInstance,
    req: FastifyRequest,
): Promise<responseObject> {
    let models = await db();
    let taskModel = new models.TasksModel();
    let taskUserModel = new models.TaskUsersModel();
    let params = req.params as any;
    console.log('teacher founded');
    let ssss = 'completed';

    let user = (req as any).user;
    let auth_user = await models.BranchTeachersModel.findOne({
        where: {
            user_teacher_id: (req as any).user?.id || null,
        },
    });

    try {
        let data = await models.TasksModel.findOne({
            where: {
                id: params.id,
            },
        });
        let data2 = await models.TaskUsersModel.findOne({
            where: {
                task_id: params.id,
                teacher_id: user?.id,
            },
        });

        if (data && data2) {
            let inputs: InferCreationAttributes<typeof taskModel> = {
                title: data.title,
                description: data.description,
                // is_complete: ssss || params?.is_complete,
                date: data.date,
            };
            (await data.update(inputs)).save();
            let inputs2: InferCreationAttributes<typeof taskUserModel> = {
                is_complete: ssss || params?.is_complete,
            };
            (await data.update(inputs)).save();
            (await data2.update(inputs2)).save();
            return response(200, 'data updated', data);
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

export default teacher_update;
