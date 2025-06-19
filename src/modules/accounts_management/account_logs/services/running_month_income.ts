import db from '../models/db';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { responseObject, anyObject } from '../../../common_types/object';
import response from '../helpers/response';
import error_trace from '../helpers/error_trace';
import custom_error from '../helpers/custom_error';
import { Op } from 'sequelize';
import moment from 'moment';

async function running_month_income(
    fastify_instance: FastifyInstance,
    req: FastifyRequest,
): Promise<responseObject> {
    let models = await db();
    let body = req.body as anyObject;
    let accountCategoriesModel = models.AccountCategoriesModel;
    let accountsModel = models.AccountsModel;
    let params = req.params as any;
    let user = (req as any).user;
    console.log('jsdlfj', user);
    const { Op } = require('sequelize'); // make sure this is imported

    const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
    const endOfMonth = moment().endOf('month').format('YYYY-MM-DD');

    console.log('Start of Month:', startOfMonth);
    console.log('End of Month:', endOfMonth);

    // // Add one day to month2
    // const endDate = new Date(month3);
    // endDate.setDate(endDate.getDate());
    // // const formattedEndDate = endDate.toISOString().split('T')[0]; // Format to YYYY-MM-DD
    // const formattedEndDate = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')} 00:00:00`;

    // console.log('month 3', formattedEndDate);

    try {
        let data = await models.AccountLogsModel.sum('amount', {
            where: {
                type: 'income',
                date: {
                    [Op.between]: [startOfMonth, endOfMonth],
                },
            },
        });
        console.log('today income', data);
        const amount = data ?? 0;

        if (data) {
            return response(200, 'data founded', { amount });
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

export default running_month_income;
