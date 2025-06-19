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
async function destroy(
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
    console.log('thsis body form destroy', body);
    console.log('thsis params form destroy', req.params);

    try {
        const branchStudent = await models.BranchClassStudentsModel.findOne({
            where: {
                branch_student_id: body.id,
            },
        });

        if (!branchStudent) {
            throw new custom_error('Forbidden', 403, 'Operation not possible');
        }

        // Start a transaction for atomic deletes
        await models.sequelize.transaction(async (t: Transaction) => {
            // Destroy BranchClassStudentsModel record
            await models.BranchClassStudentsModel.destroy({
                where: { branch_student_id: body.id },
                transaction: t,
            });

            // Destroy related UserStudentsModel record
            await models.UserStudentsModel.destroy({
                where: { id: branchStudent.branch_student_id },
                transaction: t,
            });

            // Destroy related UserStudentInformationsModel record
            await models.UserStudentInformationsModel.destroy({
                where: { user_student_id: branchStudent.branch_student_id },
                transaction: t,
            });
        });

        return response(200, 'Data deleted successfully', branchStudent);
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

export default destroy;
