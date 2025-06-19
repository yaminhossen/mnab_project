import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import setup from '../config/setup';
import { RootState, useAppDispatch } from '../../../../../store';
import { details } from '../config/store/async_actions/details';
import { initialState } from '../config/store/inital_state';
import { Link, Outlet, useParams } from 'react-router-dom';
import storeSlice from '../config/store';
import { document } from '../config/store/async_actions/document';
import moment from 'moment/moment';
import { payment_history } from '../config/store/async_actions/payments_history';
export interface Props {}

// export interface TotalLog {
//     total_expense?: number;
//     total_income?: number;
// }

const Payments: React.FC<Props> = (props: Props) => {
    // const [totalIncome, setTotalIncome] = useState<TotalLog>({});
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    const dispatch = useAppDispatch();
    const params = useParams();

    useEffect(() => {
        dispatch(storeSlice.actions.set_document({}));
        // dispatch(document({ id: params.id }) as any);
        dispatch(payment_history({ id: params.id }) as any);
        // setTotalIncome(state.payments?.totalFeeAmount);
    }, []);
    console.log('payment', state.payments?.totalFeeAmount);

    return (
        <div className="admin_dashboard">
            <h3 className="table_heading">Payments</h3>
            <div className="content_body">
                <div className="data_list">
                    <div className="table_responsive custom_scroll">
                        <table>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>id</th>
                                    <th>Perpous</th>
                                    <th>Date</th>
                                    <th>Fee Amount</th>
                                    <th>Amount</th>
                                    {/* <th>TRX Id</th> */}
                                </tr>
                            </thead>
                            <tbody id="all_list">
                                {(state.payments as any)?.items?.map(
                                    (i: { [key: string]: any }) => {
                                        return (
                                            <tr>
                                                <td></td>
                                                <td>{i.id}</td>
                                                <td>{i.class_fees?.name}</td>
                                                <td>
                                                    {moment(i.date).format(
                                                        'YYYY-MM-DD',
                                                    )}
                                                </td>
                                                <td>{i.fee_amount}</td>
                                                <td>{i.total}</td>
                                                {/* <td>{i.trx_no}</td> */}
                                            </tr>
                                        );
                                    },
                                )}
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>Total</td>
                                    <td>{state.payments?.totalFeeAmount}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payments;
