import React, { useState, useEffect } from 'react';
import { anyObject } from '../../../common_types/object';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment/moment';
import BackButton from '../../components/BackButton';
export interface Props {}

const Markshit: React.FC<Props> = (props: Props) => {
    const [error, setError] = useState(null);
    const [data, setData] = useState<anyObject[]>([]);
    const { id } = useParams();

    useEffect(() => {
        // Function to fetch data
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(
                `/api/v1/exam-student-marks/class-wise-exam/${id}`,
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

    function getGrade(score) {
        if (score >= 30 && score <= 39) {
            return 'D';
        } else if (score >= 40 && score <= 49) {
            return 'C';
        } else if (score >= 50 && score <= 59) {
            return 'B';
        } else if (score >= 60 && score <= 69) {
            return 'A-';
        } else if (score >= 70 && score <= 79) {
            return 'A';
        } else if (score >= 80 && score <= 100) {
            return 'A+';
        } else if (score < 30) {
            return 'F';
        } else {
            return 'Invalid score'; // Handle scores outside the valid range
        }
    }

    return (
        <div className="admin_dashboard">
            <BackButton></BackButton>
            <div>{/* <h3>Current CGPA : 4.50</h3> */}</div>
            <h3 className="table_heading student_semister">Result History</h3>
            <div className="content_body ">
                <div className="data_list mb-4">
                    <div className="table_responsive custom_scroll">
                        <table>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>id</th>
                                    <th>Exam</th>
                                    <th>Subject</th>
                                </tr>
                            </thead>
                            <tbody id="all_list">
                                {data?.map(
                                    (i: { [key: string]: any }, index) => {
                                        return (
                                            <tr>
                                                <td></td>
                                                <td>{index + 1}</td>
                                                <td>{i.title}</td>
                                                {/* <td>{i?.subject?.name}</td>
                                                <td>{i?.obtained_mark}</td> */}
                                                <td>
                                                    <Link
                                                        className="btn btn-sm btn-outline-info"
                                                        to={`/mark-sheet/term-exam/${i.id}/${id}`}
                                                    >
                                                        details
                                                    </Link>
                                                </td>
                                                {/* <td>
                                                    {getGrade(i.obtained_mark)}
                                                </td> */}
                                            </tr>
                                        );
                                    },
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {/* <h3 className="table_heading student_semister">Second Semester</h3>
            <div className="content_body ">
                <div className="data_list">
                    <div className="table_responsive custom_scroll">
                        <table>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>id</th>
                                    <th>Subject</th>
                                    <th>Marks</th>
                                    <th>Grade</th>
                                </tr>
                            </thead>
                            <tbody id="all_list">
                                {datas?.map((i: { [key: string]: any }) => {
                                    return (
                                        <tr>
                                            <td></td>
                                            <td>{i.id}</td>
                                            <td>{i.subject}</td>
                                            <td>{i.marks}</td>
                                            <td>{i.grade}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div> */}
        </div>
    );
};

export default Markshit;
