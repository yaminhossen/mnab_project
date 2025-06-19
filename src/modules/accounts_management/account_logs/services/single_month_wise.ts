import db from '../models/db';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { responseObject, anyObject } from '../../../common_types/object';
import response from '../helpers/response';
import error_trace from '../helpers/error_trace';
import custom_error from '../helpers/custom_error';
import { Op, Sequelize } from 'sequelize';

async function single_month_wise(
    fastify_instance: FastifyInstance,
    req: FastifyRequest,
): Promise<responseObject> {
    let models = await db();
    let body = req.body as anyObject;
    let accountCategoriesModel = models.AccountCategoriesModel;
    let accountsModel = models.AccountsModel;
    let params = req.params as any;
    let user = (req as any).user;
    const param = '2024-09'; // Input format: YYYY-MM

    const startDate = `${params.month}-01 00:00:00`; // "2024-09-01 00:00:00"
    const endDate = `${params.month}-31 00:00:00`; // "2024-09-31 23:59:59" (Handles any month)
    console.log(
        '=====================two date00000000000-------------------------',
        startDate,
        endDate,
    );

    try {
        let data = await models.AccountLogsModel.findAll({
            where: {
                date: {
                    [Op.gte]: '2024-09-11 00:00:00', // Includes records on and after this date
                    [Op.lte]: '2024-09-22 00:00:00', // Includes records on and before this date
                },
            },
            include: [
                {
                    model: accountCategoriesModel,
                    as: 'category',
                },
                {
                    model: accountsModel,
                    as: 'account',
                },
            ],
            order: [['date', 'ASC']],
            // limit: 5,
        });

        let data2 = {
            total_expense: 0,
            total_income: 0,
            total_income_query_days: 0,
            total_expense_query_days: 0,
            total_income_query_previous_days: 0,
            total_expense_query_previous_days: 0,
        };

        // Calculate total income and total expense for the filtered dates
        data2.total_income = await models.AccountLogsModel.sum('amount', {
            where: {
                type: 'income',
                date: {
                    [Op.gte]: startDate, // Includes records on and after this date
                    [Op.lte]: endDate, // Includes records on and before this date
                },
            },
        });

        data2.total_expense = await models.AccountLogsModel.sum('amount', {
            where: {
                type: 'expense',
                date: {
                    [Op.gte]: startDate, // Includes records on and after this date
                    [Op.lte]: endDate, // Includes records on and before this date
                },
            },
        });

        // Sum the amounts from the filtered data based on type
        data.forEach((log) => {
            const amount = log.amount ?? 0;
            if (log.type === 'income') {
                data2.total_income_query_days += amount;
            } else if (log.type === 'expense') {
                data2.total_expense_query_days += amount;
            }
        });

        // Calculate previous totals before month1
        data2.total_income_query_previous_days =
            await models.AccountLogsModel.sum('amount', {
                where: {
                    type: 'income',
                    date: {
                        [Op.gte]: startDate, // Includes records on and after this date
                        [Op.lte]: endDate, // Includes records on and before this date
                    },
                },
            });

        data2.total_expense_query_previous_days =
            await models.AccountLogsModel.sum('amount', {
                where: {
                    type: 'expense',
                    date: {
                        [Op.gte]: startDate, // Includes records on and after this date
                        [Op.lte]: endDate, // Includes records on and before this date
                    },
                },
            });

        if (data) {
            return response(200, 'data founded', { data, data2 });
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

export default single_month_wise;
