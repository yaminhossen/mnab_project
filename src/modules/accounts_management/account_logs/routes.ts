'use strict';
import { FastifyInstance } from 'fastify';
import controller from './controller';
import check_auth from '../../auth_management/authetication/services/check_auth';
import auth_middleware from '../../auth_management/authetication/services/auth_middleware';

module.exports = async function (fastify: FastifyInstance) {
    let prefix: string = '/account-logs';
    const controllerInstance = controller(fastify);

    fastify
        // .addHook('onRequest', check_auth)
        .get(`${prefix}`, controllerInstance.all)
        .post(`${prefix}/credit`, controllerInstance.credit)
        .post(`${prefix}/category-wise/:id`, controllerInstance.category_wise)
        .post(
            `${prefix}/month-wise-statement`,
            controllerInstance.month_wise_statement,
        )
        .get(
            `${prefix}/month-wise-statement/:month`,
            controllerInstance.single_month_wise,
        )
        .get(`${prefix}/today-income`, controllerInstance.today_income)
        .get(
            `${prefix}/running-month-income`,
            controllerInstance.running_month_income,
        )
        .get(
            `${prefix}/running-month-expense`,
            controllerInstance.running_month_expense,
        )
        .get(`${prefix}/current-balance`, controllerInstance.current_balance)
        .get(`${prefix}/expense-today`, controllerInstance.expense_today)
        .post(
            `${prefix}/payment-history-auth`,
            { preHandler: [auth_middleware] },
            controllerInstance.payment_history_auth,
        )
        .post(
            `${prefix}/payment-history/:id`,
            controllerInstance.payment_history,
        )
        .get(`${prefix}/income-statement`, controllerInstance.income_statement)
        .post(`${prefix}/journal`, controllerInstance.journal)
        .post(`${prefix}/profit-loss`, controllerInstance.profit_loss)
        .post(`${prefix}/debit`, controllerInstance.debit)
        .post(`${prefix}/store`, controllerInstance.store)
        .post(
            `${prefix}/fees-store`,
            { preHandler: [auth_middleware] },
            controllerInstance.fees_store,
        )
        .post(
            `${prefix}/income-store`,
            { preHandler: [auth_middleware] },
            controllerInstance.income_store,
        )
        .post(
            `${prefix}/expense-store`,
            { preHandler: [auth_middleware] },
            controllerInstance.expense_store,
        )
        .get(`${prefix}/account/:id`, controllerInstance.account_details)
        .get(`${prefix}/categories`, controllerInstance.categories)
        .get(`${prefix}/periods`, controllerInstance.account_periods)
        .get(`${prefix}/receipt-book`, controllerInstance.receipt_books)
        .get(`${prefix}/accounts`, controllerInstance.accounts)
        .post(`${prefix}/fees-payment`, controllerInstance.fees_payment)
        .post(`${prefix}/update`, controllerInstance.update)
        .post(`${prefix}/soft-delete`, controllerInstance.soft_delete)
        .post(`${prefix}/restore`, controllerInstance.restore)
        .post(`${prefix}/destroy`, controllerInstance.destroy)
        .post(`${prefix}/import`, controllerInstance.import)
        .get(`${prefix}/:id`, controllerInstance.find);
};
