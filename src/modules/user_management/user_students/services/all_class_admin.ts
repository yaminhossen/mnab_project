import db from '../models/db';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { anyObject, responseObject } from '../../../common_types/object';
import response from '../helpers/response';
import error_trace from '../helpers/error_trace';
import custom_error from '../helpers/custom_error';
import { sequelize } from '../../../../bootstrap/db.sql';

async function all_class_admin(
    fastify_instance: FastifyInstance,
    req: FastifyRequest,
): Promise<responseObject> {
    let models = await db();
    let educationalBackgroundsModel =
        models.UserStudentEducationalBackgroundsModel;
    let informationsModel = models.UserStudentInformationsModel;
    let studentsModel = models.UserStudentsModel;
    let adminsModel = models.UserAdminsModel;
    let classesModel = models.BranchClassesModel;
    let classStudentsModel = models.BranchClassStudentsModel;
    let params = req.params as any;
    let user_id = (req as any).user?.id;
    console.log('user1', user_id);
    console.log('user2', (req as any).user);
    console.log('user3', req);

    try {
        let admin = await adminsModel.findOne({
            where: {
                id: user_id,
            },
        });
        console.log('admin id', admin);
        console.log('admin id', admin?.branch_id);
        let Dbresponse = await classesModel.findAndCountAll({
            where: {
                branch_id: admin?.branch_id,
                // branch_id: 1,
            },
        });

        let data = Dbresponse.rows.map((i) => i.toJSON());
        // console.log(data);

        // let data: anyObject[] = [];
        for (let index = 0; index < data.length; index++) {
            const element: anyObject = data[index];
            element.count = await classStudentsModel.count({
                where: { branch_class_id: element.id },
            });
        }

        if (data) {
            return response(200, 'data created', data);
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

export default all_class_admin;
