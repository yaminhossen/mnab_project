import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { DashboardContext } from '../layouts/DashboardContext';

interface Props {}
interface FeesInfo {
    account: { title: string };
    class: object;
    type: 'income' | 'expense';
    amount: number;
}
interface TotalAmount {
    due_amount: number;
    paid_amount: number;
}
interface AttendanceDay {
    status: boolean;
    day: number;
    date: string;
    attendance_status: string;
}
interface AttendanceMonth {
    month: string;
    days: AttendanceDay[];
}
interface Attendance {
    student_id: number;
    year: number;
    months: AttendanceMonth[];
}

const T1: React.FC<Props> = () => {
    const [error, setError] = useState(null);
    const [presentCount, setPresentCount] = useState(0);
    const [totalDays, setTotalDays] = useState(0);
    const [data, setData] = useState<any[]>([]);
    const [academicCalendar, setAcademicCalendar] = useState<any[]>([]);
    const [feesTypes, setFeesTypes] = useState<FeesInfo[]>([]);
    const [totalAmount, setTotalAmount] = useState<TotalAmount | null>(null);
    const [attendance, setAttendance] = useState<Attendance[]>([]);
    const { loading } = useContext(DashboardContext);

    const [selectedDate, setSelectedDate] = useState(
        moment().format('YYYY-MM-DD'),
    );
    const selectedMoment = moment(selectedDate);
    const formattedMonthYear = `${selectedMoment.format('MMM').toLowerCase()}-${selectedMoment.format('YYYY')}`;

    const fetchData = async () => {
        try {
            const response = await axios.get('/api/v1/notices/all/students');
            setData(response.data.data);
        } catch (err) {
            setError(err);
        }
    };

    const fetchAttendanceData = async () => {
        try {
            const response = await axios.get(
                '/api/v1/student-attendances/get-full-year-attendence',
            );
            setAttendance(response.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchFeesTypes = async () => {
        try {
            const response = await axios.get(
                '/api/v1/user-students/fees-categories-student',
            );
            setFeesTypes(response.data?.data?.idWiseTotals);
            setTotalAmount(response.data?.data?.summeries);
        } catch (err) {
            setError(err);
        }
    };

    const fetchAcademicCalendar = async () => {
        try {
            const response = await axios.post(
                '/api/v1/academic-calendars/get-academic-event-by-month',
                {
                    month: formattedMonthYear,
                    branch_id: 1,
                },
            );
            setAcademicCalendar(response.data.data);
        } catch (err) {
            setError(err);
        }
    };

    useEffect(() => {
        if (!loading) {
            fetchData();
            fetchFeesTypes();
            fetchAttendanceData();
        }
    }, [loading]);

    useEffect(() => {
        fetchAcademicCalendar();
    }, [selectedDate]);

    useEffect(() => {
        const currentMonth = moment().format('MMMM').toLowerCase();
        const currentAttendance = attendance[0];
        const monthInfo = currentAttendance?.months.find(
            (m) => m.month.toLowerCase() === currentMonth,
        );
        if (monthInfo) {
            setTotalDays(monthInfo.days.length);
            setPresentCount(monthInfo.days.filter((day) => day.status).length);
        }
    }, [attendance]);

    const weeks: any[][] = [];
    for (let i = 0; i < 5; i++) {
        weeks[i] = academicCalendar.slice(i * 7, (i + 1) * 7);
    }

    return (
        <div className="custom_scroll">
            <div
                className="mt-4"
                style={{
                    display: 'grid',
                    gap: '30px',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                }}
            >
                <div className="card w-100 mb-0">
                    <div className="business-top-widget card-body">
                        <h5 className="mb-2">নোটিশ</h5>
                        <div className="media d-inline-flex">
                            <div className="media-body">
                                <h2 className="total-value m-0 counter">
                                    {data.length}
                                </h2>
                            </div>
                            <i
                                className="icon-bar-chart font-info align-self-center"
                                style={{ opacity: 0.4 }}
                            ></i>
                        </div>
                    </div>
                </div>
                <div className="card w-100 mb-0">
                    <div className="business-top-widget card-body">
                        <h5 className="mb-2">মাসিক উপস্থিতি</h5>
                        <div className="media d-inline-flex">
                            <div className="media-body">
                                <h2 className="total-value m-0 counter">
                                    {presentCount} / {totalDays}
                                </h2>
                            </div>
                            <i
                                className="icon-bar-chart font-info align-self-center"
                                style={{ opacity: 0.4 }}
                            ></i>
                        </div>
                    </div>
                </div>

                <div className="card w-100 mb-0">
                    <div className="business-top-widget card-body">
                        <h5 className="mb-2">ফিস বকেয়া</h5>
                        <div className="media d-inline-flex">
                            <div className="media-body">
                                <h2 className="total-value m-0 counter">
                                    {Math.abs(totalAmount?.due_amount || 0)}
                                </h2>
                            </div>
                            <i
                                className="icon-bar-chart font-info align-self-center"
                                style={{ opacity: 0.4 }}
                            ></i>
                        </div>
                    </div>
                </div>
            </div>

            <div className="calendar_dashboard mt-4">
                <div className="card mx-auto">
                    <div className="card-header d-flex justify-content-between flex-wrap">
                        <h5>
                            <i className="icon-calendar me-2"></i>
                            Academic Calendar
                        </h5>
                        <h5>
                            {formattedMonthYear}
                            <span className="ml-2">
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) =>
                                        setSelectedDate(e.target.value)
                                    }
                                />
                            </span>
                        </h5>
                    </div>
                    <div className="card-body">
                        <ul>
                            {weeks.map((week, i) =>
                                week.map((day, j) => (
                                    <li
                                        key={`${i}-${j}`}
                                        className={`
                      ${day.day === 5 ? 'absent' : ''}
                      ${moment(day.date).isSame(moment(), 'day') ? 'today' : ''}
                    `}
                                    >
                                        <time dateTime={day.date}>
                                            {moment(day.date).format('D')}
                                        </time>
                                        {moment(day.date).format('dddd')}
                                        <div
                                            className={`text-${day.events?.length ? 'warning' : 'info'} custom_scroll`}
                                        >
                                            {day.events?.map((event, idx) => (
                                                <div
                                                    key={idx}
                                                    className="event"
                                                >
                                                    <i className="icon-check-box"></i>
                                                    <span className="event_title">
                                                        {event.event_name}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </li>
                                )),
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default T1;
