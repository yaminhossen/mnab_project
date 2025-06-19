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

const BasicInformation: React.FC<Props> = (props: Props) => {
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
            <h3 className="table_heading">Basic information</h3>
            <table className="table text-nowrap">
                <tbody>
                    <tr>
                        <td>Name:</td>
                        <td className="font-medium text-dark-medium">
                            {state.item.name}
                        </td>
                    </tr>
                    <tr>
                        <td>Email:</td>
                        <td className="font-medium text-dark-medium">
                            {state.item.email}
                        </td>
                    </tr>
                    <tr>
                        <td>Phone Number:</td>
                        <td className="font-medium text-dark-medium">
                            {state.item.phone_number}
                        </td>
                    </tr>
                    <tr>
                        <td>Whatsapp:</td>
                        <td className="font-medium text-dark-medium">
                            {state.item.whatsapp_number}
                        </td>
                    </tr>
                    <tr>
                        <td>Status:</td>
                        <td className="font-medium text-dark-medium">
                            {state.item.status}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default BasicInformation;
