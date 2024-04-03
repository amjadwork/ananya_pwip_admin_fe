import React, { useEffect, useState } from "react";
import PageWrapper from "../../../components/Wrappers/PageWrapper";
import { getUsersData } from "../../../services/user-management/Users";
import { getLogsData } from "../../../services/logs-management/Logs";
import ReactTable from "../../../components/ReactTable/ReactTable";
import { IsoDateConverter } from "../../../helper/helper";

const columns = [
  {
    Header: "No.",
    accessor: "serialNo",
    width: "50px",
    fixed: true,
    disableFilters: true,
    showCheckbox: false,
  },
  {
    Header: "User_ID",
    accessor: "userID",
    width: "200px",
    sortable: true,
    filterable: true,
    showCheckbox: false,
  },
  {
    Header: "Method",
    accessor: "method",
    width: "190px",
    sortable: true,
    filterable: true,
    showCheckbox: false,
  },
  {
    Header: "Endpoint",
    accessor: "endpoint",
    width: "400px",
    sortable: true,
    filterable: true,
    showCheckbox: false,
  },
  {
    Header: "Request Body",
    accessor: "requestBody",
    width: "400px",
    sortable: true,
    filterable: false,
    showCheckbox: false,
  },
  {
    Header: "Time Stamp",
    accessor: "timeStamp",
    width: "250px",
    sortable: true,
    filterable: false,
    showCheckbox: false,
  },
];

function ManageLogs() {
  const [logsData, setLogsData] = useState<any>([]);
  const [tableRowData, setTableRowData] = useState<any>([]);
  const [usersData, setUsersData] = useState<any>([]);

  //to get Logs Data from database
  const handleGetLogsData = async () => {
    const response = await getLogsData();

    if (response) {
      setLogsData([...response]);
    }
  };

  //to get User Data from database
  const handleGetUsersData = async () => {
    const response = await getUsersData();
    if (response) {
      setUsersData([...response]);
    }
  };

  useEffect(() => {
    handleGetLogsData();
    handleGetUsersData();
  }, []);

  useEffect(() => {
    if (logsData.length && usersData.length) {
      let tableData = logsData.map((log: any) => {
        // Iterate over the keys of the requestBody object
        const matchedUser = usersData.find(
          (user: any) => user._id === log.userId
        );
        return {
          ...log,
          requestBody: log.requestBody || [],
          userID: matchedUser ? matchedUser._id : log.user_id,
          user: matchedUser ? matchedUser : "", // Add users data
          timeStamp: IsoDateConverter(log.timestamp),
        };
      });
      setTableRowData(tableData);
    }
  }, [logsData, usersData]);

  return (
    <PageWrapper PageHeader={() => null} PageAction={() => null}>
      <ReactTable
        data={tableRowData}
        columns={columns}
        actionButtons={[]}
        onEditRow={() => {}}
        onDeleteRow={() => {}}
      />
    </PageWrapper>
  );
}

export default ManageLogs;
