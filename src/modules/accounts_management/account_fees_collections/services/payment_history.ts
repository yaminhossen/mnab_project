import db from '../models/db';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { responseObject } from '../../../common_types/object';
import response from '../helpers/response';
import error_trace from '../helpers/error_trace';
import custom_error from '../helpers/custom_error';

async function payment_history(
    fastify_instance: FastifyInstance,
    req: FastifyRequest,
): Promise<responseObject> {
    let models = await db();
    // let branchClassSubjectsModel = models.BranchClassSubjectsModel;
    // let branchClassRoutinesModel = models.BranchClassRoutinesModel;
    // let branchClassRoutineDayTimesModel =
    //     models.BranchClassRoutineDayTimesModel;
    // let branchTeachersModel = models.BranchTeachersModel;
    // let userTeachersModel = models.UserTeacherModel;
    let accountLogsModel = models.AccountLogsModel;
    let accountFeeCollectionsModel = models.AccountFeesCollectionsModel;
    let params = req.params as any;
    let user = (req as any).user;
    console.log('student id for payment', user);

    try {
        let data = await accountFeeCollectionsModel.findAll({
            where: {
                branch_student_id: user?.id,
            },
            include: [
                {
                    model: accountLogsModel,
                    as: 'payment',
                },
            ],
            // order: [['id', 'ASC']],
        });
        // console.log('data', data);

        if (data) {
            return response(200, 'data founded', data);
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

export default payment_history;
