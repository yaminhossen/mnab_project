import db from '../models/db';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { body, validationResult } from 'express-validator';
import { responseObject, Request } from '../../../common_types/object';
import response from '../helpers/response';
import custom_error from '../helpers/custom_error';
import error_trace from '../helpers/error_trace';
import { sequelize } from '../../../../bootstrap/db.sql';
import { Transaction } from 'sequelize';

/** validation rules */
async function validate(req: Request) {
    await body('id')
        .not()
        .isEmpty()
        .withMessage('the id field is required')
        .run(req);

    let result = await validationResult(req);

    return result;
}
async function soft_delete(
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
    let body = req.body as { [key: string]: any };

    try {
        const branchStudent = await models.BranchClassStudentsModel.findOne({
            where: {
                branch_student_id: body.id,
            },
        });

        if (!branchStudent) {
            throw new custom_error('Forbidden', 403, 'Operation not possible');
        }

        // Start a transaction for atomic updates
        await models.sequelize.transaction(async (t: Transaction) => {
            // Deactivate BranchClassStudentsModel
            branchStudent.status = 'deactive';
            await branchStudent.save({ transaction: t });

            // Deactivate related UserStudentsModel
            const userStudent = await models.UserStudentsModel.findOne({
                where: { id: branchStudent.branch_student_id },
                transaction: t,
            });

            if (userStudent) {
                userStudent.status = 'deactive';
                await userStudent.save({ transaction: t });
            }

            // Deactivate related UserStudentInformationsModel
            const userStudentInfo =
                await models.UserStudentInformationsModel.findOne({
                    where: { user_student_id: branchStudent.branch_student_id },
                    transaction: t,
                });

            if (userStudentInfo) {
                userStudentInfo.status = 'deactive';
                await userStudentInfo.save({ transaction: t });
            }
        });

        return response(200, 'Data deactivated', branchStudent);
    } catch (error: any) {
        const uid = await error_trace(models, error, req.url, req.body);

        if (error instanceof custom_error) {
            error.uid = uid;
        } else {
            throw new custom_error('server error', 500, error.message, uid);
        }

        throw error;
    }
}

export default soft_delete;
