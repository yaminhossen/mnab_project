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
    // await body('branch_id')
    //     .not()
    //     .isEmpty()
    //     .withMessage('the branch_id field is required')
    //     .run(req);
    await body('exam_id')
        .not()
        .isEmpty()
        .withMessage('the exam_id field is required')
        .run(req);
    await body('class_id')
        .not()
        .isEmpty()
        .withMessage('the class_id field is required')
        .run(req);
    // await body('student_id')
    //     .not()
    //     .isEmpty()
    //     .withMessage('the student_id field is required')
    //     .run(req);

    let result = await validationResult(req);

    return result;
}

async function exam_student_attendance(
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
    let data = new models.ExamAttendentStudentsModel();
    let user = (req as any).user;
    let auth_user = await models.BranchTeachersModel.findOne({
        where: {
            user_teacher_id: user?.id || null,
        },
    });

    let student_attendance: anyObject[] = [];
    for (let i = 0; i < parseInt(body.student_count); i++) {
        student_attendance.push({
            branch_student_id: body[`student_id${i}`],
            attendance_status: body[`attendance_status${i}`],
        });
    }
    let todayDate = moment().format('YYYY-MM-DD');
    console.log('body class id', body.class_id);
    console.log('body', body);
    console.log('student attendances', student_attendance);

    /** print request data into console */
    // console.clear();
    // (fastify_instance as any).print(inputs);

    /** store data into database */
    try {
        if (student_attendance) {
            student_attendance.forEach(async (ss) => {
                console.log('student_id', ss.branch_student_id);
                let data = await models.ExamAttendentStudentsModel.destroy({
                    where: {
                        exam_id: body?.exam_id,
                        class_id: body.class_id,
                        subject_id: body.subject_id,
                        student_id: ss.branch_student_id,
                    },
                });

                let uscn_model = new models.ExamAttendentStudentsModel();
                let uscn_inputs: InferCreationAttributes<typeof uscn_model> = {
                    branch_id: auth_user?.branch_id || 1,
                    student_id: ss.branch_student_id,
                    exam_id: body?.exam_id,
                    class_id: body.class_id,
                    subject_id: body.subject_id,
                    // date: todayDate,
                    attendance_status: ss.attendance_status,
                    creator: user?.id || null,
                };
                uscn_inputs.branch_id = auth_user?.branch_id || 1;
                uscn_inputs.student_id = ss.branch_student_id;
                uscn_inputs.exam_id = body.exam_id;
                uscn_inputs.class_id = body.class_id;
                uscn_inputs.subject_id = body.subject_id;
                uscn_inputs.attendance_status = ss.attendance_status;
                uscn_inputs.creator = user?.id || null;
                (await uscn_model.update(uscn_inputs)).save();
            });
        }
        return response(200, 'data created', data);
    } catch (error: any) {
        let uid = await error_trace(models, error, req.url, req.body);
        throw new custom_error('server error', 500, error.message, uid);
    }
}

export default exam_student_attendance;
