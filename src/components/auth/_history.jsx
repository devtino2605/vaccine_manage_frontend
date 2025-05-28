import { useEffect, useRef, useState } from 'react';
import DataTable from '../data-table';
import { Badge, message, notification, Popconfirm, Space, Tooltip } from 'antd';
import { CloseCircleOutlined, EditOutlined, CopyOutlined } from '@ant-design/icons';
import { callCancelAppointment } from '../../config/api.appointment';
import { callFetchCenter } from '../../config/api.center';
import { callFetchVaccine } from '../../config/api.vaccine';
import solanaClient from '../../config/solnana';
import { useSelector } from 'react-redux';

const History = () => {
    const tableRef = useRef();
    const user = useSelector((state) => state.account.user);

    const [isFetching, setFetching] = useState(false);
    const [listSchedule, setListSchedule] = useState([]);
    const [meta, setMeta] = useState({
        page: 1,
        pageSize: 10,
        pages: 0,
        total: 0,
    });
    const [centers, setCenters] = useState({});
    const [vaccines, setVaccines] = useState({});

    const reloadTable = () => {
        tableRef?.current?.reload();
    };

    const handleCancel = async (id) => {
        if (id) {
            try {
                // Update status on blockchain first
                await solanaClient.updateVaccinationStatus(id, { cancelled: true });
                
                // Then update on server
                const res = await callCancelAppointment(id);
                if (res && +res.statusCode === 200) {
                    message.success('Appointment cancelled successfully');
                    reloadTable();
                } else {
                    notification.error({
                        message: res.error,
                        description: res.message,
                    });
                }
            } catch (error) {
                notification.error({
                    message: 'Error',
                    description: 'Failed to cancel appointment: ' + error.message,
                });
            }
        }
    };

    // Fetch centers and vaccines data
    const fetchCentersAndVaccines = async () => {
        try {
            const [centersRes, vaccinesRes] = await Promise.all([
                callFetchCenter(),
                callFetchVaccine()
            ]);

            if (centersRes?.data?.result) {
                const centersMap = {};
                centersRes.data.result.forEach(center => {
                    centersMap[center.centerId] = center.name;
                });
                setCenters(centersMap);
            }

            if (vaccinesRes?.data?.result) {
                const vaccinesMap = {};
                vaccinesRes.data.result.forEach(vaccine => {
                    vaccinesMap[vaccine.vaccineId] = vaccine.name;
                });
                setVaccines(vaccinesMap);
            }
        } catch (error) {
            console.error('Error fetching centers and vaccines:', error);
        }
    };

    useEffect(() => {
        fetchCentersAndVaccines();
        fetchMyAppointments();
    }, []);

    const fetchMyAppointments = async () => {
        setFetching(true);
        try {
            const res = await solanaClient.getVaccinationRecords(user.id);
            if (res && res.data) {
                setMeta(res.data.meta);
                setListSchedule(res.data.result);
            }
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'Failed to fetch appointments from Solana',
            });
        }
        setFetching(false);
    };

    const columns = [
        {
            title: 'Appointment ID',
            dataIndex: 'appointmentId',
            key: 'appointmentId',
        },
        {
            title: 'Vaccine',
            dataIndex: 'vaccineId',
            key: 'vaccineId',
            render: (vaccineId) => vaccines[vaccineId] || `Vaccine ID: ${vaccineId}`,
        },
        {
            title: 'Appointment Date',
            dataIndex: 'appointmentDate',
            key: 'appointmentDate',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Badge
                    status={
                        status === 'PENDING'
                            ? 'processing'
                            : status === 'COMPLETED'
                            ? 'success'
                            : status === 'CANCELLED'
                            ? 'error'
                            : 'default'
                    }
                    text={status}
                />
            ),
        },
        {
            title: 'Center',
            dataIndex: 'centerId',
            key: 'centerId',
            render: (centerId) => centers[centerId] || `Center ID: ${centerId}`,
        },
        {
            title: 'Doctor',
            dataIndex: 'doctorId',
            key: 'doctorId',
            render: (doctorId) => doctorId ? `Doctor ID: ${doctorId}` : 'Not assigned',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    {record.status === 'PENDING' && (
                        <Popconfirm
                            title="Are you sure you want to cancel this appointment?"
                            onConfirm={() => handleCancel(record.appointmentId)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Tooltip title="Cancel Appointment">
                                <CloseCircleOutlined
                                    style={{ color: 'red', cursor: 'pointer' }}
                                />
                            </Tooltip>
                        </Popconfirm>
                    )}
                    <Tooltip title="Copy Transaction Signature">
                        <CopyOutlined
                            onClick={() => {
                                navigator.clipboard.writeText(record.publicKey);
                                message.success('Transaction signature copied to clipboard');
                            }}
                            style={{ cursor: 'pointer' }}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <DataTable
            actionRef={tableRef}
            headerTitle="My Vaccination History"
            rowKey="appointmentId"
            loading={isFetching}
            columns={columns}
            dataSource={listSchedule}
            pagination={{
                current: meta.page,
                pageSize: meta.pageSize,
                total: meta.total,
                showTotal: (total, range) => {
                    return (
                        <div>
                            {range[0]}-{range[1]} of {total} records
                        </div>
                    );
                },
            }}
            scroll={{ x: true }}
        />
    );
};

export default History;