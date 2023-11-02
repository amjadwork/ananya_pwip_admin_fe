import React, { useEffect, useState } from "react";
import PageWrapper from "../../../components/Wrappers/PageWrapper";
import DataTable from "../../../components/DataTable/DataTable";
import { getSubscriptionsData } from "../../../services/plans-management/SubscriptionsAndServices";
import { getPlansData } from "../../../services/plans-management/Plans";

const columns = [
  {
    label: "No.",
    key: "serialNo",
    width: "50px",
    fixed: true,
  },
  {
    label: "User_ID",
    key: "user_id",
    width: "100px",
  },
  {
    label: "Plan_ID",
    key: "planID",
    width: "100px",
    sortable: true,
  },
  {
    label: "Payment_ID",
    key: "payment_id",
    width: "150px",
    sortable: true,
  },
  {
    label: "Amount",
    key: "amount_paid",
    width: "130px",
  },
  {
    label: "Payment Status",
    key: "payment_status",
    width: "150px",
  },
  {
    label: "Payment Date",
    key: "amount_paid_date",
    width: "130px",
  },
  {
    label: "Payment Method",
    key: "payment_platform",
    width: "150px",
    fixed: true,
  },
];

function ManageSubscriptions() {
  const [subscriptionsData, setSubscriptionsData] = useState<any>([]);
  const [plansData, setPlansData] = useState<any>([]);
  const [tableRowData, setTableRowData] = useState<any>([]);

  //to get Subscription Data from database
  const handleGetSubscriptionsData = async () => {
    const response = await getSubscriptionsData();

    if (response) {
      setSubscriptionsData([...response]);
    }
  };

  //to get Plans Data from database
  const handleGetPlansData = async () => {
    const response = await getPlansData();

    if (response) {
      setPlansData([...response]);
    }
  };

  useEffect(() => {
    handleGetSubscriptionsData();
    handleGetPlansData();
  }, []);

  useEffect(() => {
    if (
      subscriptionsData &&
      subscriptionsData.length &&
      plansData &&
      plansData.length
    ) {
      let tableData: any = [];
      const activeSubscriptionData = subscriptionsData.filter(
        (item: any) => item.active === 1
      );
      activeSubscriptionData.forEach((subscription: any) => {
        const matchedId = plansData.find(
          (plan: any) => plan.id === subscription.plan_id
        );
        const obj = {
          ...subscription,
          planID: matchedId ? matchedId.id : subscription.plan_id,
          plan: matchedId ? matchedId : "",
        };
        tableData.push(obj);
      });
      setTableRowData(tableData);
    }
  }, [subscriptionsData, plansData]);

  return (
    <PageWrapper PageHeader={() => null} PageAction={() => null}>
      <DataTable data={tableRowData} columns={columns} actionItems={[]} />
    </PageWrapper>
  );
}

export default ManageSubscriptions;
