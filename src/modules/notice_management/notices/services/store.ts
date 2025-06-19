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
import moment from 'moment/moment';

async function validate(req: Request) {
    await body('notice_category_id')
        .not()
        .isEmpty()
        .withMessage('the notice_category_id field is required')
        .run(req);

    await body('title')
        .not()
        .isEmpty()
        .withMessage('the title field is required')
        .run(req);

    await body('description')
        .not()
        .isEmpty()
        .withMessage('the description field is required')
        .run(req);

    await body('attachment')
        .not()
        .isEmpty()
        .withMessage('the attachment field is required')
        .run(req);

    await body('image')
        .not()
        .isEmpty()
        .withMessage('the image field is required')
        .run(req);

    await body('notice_for')
        .not()
        .isEmpty()
        .withMessage('the notice_for field is required')
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
    let data = new models.NoticesModel();
    let NoticeSeenBy = new models.NoticeSeenByUsersModel();
    let user = (req as any).user;
    let auth_user = await models.BranchAdminsModel.findOne({
        where: {
            user_admin_id: (req as any).user?.id || null,
        },
    });

    let image_path = '';
    let attachment_path = '';
    if (body['image']?.ext) {
        image_path =
            'uploads/notices/' +
            moment().format('YYYYMMDDHHmmss') +
            body['image'].name;
        await (fastify_instance as any).upload(body['image'], image_path);
    }

    if (body['attachment']?.ext) {
        attachment_path =
            'uploads/notices/' +
            moment().format('YYYYMMDDHHmmss') +
            body['attachment'].name;
        await (fastify_instance as any).upload(
            body['attachment'],
            attachment_path,
        );
    }

    let inputs: InferCreationAttributes<typeof data> = {
        branch_id: auth_user?.branch_id || 1,
        notice_category_id: body.notice_category_id,
        title: body.title,
        description: body.description,
        attachment: attachment_path,
        image: image_path,
        notice_for: body.notice_for,
        creator: user?.id || null,
    };

    /** print request data into console */
    // console.clear();
    // (fastify_instance as any).print(inputs);

    /** store data into database */
    try {
        (await data.update(inputs)).save();
        // let notice = await data.save();
        // let notice_id = notice.id;

        if (data) {
            let inputs2 = {
                branch_id: auth_user?.branch_id || 1,
                category_id: 2,
                notice_id: data.id,
                admin_id: body.admin_id || null,
                teacher_id: body.teacher_id || null,
                student_id: body.student_id || null,
                staff_id: body.staff_id || null,
                creator: user?.id || null,
            };
            // await (await NoticeSeenBy.update(inputs2)).save();
        }
        return response(200, 'data created', data);
    } catch (error: any) {
        let uid = await error_trace(models, error, req.url, req.body);
        throw new custom_error('server error', 500, error.message, uid);
    }
}

export default store;
