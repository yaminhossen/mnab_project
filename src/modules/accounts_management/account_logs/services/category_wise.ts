import db from '../models/db';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { responseObject, anyObject } from '../../../common_types/object';
import response from '../helpers/response';
import error_trace from '../helpers/error_trace';
import custom_error from '../helpers/custom_error';
import { Op } from 'sequelize';

async function category_wise(
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
    // let user = (req as any).user;
    let auth_user = await models.BranchStaffsModel.findOne({
        where: {
            user_staff_id: (req as any).user?.id || null,
        },
    });

    let month1 = body.month1 || '2024-09-12'; // Start date
    let month2 = body.month2 || '2025-09-22'; // End date

    // Add one day to month2
    const endDate = new Date(month2);
    endDate.setDate(endDate.getDate() + 1); // Increment by one day
    const formattedEndDate = endDate.toISOString().split('T')[0]; // Format to YYYY-MM-DD

    try {
        let data = await models.AccountLogsModel.findAll({
            where: {
                date: {
                    [Op.between]: [month1, formattedEndDate],
                },
                account_category_id: params.id,
                amount: { [Op.gte]: 1 },
                branch_id: auth_user?.branch_id || 1,
                // type: 'income',
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
                account_category_id: params.id,
            },
        });

        data2.total_expense = await models.AccountLogsModel.sum('amount', {
            where: {
                type: 'expense',
                account_category_id: params.id,
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
                    account_category_id: params.id,
                    date: {
                        [Op.lt]: month1,
                    },
                },
            });

        data2.total_expense_query_previous_days =
            await models.AccountLogsModel.sum('amount', {
                where: {
                    type: 'expense',
                    account_category_id: params.id,
                    date: {
                        [Op.lt]: month1,
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

export default category_wise;
