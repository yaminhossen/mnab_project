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

const EducationalBackground: React.FC<Props> = (props: Props) => {
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
            <h3 className="table_heading">Educational background</h3>
            <div className="content_body">
                <div className="data_list">
                    <div className="table_responsive custom_scroll">
                        <table>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>id</th>
                                    <th>Institute</th>
                                    <th>Year of Leaving</th>
                                    <th>Transcript</th>
                                    <th>Download</th>
                                    <th>Result</th>
                                </tr>
                            </thead>
                            <tbody id="all_list">
                                {(
                                    state.item as any
                                )?.educational_backgrounds?.map(
                                    (i: { [key: string]: any }) => {
                                        return (
                                            <tr>
                                                <td></td>
                                                <td>{i.id}</td>
                                                <td>{i.previous_institute}</td>
                                                <td>
                                                    {moment(
                                                        i.year_of_leaving,
                                                    ).format('YYYY-MM-DD')}
                                                </td>
                                                <td>
                                                    <a
                                                        href={
                                                            i.transfer_cirtificate
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <img
                                                            src={
                                                                i?.transfer_cirtificate
                                                            }
                                                            width={40}
                                                            alt=""
                                                        />
                                                    </a>
                                                </td>
                                                <td className="download_td">
                                                    <a
                                                        className="btn download_btn"
                                                        target="blank"
                                                        href={
                                                            i.transfer_cirtificate
                                                        }
                                                        download={i.transfer_cirtificate
                                                            .split('/')
                                                            .pop()}
                                                    >
                                                        download
                                                        <span className="material-symbols-outlined pointer">
                                                            download
                                                        </span>{' '}
                                                    </a>
                                                </td>
                                                {/* <td>
                                                    <button className="btn btn_1">
                                                        <span className="material-symbols-outlined pointer">
                                                            download
                                                        </span>
                                                        <span>
                                                            <a
                                                                target="blank"
                                                                href={
                                                                    i?.transfer_cirtificate
                                                                }
                                                                download={i.transfer_cirtificate
                                                                    .split('/')
                                                                    .pop()}
                                                            >
                                                                download
                                                            </a>
                                                        </span>
                                                    </button>
                                                </td> */}
                                                <td>{i.result}</td>
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

export default EducationalBackground;
