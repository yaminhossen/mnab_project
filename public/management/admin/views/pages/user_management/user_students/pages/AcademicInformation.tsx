import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import setup from '../config/setup';
import { RootState, useAppDispatch } from '../../../../../store';
import { details } from '../config/store/async_actions/details';
import { initialState } from '../config/store/inital_state';
import { Link, Outlet, useParams } from 'react-router-dom';
import storeSlice from '../config/store';
import { document } from '../config/store/async_actions/document';
import moment from 'moment/moment';
export interface Props {}

const AcademicInformation: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    const dispatch = useAppDispatch();
    const params = useParams();

    useEffect(() => {
        dispatch(storeSlice.actions.set_document({}));
        // dispatch(document({ id: params.id }) as any);
        dispatch(details({ id: params.id }) as any);
    }, []);
    return (
        <div className="admin_dashboard">
            <h3 className="table_heading">Academic information</h3>

            <div>
                {/* <h4>Admission information</h4> */}
                <div className="basic_info mb-4 ">
                    <table className="table text-nowrap student_table">
                        <tbody>
                            {/* <tr>
                                <td>Branch</td>
                                <td>:</td>
                                <td className="font-medium text-dark-medium">
                                    Uttora
                                </td>
                            </tr> */}
                            <tr>
                                <td>Student Id</td>
                                <td>:</td>
                                <td className="font-medium text-dark-medium">
                                    {state.item?.student_info?.student_id}
                                </td>
                            </tr>
                            <tr>
                                <td>Roll no</td>
                                <td>:</td>
                                <td className="font-medium text-dark-medium">
                                    {state.item?.student_info?.role_no}
                                </td>
                            </tr>
                            <tr>
                                <td>Addmission date</td>
                                <td>:</td>
                                <td className="font-medium text-dark-medium">
                                    {moment(
                                        state.item?.student_info
                                            ?.admission_date,
                                    ).format('YYYY-MM-DD')}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AcademicInformation;
