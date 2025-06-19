import React, { useState, useEffect } from 'react';
import { anyObject } from '../../../../common_types/object';
import { Link, Outlet } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment/moment';
export interface Props {}

const BasicInformation: React.FC<Props> = (props: Props) => {
    const [error, setError] = useState(null);
    const [data, setData] = useState<any>([]);

    useEffect(() => {
        // Function to fetch data
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(
                '/api/v1/user-teachers/basic-information',
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
    return (
        <div className="admin_dashboard">
            <h3 className="table_heading">Basic information</h3>
            <table className="table text-nowrap">
                <tbody>
                    <tr>
                        <td>Permanent Address:</td>
                        <td className="font-medium text-dark-medium">
                            {data.teacher_infos?.parmenent_address}
                        </td>
                    </tr>
                    <tr>
                        <td>Present Address:</td>
                        <td className="font-medium text-dark-medium">
                            {data.teacher_infos?.present_address}
                        </td>
                    </tr>
                    <tr>
                        <td>Country:</td>
                        <td className="font-medium text-dark-medium">
                            {data.teacher_infos?.country}
                        </td>
                    </tr>
                    <tr>
                        <td>District:</td>
                        <td className="font-medium text-dark-medium">
                            {data.teacher_infos?.district}
                        </td>
                    </tr>
                    <tr>
                        <td>Qualification:</td>
                        <td className="font-medium text-dark-medium">
                            {data.teacher_infos?.qualification}
                        </td>
                    </tr>
                    <tr>
                        <td>Blood Group:</td>
                        <td className="font-medium text-dark-medium">
                            {data.teacher_infos?.blood_group}
                        </td>
                    </tr>
                    <tr>
                        <td>IsMarried:</td>
                        <td className="font-medium text-dark-medium">
                            {data.teacher_infos?.is_married == true
                                ? 'Yes'
                                : 'No'}
                        </td>
                    </tr>
                    <tr>
                        <td>Guardian Contact Number:</td>
                        <td className="font-medium text-dark-medium">
                            {data.teacher_infos?.guardian_contact_number}
                        </td>
                    </tr>
                    <tr>
                        <td>Status:</td>
                        <td className="font-medium text-dark-medium">
                            {data.status}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default BasicInformation;
