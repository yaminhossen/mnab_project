import React from 'react';
import { createPortal } from 'react-dom';
import { RootState, useAppDispatch } from '../../../../../../store';
import storeSlice from '../../config/store';
import { initialState } from '../../config/store/inital_state';
import { useSelector } from 'react-redux';
import setup from '../../config/setup';
export interface Props {}

const modalRoot = document.getElementById('filter-root');

const QuickView: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    const dispatch = useAppDispatch();

    function close_canvas(action: boolean = true) {
        dispatch(storeSlice.actions.set_show_quick_view_canvas(action));
    }

    if (modalRoot && state.show_quick_view_canvas) {
        return createPortal(
            <div className="off_canvas quick_view">
                <div className="off_canvas_body">
                    <div className="header">
                        <h3 className="heading_text">Quick View</h3>
                        <button
                            className="close_button"
                            onClick={() => close_canvas(false)}
                        >
                            <span className="material-symbols-outlined fill">
                                close
                            </span>
                        </button>
                    </div>

                    <div className="data_content">
                        <table className="table quick_modal_table">
                            <tbody>
                                <tr>
                                    <th>Title</th>
                                    <th>:</th>
                                    <th>{state.item.title}</th>
                                </tr>
                                <tr>
                                    <th>description</th>
                                    <th>:</th>
                                    <th
                                        style={{
                                            whiteSpace: 'pre-wrap',
                                            wordWrap: 'break-word',
                                            maxWidth: '300px',
                                        }}
                                    >
                                        {state.item?.description}
                                    </th>
                                </tr>
                                <tr>
                                    <th>Notice For</th>
                                    <th>:</th>
                                    <th>{state.item.notice_for}</th>
                                </tr>
                                <tr>
                                    <th>Image</th>
                                    <th>:</th>
                                    <th>
                                        <a
                                            href={state.item.image || undefined}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <img
                                                src={
                                                    state.item.image || 'image'
                                                }
                                                alt="profile image"
                                                style={{
                                                    height: 50,
                                                }}
                                            />
                                        </a>
                                    </th>
                                </tr>
                                <tr>
                                    <th>Attachment</th>
                                    <th>:</th>
                                    <th>
                                        <a
                                            href={
                                                state.item.attachment ||
                                                undefined
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <img
                                                src={
                                                    state.item.attachment ||
                                                    'image'
                                                }
                                                alt="profile image"
                                                style={{
                                                    height: 50,
                                                }}
                                            />
                                        </a>
                                    </th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="off_canvas_overlay"></div>
            </div>,
            modalRoot,
        );
    } else {
        return <></>;
    }
};

export default QuickView;
