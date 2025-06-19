import db from '../models/db';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { body, validationResult } from 'express-validator';
import {
    anyObject,
    responseObject,
    Request,
} from '../../../common_types/object';
import response from '../helpers/response';
import { InferCreationAttributes } from 'sequelize';
import custom_error from '../helpers/custom_error';
import error_trace from '../helpers/error_trace';
import moment from 'moment';

async function validate(req: Request) {
    await body('start_date')
        .not()
        .isEmpty()
        .withMessage('the start_date field is required')
        .run(req);

    await body('leave_type')
        .not()
        .isEmpty()
        .withMessage('the leave_type field is required')
        .run(req);

    await body('end_date')
        .not()
        .isEmpty()
        .withMessage('the end_date field is required')
        .run(req);

    await body('attachments')
        .not()
        .isEmpty()
        .withMessage('the attachments field is required')
        .run(req);

    let result = await validationResult(req);

    return result;
}

async function store(
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
    let body = req.body as anyObject;
    let data = new models.LeaveApplicationsModel();
    let image_path = '';
    let auth_user;
    let user = (req as any).user;
    if (user?.user_type == 'student') {
        auth_user = await models.UserStudentInformationsModel.findOne({
            where: {
                user_student_id: user?.id || null,
            },
        });
    } else if (user?.user_type == 'staff') {
        auth_user = await models.BranchStaffsModel.findOne({
            where: {
                user_staff_id: user?.id || null,
            },
        });
    } else if (user?.user_type == 'admission-officer') {
        auth_user = await models.BranchStaffsModel.findOne({
            where: {
                user_staff_id: user?.id || null,
            },
        });
    } else if (user?.user_type == 'teacher') {
        auth_user = await models.BranchTeachersModel.findOne({
            where: {
                user_teacher_id: user?.id || null,
            },
        });
    } else if (user?.user_type == 'account') {
        auth_user = await models.BranchStaffsModel.findOne({
            where: {
                user_staff_id: user?.id || null,
            },
        });
    }
    // let auth_user = await models.BranchStaffsModel.findOne({
    //     where: {
    //         id: (req as any).user?.id || null,
    //     },
    // });

    if (body['attachments']?.ext) {
        image_path =
            'uploads/students/leave' +
            moment().format('YYYYMMDDHHmmss') +
            body['attachments'].name;
        await (fastify_instance as any).upload(body['attachments'], image_path);
    }
    console.log('==========leave body', auth_user);
    console.log('-----------leave body', user);
    let inputs: InferCreationAttributes<typeof data> = {
        branch_id: auth_user?.branch_id || 1,
        branch_staff_id: 0,
        branch_student_id: 0,
        branch_teacher_id: 0,
        start_date: body.start_date,
        leave_status: body.leave_status || 'pending',
        total_days: body.days,
        leave_type_id: body.leave_type,
        end_date: body.end_date,
        attachments: image_path,
        creator: user?.id || null,
    };
    if (user.user_type == 'staff') {
        inputs.branch_staff_id = user?.id || null;
    }
    if (user.user_type == 'admission-officer') {
        inputs.branch_staff_id = user?.id || null;
    }
    if (user.user_type == 'student') {
        inputs.branch_student_id = user?.id || null;
    }
    if (user.user_type == 'teacher') {
        inputs.branch_teacher_id = user?.id || null;
    }
    if (user.user_type == 'account') {
        inputs.branch_staff_id = user?.id || null;
    }

    /** print request data into console */
    // console.clear();
    // (fastify_instance as any).print(inputs);

    /** store data into database */
    try {
        (await data.update(inputs)).save();
        return response(200, 'data created', data);
    } catch (error: any) {
        let uid = await error_trace(models, error, req.url, req.body);
        throw new custom_error('server error', 500, error.message, uid);
    }
}

export default store;
