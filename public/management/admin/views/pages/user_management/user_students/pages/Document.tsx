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
    // if (state) {
    //     console.log('document', state.document?.document_titles);
    // }
    return (
        <div className="admin_dashboard">
            <h3 className="table_heading">Document</h3>
            <div className="content_body">
                <div className="data_list">
                    <div className="table_responsive custom_scroll">
                        <table>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>id</th>
                                    <th>Title</th>
                                    <th>Issue Date</th>
                                    <th>Expire Date</th>
                                    <th>File</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody id="all_list">
                                {(state.item as any)?.document_titles?.map(
                                    (i: { [key: string]: any }) => {
                                        return (
                                            <tr>
                                                <td></td>
                                                <td>{i.id}</td>
                                                <td>{i.title}</td>
                                                <td>
                                                    {moment(
                                                        i.values_title
                                                            ?.issue_date,
                                                    ).format('YYYY-MM-DD')}
                                                </td>
                                                <td>
                                                    {moment(
                                                        i.values_title
                                                            ?.expire_date,
                                                    ).format('YYYY-MM-DD')}
                                                </td>
                                                <td>
                                                    <a
                                                        href={
                                                            i.values_title?.file
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <img
                                                            src={
                                                                i.values_title
                                                                    ?.file
                                                            }
                                                            width={50}
                                                            height={50}
                                                            alt=""
                                                        />
                                                    </a>
                                                </td>
                                                {/* <td>
                                                    <button className="btn btn_1">
                                                        <span>
                                                            <a
                                                                target="blank"
                                                                href={
                                                                    i
                                                                        .values_title
                                                                        ?.file
                                                                }
                                                                download={i.values_title?.file
                                                                    .split('/')
                                                                    .pop()}
                                                            >
                                                                download
                                                            </a>
                                                            <span className="material-symbols-outlined pointer">
                                                                download
                                                            </span>{' '}
                                                        </span>
                                                    </button>
                                                </td> */}
                                                <td className="download_td">
                                                    <a
                                                        className="btn download_btn"
                                                        target="blank"
                                                        href={
                                                            i.values_title?.file
                                                        }
                                                        download={i.values_title?.file
                                                            .split('/')
                                                            .pop()}
                                                    >
                                                        download
                                                        <span className="material-symbols-outlined pointer">
                                                            download
                                                        </span>{' '}
                                                    </a>
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

export default BasicInformation;
