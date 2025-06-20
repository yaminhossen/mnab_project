import db from '../models/db';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { responseObject, anyObject } from '../../../common_types/object';
import response from '../helpers/response';
import error_trace from '../helpers/error_trace';
import custom_error from '../helpers/custom_error';
import { Op } from 'sequelize';

async function payment_history_auth(
    fastify_instance: FastifyInstance,
    req: FastifyRequest,
): Promise<responseObject> {
    let models = await db();
    let body = req.body as anyObject;
    let accountCategoriesModel = models.AccountCategoriesModel;
    let accountLogsModel = models.AccountLogsModel;
    let params = req.params as any;
    let user = (req as any).user;

    // Use the values from the request body or set default values
    let month1 = body.month1 || '2024-09-12'; // Start date
    let month2 = body.month2 || '2024-09-22'; // End date

    // Add one day to month2
    const endDate = new Date(month2);
    endDate.setDate(endDate.getDate() + 1); // Increment by one day
    const formattedEndDate = endDate.toISOString().split('T')[0]; // Format to YYYY-MM-DD
    console.log('payment studnet id', params.id);

    try {
        let data = await models.AccountFeeCollectionsModel.findAll({
            where: {
                date: {
                    [Op.between]: [month1, formattedEndDate],
                },
                branch_student_id: user?.id,
            },
            include: [
                {
                    model: accountCategoriesModel,
                    as: 'colection_category',
                },
                {
                    model: accountLogsModel,
                    as: 'colection_logs',
                },
            ],
            order: [['date', 'ASC']],
            // limit: 5,
        });

        // Initialize data2 object
        let data2 = {
            total_income: 0,
            total_income_query_days: 0,
            total_income_query_previous_days: 0,
        };

        // Calculate total income and total expense for the filtered dates
        data2.total_income = await models.AccountFeeCollectionsModel.sum(
            'amount',
            {
                where: {
                    branch_student_id: user?.id,
                },
            },
        );

        // Sum the amounts from the filtered data based on type
        data.forEach((log) => {
            const amount = log.amount ?? 0; // Default to 0 if undefined
            data2.total_income_query_days += amount;
        });

        // Calculate previous totals before month1
        data2.total_income_query_previous_days =
            await models.AccountFeeCollectionsModel.sum('amount', {
                where: {
                    branch_student_id: user?.id,
                    date: {
                        [Op.lt]: month1, // Less than month1
                    },
                },
            });

        if (data) {
            return response(200, 'data created', { data, data2 });
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

export default payment_history_auth;
