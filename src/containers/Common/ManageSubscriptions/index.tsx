import React, { useEffect, useState } from "react";

import PageWrapper from "../../../components/Wrappers/PageWrapper";
import DataTable from "../../../components/DataTable/DataTable";
import { getSubscriptionsData } from "../../../services/plans-management/Subscriptions";
import { dummySubscription } from "../../../constants/subscriptions.constants";

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

  //to get Plans  Data from database
  const handleGetSubscriptionsData = async () => {
    // const response = await getSubscriptionsData();
    // if (response) {
    //   setSubscriptionsData([...response]);
    // }
  };

  useEffect(() => {
    setSubscriptionsData(dummySubscription);
    handleGetSubscriptionsData();
  }, []);

  console.log("data", subscriptionsData);

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
      <DataTable data={dummySubscription} columns={columns} actionItems={[]} />
    </PageWrapper>
  );
}

export default ManageSubscriptions;
