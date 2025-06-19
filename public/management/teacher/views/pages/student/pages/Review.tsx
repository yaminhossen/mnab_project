import React, { useState, useEffect } from 'react';
import { anyObject } from '../../../../common_types/object';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment/moment';
import { useSelector } from 'react-redux';
import { initialState } from '../config/store/inital_state';
import { RootState } from '../../../../store';
import setup from '../config/setup';
export interface Props {}

const Review: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);
    const { id } = useParams();
    const [classValue, setClassValue] = useState<string | null>(null);

    useEffect(() => {
        const hash = window.location.hash; // "#/student/review/12?class=1"
        const queryIndex = hash.indexOf('?');

        if (queryIndex !== -1) {
            const queryString = hash.substring(queryIndex + 1); // "class=1"
            const params = new URLSearchParams(queryString);
            setClassValue(params.get('class'));
        }
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(
                `/api/v1/student-evaluation-criterias/criterias`,
            );
            setData(response.data.data);
            // setData(response.data);
        } catch (error) {
            setError(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    console.log(classValue);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        let formData = new FormData(e.target);
        console.log('formData', formData);
        try {
            const response = await axios.post(
                '/api/v1/student-evaluations/store',
                formData,
            );
            (window as any).toaster('Review done');
            // setData(response.data.data.data);
            // setTotalIncome(response.data.data.data2);
        } catch (error) {
            setError(error);
        }
    };
    return (
        <div className="admin_dashboard">
            {/* <h3>Create New Review</h3> */}
            <div className="dues_back_btn">
                <h3 className="table_heading"></h3>
                <button className="back_btn settings_bacsk">
                    <Link to={`/student/details/${classValue}`}>
                        <span className="material-symbols-outlined fill">
                            arrow_back
                        </span>
                        <div className="text">Back</div>
                    </Link>
                </button>
            </div>
            <div className="content_body">
                <div className="data_list">
                    <form
                        onSubmit={handleSubmit}
                        className="form_600 mx-auto pt-3"
                    >
                        <div className="table_responsive custom_scroll">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Key point</th>
                                        <th>Score</th>
                                        <th>Obtain mark</th>
                                    </tr>
                                </thead>
                                <tbody id="all_list">
                                    <input
                                        type="hidden"
                                        name="criteria_count"
                                        value={data.length}
                                    />
                                    <input
                                        type="hidden"
                                        name="student_id"
                                        value={id}
                                    />
                                    {data && data.length > 0 ? (
                                        data.map(
                                            (
                                                i: { [key: string]: any },
                                                index,
                                            ) => (
                                                <tr key={i.id}>
                                                    <td>{i.name}</td>
                                                    <td>{i.max_score}</td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            min={0}
                                                            max={i.max_score}
                                                            name={`score${index}`}
                                                            placeholder="given marks"
                                                            onInput={(
                                                                e: React.ChangeEvent<HTMLInputElement>,
                                                            ) => {
                                                                const value =
                                                                    parseFloat(
                                                                        e.target
                                                                            .value,
                                                                    );
                                                                if (
                                                                    value >
                                                                    i.max_score
                                                                ) {
                                                                    e.target.value =
                                                                        i.max_score;
                                                                }
                                                                if (value < 0) {
                                                                    e.target.value =
                                                                        '0';
                                                                }
                                                            }}
                                                        />
                                                        <input
                                                            type="hidden"
                                                            name={`criteria_id${index}`}
                                                            value={i.id}
                                                        />
                                                    </td>
                                                </tr>
                                            ),
                                        )
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={3}
                                                style={{
                                                    textAlign: 'center',
                                                    color: 'white',
                                                }}
                                            >
                                                No data found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="attendance_form_btn student_submit">
                            <button
                                className="btn btn-sm btn-outline-info "
                                type="submit"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Review;
