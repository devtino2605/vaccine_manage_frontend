import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EditOutlined } from '@ant-design/icons';

import DataTable from '../../components/data-table';
import { callFetchPermission } from '../../config/api.permission';
import { groupByPermission } from '../../config/utils';
import ModalRole from '../../components/modal/modal.role';
import { fetchRole } from '../../redux/slice/roleSlice';
import queryString from 'query-string';
import { sfLike } from 'spring-filter-query-builder';
const RolePage = () => {
  const tableRef = useRef();
  const reloadTable = () => {
    tableRef?.current?.reload();
  };
  const dispatch = useDispatch();

  const isFetching = useSelector((state) => state.role.isFetching);
  const meta = useSelector((state) => state.role.meta);
  const roles = useSelector((state) => state.role.result);
  const [openModal, setOpenModal] = useState(false);
  const [listPermissions, setListPermissions] = useState();
  const [singleRole, setSingleRole] = useState();

  useEffect(() => {
    const init = async () => {
      const res = await callFetchPermission('page=1&size=100');
      if (res.data?.result) {
        setListPermissions(groupByPermission(res.data?.result));
      }
    };
    init();
  }, []);

  const columns = [
    {
      title: 'No.',
      key: 'index',
      width: 50,
      align: 'center',
      render: (text, record, index) => {
        return <>{index + 1 + (meta.page - 1) * meta.pageSize}</>;
      },
      hideInSearch: true,
    },
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Actions',
      hideInSearch: true,
      width: 50,
      render: (_value, entity) => (
        <EditOutlined
          style={{
            fontSize: 20,
            color: '#ffa500',
          }}
          onClick={() => {
            setSingleRole(entity);
            setOpenModal(true);
          }}
        />
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

    if (clone.apiPath) q.filter = `${sfLike('apiPath', clone.apiPath)}`;
    if (clone.module) {
      q.filter = clone.apiPath
        ? q.filter + ' and ' + `${sfLike('module', clone.module)}`
        : `${sfLike('module', clone.module)}`;
    }
    if (clone.method) {
      q.filter = clone.apiPath
        ? q.filter + ' and ' + `${sfLike('method', clone.method)}`
        : `${sfLike('method', clone.method)}`;
    }
    if (!q.filter) delete q.filter;

    let temp = queryString.stringify(q);

    let sortBy = '';
    if (sort && sort.apiPath) {
      sortBy = sort.apiPath === 'ascend' ? 'sort=apiPath,asc' : 'sort=apiPath,desc';
    }
    
    temp = `${temp}&${sortBy}`;

    return temp;
  };
  return (
    <>
      <DataTable
        actionRef={tableRef}
        headerTitle='Role List'
        rowKey='id'
        loading={isFetching}
        columns={columns}
        search={false}
        dataSource={roles}
        request={async (params, sort, filter) => {
          const query = buildQuery(params, sort, filter);
          dispatch(fetchRole({ query }));
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
      />
      <ModalRole
        openModal={openModal}
        setOpenModal={setOpenModal}
        listPermissions={listPermissions}
        singleRole={singleRole}
        setSingleRole={setSingleRole}
        reloadTable={reloadTable}
      />
    </>
  );
};
export default RolePage;