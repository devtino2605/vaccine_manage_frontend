import { Badge, Button, message, notification, Popconfirm, Space } from 'antd';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { sfLike } from 'spring-filter-query-builder';
import queryString from 'query-string';

import { callDeleteUser } from '../../config/api.user';
import DataTable from '../../components/data-table';
import { fetchUser } from '../../redux/slice/userSlice';
import ModalUser from '../../components/modal/modal.user';

const UserPage = () => {
  const tableRef = useRef();
  const reloadTable = () => {
    tableRef?.current?.reload();
  };

  const [dataInit, setDataInit] = useState(null);

  const isFetching = useSelector((state) => state.user.isFetching);
  const meta = useSelector((state) => state.user.meta);
  const users = useSelector((state) => state.user.result);
  const dispatch = useDispatch();

  const [openModal, setOpenModal] = useState(false);

  const handleDeleteUser = async (id) => {
    if (id) {
      const res = await callDeleteUser(id);
      if (res && +res.statusCode === 200) {
        message.success('User deleted successfully');
        reloadTable();
      } else {
        notification.error({
          message: res.error,
          description: res.message,
        });
      }
    }
  };

  const columns = [
    {
      title: 'No.',
      key: 'index',
      width: 50,
      align: 'center',
      hideInSearch: true,
      render: (text, record, index) => {
        return <>{index + 1 + (meta.page - 1) * meta.pageSize}</>;
      },
    },
    {
      title: 'Name',
      dataIndex: 'fullname',
      sorter: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: true,
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      hideInSearch: true,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      sorter: true,
    },
    {
      title: 'Center',
      dataIndex: 'centerName',
      hideInSearch: true,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      hideInSearch: true,
      render: (_value, entity) => {
        let color;
        switch (entity.roleName) {
          case 'ADMIN':
            color = '#faad14';
            break;
          case 'DOCTOR':
            color = '#52c41a';
            break;
          case 'CASHIER':
            color = '#1890ff';
            break;
          default:
            color = '#d9d9d9';
        }
        return <Badge count={entity.roleName} showZero color={color} />;
      },
    },
    {
      title: 'Birthday',
      dataIndex: 'birthday',
      hideInSearch: true,
    },
    {
      title: 'Actions',
      hideInSearch: true,
      width: 50,
      render: (_value, entity) => (
        <Space>
          <EditOutlined
            style={{
              fontSize: 20,
              color: '#ffa500',
            }}
            onClick={() => {
              setOpenModal(true);
              setDataInit(entity);
            }}
          />

          <Popconfirm
            placement='leftTop'
            title='Confirm user deletion'
            description='Are you sure you want to delete this user?'
            onConfirm={() => handleDeleteUser(entity.userId)}
            okText='Confirm'
            cancelText='Cancel'
          >
            <span style={{ cursor: 'pointer', margin: '0 10px' }}>
              <DeleteOutlined
                style={{
                  fontSize: 20,
                  color: '#ff4d4f',
                }}
              />
            </span>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const buildQuery = (params, sort) => {
    const clone = { ...params };
    const q = {
      page: params.current,
      size: params.pageSize,
      filter: '',
    };

    if (clone.fullname) q.filter = `${sfLike('fullname', clone.fullname)}`;
    if (clone.email) {
      q.filter = clone.fullname
        ? q.filter + ' and ' + `${sfLike('email', clone.email)}`
        : `${sfLike('email', clone.email)}`;
    }
    if (clone.address) {
      q.filter = q.filter
        ? `${q.filter} and ${sfLike('address', clone.address)}`
        : `${sfLike('address', clone.address)}`;
    }

    if (!q.filter) delete q.filter;

    let temp = queryString.stringify(q);

    let sortBy = '';
    if (sort && sort.fullname) {
      sortBy =
        sort.fullname === 'ascend' ? 'sort=fullname,asc' : 'sort=fullname,desc';
    }
    if (sort && sort.email) {
      sortBy = sort.email === 'ascend' ? 'sort=email,asc' : 'sort=email,desc';
    }
    if (sort && sort.address) {
      sortBy = sort.address === 'ascend' ? 'sort=address,asc' : 'sort=address,desc';
    }
    temp = `${temp}&${sortBy}`;

    return temp;
  };

  return (
    <>
      <DataTable
        actionRef={tableRef}
        headerTitle='User List'
        rowKey='userId'
        loading={isFetching}
        columns={columns}
        dataSource={users}
        request={async (params, sort, filter) => {
          const query = buildQuery(params, sort, filter);
          dispatch(fetchUser({ query }));
        }}
        scroll={{ x: true }}
        pagination={{
          current: meta.page,
          pageSize: meta.pageSize,
          showSizeChanger: true,
          total: meta.total,
          showTotal: (total, range) => {
            return (
              <div>
                {range[0]}-{range[1]} of {total} rows
              </div>
            );
          },
        }}
        rowSelection={false}
        toolBarRender={() => {
          return (
            <Button
              icon={<PlusOutlined />}
              type='primary'
              onClick={() => setOpenModal(true)}
            >
              Add New
            </Button>
          );
        }}
      />
      <ModalUser
        openModal={openModal}
        setOpenModal={setOpenModal}
        reloadTable={reloadTable}
        dataInit={dataInit}
        setDataInit={setDataInit}
      />
    </>
  );
};

export default UserPage;