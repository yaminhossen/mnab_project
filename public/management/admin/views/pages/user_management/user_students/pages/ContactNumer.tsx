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

const ContactNumber: React.FC<Props> = (props: Props) => {
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
            <h3 className="table_heading">Contact Number</h3>
            <div className="content_body">
                <div className="data_list">
                    <div className="table_responsive custom_scroll">
                        <table>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>id</th>
                                    <th>Contact Number</th>
                                    <th>Relative</th>
                                </tr>
                            </thead>
                            <tbody id="all_list">
                                {(state.item as any)?.student_numbers?.map(
                                    (i: { [key: string]: any }) => {
                                        return (
                                            <tr>
                                                <td></td>
                                                <td>{i.id}</td>
                                                <td>{i.contact_number}</td>
                                                <td>{i.owner}</td>
                                            </tr>
                                        );
                                    },
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactNumber;
