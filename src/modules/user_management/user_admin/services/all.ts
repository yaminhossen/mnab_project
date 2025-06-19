import { FindAndCountOptions } from 'sequelize';
import db from '../models/db';
import { FastifyInstance, FastifyRequest } from 'fastify';
import response from '../helpers/response';
import { validationResult, query } from 'express-validator';
import {
    anyObject,
    responseObject,
    Request,
} from '../../../common_types/object';
import error_trace from '../helpers/error_trace';
import custom_error from '../helpers/custom_error';
import moment from 'moment/moment';

/** validation rules */
async function validate(req: Request) {
    await query('orderByCol')
        .not()
        .isEmpty()
        .withMessage('the orderByCol field is required')
        .run(req);

    await query('orderByAsc')
        .not()
        .isEmpty()
        .withMessage('the orderByAsc field is required')
        .run(req);

    await query('show_active_data')
        .not()
        .isEmpty()
        .withMessage('the show_active_data field is required')
        .run(req);

    await query('paginate')
        .not()
        .isEmpty()
        .withMessage('the paginate field is required')
        .run(req);

    let result = await validationResult(req);

    return result;
}
async function all(
    fastify_instance: FastifyInstance,
    req: FastifyRequest,
): Promise<responseObject> {
    /** validation */
    let validate_result = await validate(req as Request);
    if (!validate_result.isEmpty()) {
        return response(422, 'validation error', validate_result.array());
    }
    /** initializations */
    let models = await db();
    let query_param = req.query as any;

    const { Op } = require('sequelize');
    let search_key = query_param.search_key;
    let orderByCol = query_param.orderByCol || 'id';
    let orderByAsc = query_param.orderByAsc || 'true';
    let show_active_data = query_param.show_active_data || 'true';
    let paginate = parseInt((req.query as any).paginate) || 10;
    let select_fields: string[] = [];
    let exclude_fields: string[] = ['password'];

    if (query_param.select_fields) {
        select_fields = query_param.select_fields.replace(/\s/g, '').split(',');
        select_fields = [...select_fields, 'id', 'status'];
    } else {
        select_fields = ['id', 'email', 'status', 'name', 'phone_number'];
    }

    // let query: FindAndCountOptions = {
    //     order: [[orderByCol, orderByAsc == 'true' ? 'DESC' : 'ASC']],
    //     where: {
    //         status: show_active_data == 'true' ? 'active' : 'deactive',
    //         created_at: {
    //             [Op.between]: [query_param?.start_date, query_param?.end_date],
    //         },
    //     },
    //     // include: [models.Project],
    // };\

    const whereClause: any = {
        status: show_active_data === 'true' ? 'active' : 'deactive',
        // role: { [Op.ne]: 'admin' }, // role not equal to 'admin'
        role: 'admin',
    };
    const today = moment().format('YYYY-MM-DD');
    console.log('todya', today);

    let month1 = query_param?.start_date || today; // Start date
    let month2 = query_param?.end_date || today;
    if (query_param?.start_date && query_param?.end_date) {
        const endDate = new Date(query_param.end_date);
        endDate.setDate(endDate.getDate() + 1); // Increment by one day
        const formattedEndDate = endDate.toISOString().split('T')[0];
        console.log('month2', formattedEndDate);

        whereClause.created_at = {
            [Op.between]: [query_param.start_date, formattedEndDate],
        };
    }

    const query: FindAndCountOptions = {
        order: [[orderByCol, orderByAsc === 'true' ? 'DESC' : 'ASC']],
        where: whereClause,
        // include: [models.Project],

        // include: [
        //     {
        //         model: models.UserStaffInformationsModel,
        //         as: 'staff_infos',
        //     },
        //     {
        //         model: models.BranchStaffsModel,
        //         as: 'staffs',
        //     },
        // ],
        attributes: {
            exclude: ['password'],
        },
    };

    query.attributes = {
        include: select_fields,
        exclude: exclude_fields,
    };
    console.log('params', query_param);
    console.log('params2', query_param.start_date);
    console.log('params3', query_param.end_date);

    if (search_key) {
        // query_param.paginate = 25;
        // query_param.page = 1;

        // query_param.paginate = 25;
        query.where = {
            ...query.where,
            [Op.or]: [
                { name: { [Op.like]: `%${search_key}%` } },
                { type: { [Op.like]: `%${search_key}%` } },
                { phone_number: { [Op.like]: `%${search_key}%` } },
                { email: { [Op.like]: `%${search_key}%` } },
                { id: { [Op.like]: `%${search_key}%` } },
            ],
        };
    }

    try {
        let data = await (fastify_instance as anyObject).paginate(
            req,
            models.UserAdminsModel,
            paginate,
            query,
        );
        return response(200, 'data fetched', data);
    } catch (error: any) {
        let uid = await error_trace(models, error, req.url, req.query);
        throw new custom_error('server error', 500, error.message, uid);
    }
}

export default all;
