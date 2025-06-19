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

async function validate(req: Request) {
    await body('id')
        .not()
        .isEmpty()
        .withMessage('the id field is required')
        .run(req);

    await body('leave_type_id')
        .not()
        .isEmpty()
        .withMessage('the leave_type_id field is required')
        .run(req);

    await body('start_date')
        .not()
        .isEmpty()
        .withMessage('the start_date field is required')
        .run(req);

    await body('end_date')
        .not()
        .isEmpty()
        .withMessage('the end_date field is required')
        .run(req);

    // await body('reason')
    //     .not()
    //     .isEmpty()
    //     .withMessage('the reason field is required')
    //     .run(req);

    await body('leave_status')
        .not()
        .isEmpty()
        .withMessage('the leave_status field is required')
        .run(req);

    await body('total_days')
        .not()
        .isEmpty()
        .withMessage('the total_days field is required')
        .run(req);

    await body('approved_start_date')
        .not()
        .isEmpty()
        .withMessage('the approved_start_date field is required')
        .run(req);

    await body('approved_end_date')
        .not()
        .isEmpty()
        .withMessage('the approved_end_date field is required')
        .run(req);

    await body('approved_days')
        .not()
        .isEmpty()
        .withMessage('the approved_days field is required')
        .run(req);

    let result = await validationResult(req);

    return result;
}

async function update(
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
    let model = new models.LeaveApplicationsModel();
    let user = (req as any).user;
    let auth_user = await models.UserStudentInformationsModel.findOne({
        where: {
            id: (req as any).user?.id || null,
        },
    });

    let inputs: InferCreationAttributes<typeof model> = {
        branch_id: auth_user?.branch_id || 1,
        branch_teacher_id: body.teacher_id,
        branch_student_id: body.student_id,
        branch_staff_id: body.staff_id,
        leave_type_id: body.leave_type_id,
        start_date: body.start_date,
        end_date: body.end_date,
        leave_status: body.leave_status,
        // attachments: body.attachments,
        // total_days: body.approved_days,
        approved_start_date: body.approved_start_date,
        approved_end_date: body.approved_end_date,
        approved_days: body.approved_days,
        creator: user?.id || null,
    };

    /** print request data into console */
    // console.clear();
    // (fastify_instance as any).print(inputs);

    /** store data into database */
    try {
        let data = await models.LeaveApplicationsModel.findByPk(body.id);
        if (data) {
            (await data.update(inputs)).save();
            return response(200, 'data updated', data);
        } else {
            throw new custom_error('Forbidden', 403, 'operation not possible');
        }
    } catch (error: any) {
        let uid = await error_trace(models, error, req.url, req.body);
        if (error instanceof custom_error) {
            error.uid = uid;
        } else {
            throw new custom_error('server error', 500, error.message, uid);
        }
        throw error;
    }
}

export default update;
