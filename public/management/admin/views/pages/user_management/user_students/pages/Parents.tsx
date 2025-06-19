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

const Parents: React.FC<Props> = (props: Props) => {
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
            <h3 className="table_heading">Parents</h3>
            <div className="content_body">
                <div className="data_list">
                    <div className="table_responsive custom_scroll">
                        <table>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Serial</th>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Relation</th>
                                    <th>Phone Number</th>
                                    <th>Email</th>
                                </tr>
                            </thead>
                            <tbody id="all_list">
                                {(state.item as any)?.parents?.map(
                                    (i: { [key: string]: any }, index) => {
                                        return (
                                            <tr>
                                                <td></td>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <a
                                                        href={
                                                            i.parent_details?.image ||
                                                            undefined
                                                        }
                                                        target="blank"
                                                    >
                                                        <img
                                                            src={
                                                                i.parent_details?.image ||
                                                                '/assets/dashboard/images/avatar.png'
                                                            }
                                                            alt=""
                                                            style={{
                                                                height: 30,
                                                            }}
                                                        />
                                                    </a>
                                                </td>
                                                <td>
                                                    {i.parent_details?.name}
                                                </td>
                                                <td>{i.relation}</td>
                                                <td>
                                                    {
                                                        i.parent_details
                                                            ?.phone_number
                                                    }
                                                </td>
                                                <td>
                                                    {i.parent_details?.email}
                                                </td>
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

export default Parents;
