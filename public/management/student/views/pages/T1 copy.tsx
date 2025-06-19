import React, { useState, useEffect, useContext } from 'react';
import { anyObject } from '../../common_types/object';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment/moment';
import { DashboardContext } from '../layouts/DashboardContext';
export interface Props {}
export interface FeesInfo {
    account: { title: string };
    class: object;
    type: 'income' | 'expense';
    amount: number;
}
interface TotalAmount {
    due_amount: number;
    paid_amount: number;
    // add other fields as needed
}
const T11: React.FC<Props> = (props: Props) => {
    const [error, setError] = useState(null);
    const [presentCount, setPresentCount] = useState(0);
    const [totalDays, setTotalDays] = useState(0);
    const [data, setData] = useState();
    const [accdemicCalander, setAccademicCalander] = useState<any[]>([]);
    const [feesTypes, setFeesTypes] = useState<FeesInfo[]>([]);
    const [totalAmount, setTotalAmount] = useState<TotalAmount | null>(null);
    const [error2, setError2] = useState(null);
    const { loading } = useContext(DashboardContext);

    // async function initdependancy() {
    // await (fetchTypes() as any);
    // }

    // useEffect(() => {
    //     initdependancy();
    // }, []);
    // console.log(accdemicCalander);

    const [selectedDate, setSelectedDate] = useState(
        moment().format('YYYY-MM-DD'),
    ); // Default to today's date

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value); // Update the selected date
    };

    // Dynamically format month and year based on the selected date
    const selectedMoment = moment(selectedDate);
    const month = selectedMoment.format('MMM').toLowerCase(); // e.g., "jan"
    const year = selectedMoment.format('YYYY'); // e.g., "2025"
    const formattedDate = `${month}-${year}`;
    const fetchData = async () => {
        try {
            const response = await axios.get('/api/v1/notices/all/students');
            setData(response.data.data);
            // setData(response.data);
        } catch (error) {
            setError(error);
        }
    };

    // useEffect(() => {
    //     fetchData();
    // }, []);
    interface Attendance {
        student_id: number;
        year: number;
        months: {
            month: string;
            days: {
                status: boolean;
                day: number;
                date: string;
                attendance_status: string;
            }[];
        }[];
    }

    const [attendence, setAttendence] = useState<Attendance[]>([]);
    console.log(attendence);

    // const year = moment().format('YYYY'); // e.g., "2025"
    const fetchAttendenceData = async () => {
        try {
            const response = await axios.get(
                '/api/v1/student-attendances/get-full-year-attendence',
            );
            setAttendence(response.data.data);

            // console.log(response);

            // setAttendence(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchTypes = async () => {
        try {
            const response2 = await axios.get(
                `/api/v1/user-students/fees-categories-student`,
            );
            setFeesTypes(response2.data?.data?.idWiseTotals);
            setTotalAmount(response2.data?.data?.summeries);
        } catch (error) {
            setError2(error);
        }
    };

    async function initdependancy() {
        await (fetchData() as any);
        await (fetchTypes() as any);
        await (fetchAttendenceData() as any);
    }

    // let Attandance: [
    //     {
    //         months: [
    //             {
    //                 month: 'May';
    //                 days: [
    //                     {
    //                         status: 0;
    //                     },
    //                     {
    //                         status: 0;
    //                     },
    //                     {
    //                         status: 0;
    //                     },
    //                     {
    //                         status: 0;
    //                     },
    //                     {
    //                         status: 1;
    //                     },
    //                     {
    //                         status: 0;
    //                     },
    //                     {
    //                         status: 1;
    //                     },
    //                     {
    //                         status: 0;
    //                     },
    //                 ];
    //             },
    //             {
    //                 month: 'June';
    //                 days: [
    //                     {
    //                         status: 0;
    //                     },
    //                     {
    //                         status: 0;
    //                     },
    //                     {
    //                         status: 0;
    //                     },
    //                     {
    //                         status: 0;
    //                     },
    //                     {
    //                         status: 1;
    //                     },
    //                     {
    //                         status: 0;
    //                     },
    //                     {
    //                         status: 1;
    //                     },
    //                     {
    //                         status: 0;
    //                     },
    //                 ];
    //             },
    //         ];
    //     },
    // ];

    // useEffect(() => {
    //     initdependancy();
    // }, []);
    useEffect(() => {
        if (!loading) {
            initdependancy(); // call only after layout finishes
        }
    }, [loading]);
    console.log(data);
    let days = [
        'saturday',
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
    ];
    console.log('total amount', totalAmount);

    function dateFormate(date: string) {
        return moment(date).format('dddd').toLowerCase();
    }
    // console.log('date', dateFormate('2024-09-07T00:00:00.000Z'));

    function get_day_data(i, day) {
        if (dateFormate(i.date) === day) {
            return (
                <li className="absent">
                    <time dateTime="2022-02-02">{i.id}</time>
                    <div className="text-warning">
                        <i className="icon-close"></i>
                        <span className="event_title">Class Present</span>
                    </div>
                </li>
            );
        } else {
            return (
                <li className="absent">
                    <time dateTime="2022-02-02">{i.id}</time>
                </li>
            );
        }
    }

    const fetchAccedemicCalenderData = async () => {
        try {
            const response = await axios.post(
                '/api/v1/academic-calendars/get-academic-event-by-month',
                {
                    month: formattedDate,
                    branch_id: 1,
                },
            );

            // Assuming setAccademicCalander is a state setter function
            setAccademicCalander(response.data.data);

            // Clear any previous errors
            setError(null);
        } catch (error) {
            console.error('Error fetching academic calendar data:', error);
            setError(error); // Assuming setError is a state setter for errors
        }
    };
    useEffect(() => {
        fetchAccedemicCalenderData();
    }, [selectedDate]);

    let array: any[][] = [];
    let count = 0;

    // Initialize the 2D array
    for (let i = 0; i < 5; i++) {
        array[i] = []; // Initialize each row

        for (let j = 0; j < 7; j++) {
            if (count < accdemicCalander.length) {
                array[i][j] = accdemicCalander[count] || { date: '', day: '' };
                count++;
            } else {
                continue;
            }
        }
    }
    const currentMonth = moment().format('MMMM'); // e.g., "June"

    // Assuming your variable is named "Attendance" (not Attandance)
    const attendanceData = attendence[0]; // since it's wrapped in an array

    const monthData = attendanceData?.months.find(
        (m) => m.month.toLowerCase() === currentMonth.toLowerCase(),
    );

    if (monthData) {
        setTotalDays(monthData.days.length);
        setPresentCount(
            monthData.days.filter((day) => day.status === true).length,
        );
    } else {
        console.log(`${currentMonth} not found in attendance data`);
    }
    return (
        <div className="custom_scroll">
            <div
                className="mt-4"
                style={{
                    display: 'grid',
                    gap: '30px',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr)',
                }}
            >
                <div className="card w-100 mb-0" data-intro="This is card">
                    <div className="business-top-widget card-body">
                        <h5 className="mb-2">নোটিশ</h5>
                        <div className="media d-inline-flex">
                            <div className="media-body">
                                <h2 className="total-value m-0 counter">
                                    {data?.length}
                                </h2>
                            </div>
                            <i
                                style={{ opacity: '.4' }}
                                className="icon-bar-chart font-info align-self-center"
                            ></i>
                        </div>
                    </div>
                </div>
                <div className="card w-100 mb-0" data-intro="This is card">
                    <div className="business-top-widget card-body">
                        <h5 className="mb-2">বাড়ির কাজ</h5>
                        <div className="media d-inline-flex">
                            <div className="media-body">
                                <h2 className="total-value m-0 counter">2</h2>
                            </div>
                            <i
                                style={{ opacity: '.4' }}
                                className="icon-bar-chart font-info align-self-center"
                            ></i>
                        </div>
                    </div>
                </div>
                <div className="card w-100 mb-0" data-intro="This is card">
                    <div className="business-top-widget card-body">
                        <h5 className="mb-2">এই মাসের উপস্থিতি</h5>
                        <div className="media d-inline-flex">
                            <div className="media-body">
                                <h2 className="total-value m-0 counter">
                                    78/80
                                </h2>
                            </div>
                            <i
                                style={{ opacity: '.4' }}
                                className="icon-bar-chart font-info align-self-center"
                            ></i>
                        </div>
                    </div>
                </div>
                <div className="card w-100 mb-0" data-intro="This is card">
                    <div className="business-top-widget card-body">
                        <h5 className="mb-2">ফিস বকেয়া</h5>
                        <div className="media d-inline-flex">
                            <div className="media-body">
                                <h2 className="total-value m-0 counter">
                                    {Math.abs(totalAmount?.due_amount || 0)}
                                </h2>
                            </div>
                            <i
                                style={{ opacity: '.4' }}
                                className="icon-bar-chart font-info align-self-center"
                            ></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* attendance calendar */}
            <div className="calendar_dashboard mt-4">
                <div className="card mx-auto">
                    <div className="card-header d-flex justify-content-between flex-wrap">
                        <h5>
                            <i className="icon-calendar me-2"></i>
                            Academic Calendar
                        </h5>
                        <h5>
                            {formattedDate}
                            <span className="ml-2">
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                />
                            </span>
                        </h5>
                    </div>
                    <div className="card-body">
                        <ul>
                            {array.map((value, vIndex) =>
                                value.map((element, eIndex) => (
                                    <>
                                        {
                                            <li
                                                key={`${vIndex}- ${eIndex}`}
                                                className={`${element.day === 5 ? 'absent' : ''} || ${moment(element.date).isSame(moment(), 'day') ? 'today' : ''}`}
                                            >
                                                <time dateTime={element.date}>
                                                    {moment(
                                                        element.date,
                                                    ).format('D')}{' '}
                                                </time>
                                                {/* {element.day} */}
                                                {moment(element.date).format(
                                                    'dddd',
                                                )}
                                                <div
                                                    className={`text-${element.events?.length ? 'warning' : 'info'}`}
                                                >
                                                    {element.events?.map(
                                                        (ev, i) => (
                                                            <div
                                                                key={i}
                                                                className="event"
                                                            >
                                                                <i className="icon-check-box"></i>
                                                                <span className="event_title">
                                                                    {
                                                                        ev.event_name
                                                                    }
                                                                </span>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </li>
                                        }
                                    </>
                                )),
                            )}
                        </ul>
                        {/* <ul>
                            {days.map((index, day) => get_day_data(index, day))}
                        </ul> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default T11;
