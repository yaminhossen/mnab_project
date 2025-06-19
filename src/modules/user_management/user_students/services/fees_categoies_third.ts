import db from '../models/db';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { anyObject, responseObject } from '../../../common_types/object';
import response from '../helpers/response';
import error_trace from '../helpers/error_trace';
import custom_error from '../helpers/custom_error';
import { sequelize } from '../../../../bootstrap/db.sql';
import { Sequelize, Op } from 'sequelize';
import moment from 'moment/moment';

async function fees_categories_third(
    fastify_instance: FastifyInstance,
    req: FastifyRequest,
): Promise<responseObject> {
    let models = await db();
    let accountFeesCollectionDetailsModel =
        models.AccountFeesCollectionDetailsModel;
    let informationsModel = models.UserStudentInformationsModel;
    let studentsModel = models.UserStudentsModel;
    let classFeesTypesModel = models.BranchClassFeeTypesModel;
    let classesModel = models.BranchClassesModel;
    let classFeessModel = models.BranchClassFeesModel;
    let params = req.params as any;
    let user = (req as any).user;
    console.log('user params', params);
    console.log('user params', user);
    console.log('today month', moment().format('MMMM'));

    try {
        let student_data = await informationsModel.findOne({
            where: {
                [Op.or]: [
                    { user_student_id: user?.id },
                    // { student_id: params?.id || 0 },
                ],
            },
        });
        console.log('studnet dta', student_data);
        let data = await classFeessModel.findAll({
            where: {
                // branch_class_id: params.class,
                branch_class_id: student_data?.s_class,
            },
            include: [
                {
                    model: classFeesTypesModel,
                    as: 'fees_types',
                },
            ],
        });
        // Convert `data` to JSON if it's not already
        data = data.map((item) => item.toJSON());

        // Initialize an empty array to hold totals for each ID
        let idWiseTotals = [];
        // Loop through each item in `data` to calculate totals
        for (let item of data) {
            // Calculate `total` for each ID
            const total = await accountFeesCollectionDetailsModel.sum('total', {
                where: {
                    branch_student_id: student_data?.user_student_id, // Hardcoded for demonstration
                    branch_class_fees_id: item.id, // Compare with each ID
                },
            });

            let fee_amount = 0;

            // Check if the `item.name` is "monthly fee"
            // if (item.name === 'monthly fee') {
            //     // Sum all fee amounts for "monthly fee"
            //     fee_amount = await accountFeesCollectionDetailsModel.sum(
            //         'fee_amount',
            //         {
            //             where: {
            //                 branch_student_id: student_data?.user_student_id, // Hardcoded for demonstration
            //                 branch_class_fees_id: item.id, // Compare with each ID
            //             },
            //         },
            //     );
            // Check if the `item.name` is "monthly fee"
            if (item.name === 'Monthly fee') {
                let thisMonth = moment().month() + 1; // Get current month index (1-12)
                const feeRecord =
                    await accountFeesCollectionDetailsModel.findOne({
                        where: {
                            branch_student_id: student_data?.user_student_id,
                            branch_class_fees_id: item.id,
                        },
                        attributes: ['fee_amount'], // Fetch only `fee_amount` field
                    });
                let fee = feeRecord ? feeRecord.fee_amount : 0;
                fee_amount = fee * thisMonth;
            } else {
                // For other cases, retrieve the fee amount only once
                const feeRecord =
                    await accountFeesCollectionDetailsModel.findOne({
                        where: {
                            branch_student_id: student_data?.user_student_id, // Hardcoded for demonstration
                            branch_class_fees_id: item.id, // Compare with each ID
                        },
                        attributes: ['fee_amount'], // Fetch only `fee_amount` field
                    });
                fee_amount = feeRecord ? feeRecord.fee_amount : 0;
            }

            // Push the total along with the associated ID to the result array
            idWiseTotals.push({
                id: item.id,
                name: item.name,
                total: total || 0, // Ensure a fallback of 0 if no records are found
                fee_amount: fee_amount || item.amount, // Ensure a fallback of 0 if no records are found
                due_amount: total - fee_amount, // Calculate the due amount
                // due_amount: Math.abs((total || 0) - (fee_amount || 0)), // Calculate the due amount
            });
        }
        console.log('due amount', idWiseTotals);
        // Calculate overall totals
        const summeries = idWiseTotals.reduce(
            (acc, curr) => {
                acc.total += curr.total || 0;
                acc.fee_amount += curr.fee_amount || 0;
                acc.due_amount += curr.due_amount || 0;
                return acc;
            },
            { total: 0, fee_amount: 0, due_amount: 0 },
        );
        if (data) {
            return response(200, 'data created', {
                data,
                idWiseTotals,
                summeries,
            });
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

export default fees_categories_third;
