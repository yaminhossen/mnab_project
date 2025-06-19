import { FindAndCountOptions } from 'sequelize';
import db from '../models/db';
import { FastifyInstance, FastifyRequest } from 'fastify';
import response from '../helpers/response';
import { validationResult } from 'express-validator';
import {
    anyObject,
    responseObject,
    Request,
} from '../../../common_types/object';
import error_trace from '../helpers/error_trace';
import custom_error from '../helpers/custom_error';
import moment from 'moment/moment';

async function validate(req: Request) {
    let result = await validationResult(req);
    return result;
}

async function all(
    fastify_instance: FastifyInstance,
    req: FastifyRequest,
): Promise<responseObject> {
    let validate_result = await validate(req as Request);
    if (!validate_result.isEmpty()) {
        return response(422, 'validation error', validate_result.array());
    }

    let models = await db();
    let informationsModel = models.UserStudentInformationsModel;
    let studentsModel = models.UserStudentsModel;
    let classesModel = models.BranchClassesModel;
    let query_param = req.query as any;
    let params = req.params as any;

    const { Op } = require('sequelize');
    let search_key = query_param.search_key;
    let orderByCol = query_param.orderByCol || 'id';
    let orderByAsc = query_param.orderByAsc || 'true';
    let show_active_data = query_param.show_active_data || 'true';
    let paginate = parseInt(query_param.paginate) || 10;
    let select_fields: string[] = [];
    let exclude_fields: string[] = ['password'];

    if (query_param.select_fields) {
        select_fields = query_param.select_fields.replace(/\s/g, '').split(',');
        select_fields = [...select_fields, 'id', 'status'];
    } else {
        select_fields = ['id'];
    }

    const whereClause: any = {
        status: show_active_data === 'true' ? 'active' : 'deactive',
        branch_class_id: params.id,
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
    let query: FindAndCountOptions = {
        order: [[orderByCol, orderByAsc === 'true' ? 'DESC' : 'ASC']],
        // where: {
        //     status: show_active_data === 'true' ? 'active' : 'deactive',
        //     branch_class_id: params.id,
        // },
        where: whereClause,
        include: [
            {
                model: studentsModel,
                as: 'branchstudent',
            },
            {
                model: informationsModel,
                as: 'infostudent',
                include: [
                    {
                        model: classesModel,
                        as: 'class',
                    },
                ],
            },
        ],
        attributes: {
            include: select_fields,
            exclude: exclude_fields,
        },
    };

    if (search_key) {
        query.where = {
            ...query.where,
            [Op.or]: [
                {
                    '$infostudent.student_id$': {
                        [Op.like]: `%${search_key}%`,
                    },
                },
                { '$infostudent.role_no$': { [Op.like]: `%${search_key}%` } },
                { '$branchstudent.name$': { [Op.like]: `%${search_key}%` } },
                // { id: { [Op.like]: `%${search_key}%` } },
            ],
        };
    }

    // Apply search ONLY to infostudent
    // if (search_key && query.include) {
    //     const includeArr = query.include as Array<any>;

    //     // Apply search on 'infostudent'
    //     const infoInclude = includeArr.find(
    //         (inc: any) =>
    //             inc && typeof inc === 'object' && inc.as === 'infostudent',
    //     );

    //     if (infoInclude) {
    //         infoInclude.where = {
    //             [Op.or]: [
    //                 { student_id: { [Op.like]: `%${search_key}%` } },
    //                 { role_no: { [Op.like]: `%${search_key}%` } },
    //             ],
    //         };
    //     }

    //     // Apply search on 'branchstudent'
    //     const branchInclude = includeArr.find(
    //         (inc: any) =>
    //             inc && typeof inc === 'object' && inc.as === 'branchstudent',
    //     );

    //     if (branchInclude) {
    //         branchInclude.where = {
    //             name: { [Op.like]: `%${search_key}%` },
    //         };
    //     }
    // }

    try {
        const data = await (fastify_instance as anyObject).paginate(
            req,
            models.BranchClassStudentsModel,
            paginate,
            query,
        );
        return response(200, 'data fetched', data);
    } catch (error: any) {
        const uid = await error_trace(models, error, req.url, req.query);
        throw new custom_error('server error', 500, error.message, uid);
    }
}

export default all;
