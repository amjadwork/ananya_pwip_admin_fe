import React, { useEffect, useState } from "react";

import PageWrapper from "../../../components/Wrappers/PageWrapper";
import DataTable from "../../../components/DataTable/DataTable";
import { getSubscriptionsData } from "../../../services/plans-management/SubscriptionsAndServices";

const columns = [
  {
    label: "User_ID",
    key: "user_id",
  },
  {
    label: "Plan_ID",
    key: "plan_id",
    sortable: true,
  },
  {
    label: "Payment_ID",
    key: "payment_id",
    sortable: true,
  },
  {
    label: "Amount",
    key: "amount_paid",
  },
  {
    label: "Payment Date",
    key: "amount_paid_date",
  },
  {
    label: "Payment Method",
    key: "payment_platform",
  },
];

function ManageSubscriptions() {
  const [subscriptionsData, setSubscriptionsData] = useState<any>([]);
  const [tableRowData, setTableRowData] = useState<any>([]);

  //to get Subscription Data from database
  const handleGetSubscriptionsData = async () => {
    const response = await getSubscriptionsData();
    console.log(response, "response")
    if (response) {
      setSubscriptionsData([...response]);
    }
  };

  useEffect(() => {
    handleGetSubscriptionsData();
  }, []);

  useEffect(() => {
    if (subscriptionsData && subscriptionsData.length) {
      let tableData: any = [];
      subscriptionsData.forEach((d: any) => {
        const obj = {
          ...d,
        };
        tableData.push(obj);
      });
      setTableRowData(tableData);
    }
  }, [subscriptionsData]);

  return (
    <PageWrapper PageHeader={() => null} PageAction={() => null}>
      <DataTable data={tableRowData} columns={columns} actionItems={[]} />
    </PageWrapper>
  );
}

export default ManageSubscriptions;
