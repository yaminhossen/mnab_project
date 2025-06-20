import React, { useState, useEffect } from 'react';
import { anyObject } from '../../../../common_types/object';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment/moment';
export interface Props {}

const Complain: React.FC<Props> = (props: Props) => {
    const [error, setError] = useState(null);
    const [data, setData] = useState<any>([]);
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

    useEffect(() => {
        // Function to fetch data
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(
                `/api/v1/user-students/single-student-details/${id}`,
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
    console.log(data);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        let formData = new FormData(e.target);
        console.log('formData', formData);
        try {
            const response = await axios.post(
                '/api/v1/student-complains/store',
                formData,
            );
            // setData(response.data.data.data);
            // setTotalIncome(response.data.data.data2);
        } catch (error) {
            setError(error);
        }
    };
    return (
        <div className="admin_dashboard">
            {/* <h3>Create New Complain</h3> */}
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
                <form onSubmit={handleSubmit} className="form_600 mx-auto pt-3">
                    <div className="form-group form-horizontal">
                        <label>Name</label>
                        <div className="form_elements">
                            <input
                                type="text"
                                placeholder="Name"
                                name="name"
                                value={data.name}
                            />
                            <input type="hidden" name="student_id" value={id} />
                        </div>
                    </div>
                    <div className="form-group form-horizontal">
                        <label>Class</label>
                        <div className="form_elements">
                            <input
                                type="text"
                                placeholder="class"
                                name="class"
                                value={data.student_info?.class?.name}
                            />
                        </div>
                    </div>
                    <div className="form-group form-horizontal">
                        <label>Roll</label>
                        <div className="form_elements">
                            <input
                                type="text"
                                placeholder="roll"
                                name="roll"
                                value={data.student_info?.role_no}
                            />
                        </div>
                    </div>
                    <div className="form-group form-horizontal">
                        <label>
                            Complain <span className="valid_star">*</span>
                        </label>
                        <div className="form_elements">
                            <textarea
                                name="complain"
                                id=""
                                placeholder="Write your complain"
                            ></textarea>
                        </div>
                    </div>
                    <div className="form-group form-horizontal">
                        <label></label>
                        <div className="form_elements">
                            <button className="btn btn-sm btn-outline-info">
                                submit
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Complain;
