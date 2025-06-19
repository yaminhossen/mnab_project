import db from '../models/db';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { responseObject } from '../../../common_types/object';
import response from '../helpers/response';
import error_trace from '../helpers/error_trace';
import custom_error from '../helpers/custom_error';

async function student_payment_historoy(
    fastify_instance: FastifyInstance,
    req: FastifyRequest,
): Promise<responseObject> {
    let models = await db();
    let feeCollectionDetailsModel = models.AccountFeesCollectionDetailsModel;
    let branchClassFeesModel = models.BranchClassFeesModel;
    let params = req.params as any;
    console.log('class', params.id);

    try {
        let data = await feeCollectionDetailsModel.findAll({
            where: {
                branch_student_id: params.id,
            },
            include: [
                {
                    model: branchClassFeesModel,
                    as: 'class_fees',
                },
            ],
            // order: [['id', 'ASC']],
        });
        // console.log('data', data);

        if (data.length > 0) {
            // Calculate the total fee amount
            const totalFeeAmount = data.reduce(
                (sum, item) => sum + (item.total || 0),
                0,
            );

            // Return the response
            return response(200, 'Data found', {
                total: data.length,
                totalFeeAmount,
                items: data,
            });
        } else {
            throw new custom_error(
                'Not found',
                404,
                'No payment history found',
            );
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

export default student_payment_historoy;
