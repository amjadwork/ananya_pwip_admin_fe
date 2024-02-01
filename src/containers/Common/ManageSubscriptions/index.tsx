import React, { useEffect, useState } from "react";
import PageWrapper from "../../../components/Wrappers/PageWrapper";
import DataTable from "../../../components/DataTable/DataTable";
import { getSubscriptionsData } from "../../../services/plans-management/SubscriptionsAndServices";
import { getPlansData } from "../../../services/plans-management/Plans";
import ReactTable from "../../../components/ReactTable/ReactTable";
import ColumnFilter from "../../../components/ReactTable/ColumnFilter/ColumnFilter";
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
    accessor: "user_id",
    width: "300px",
    sortable: true,
    filterable: true,
    showCheckbox: false,
  },
  {
    Header: "Plan_ID",
    accessor: "planID",
    width: "300px",
    sortable: true,
    filterable: true,
    showCheckbox: true,
  },
  {
    Header: "Payment_ID",
    accessor: "payment_id",
    width: "300px",
    sortable: true,
    filterable: true,
    showCheckbox: true,
  },
  {
    Header: "Amount",
    accessor: "amount_paid",
    width: "300px",
    filterable: true,
    showCheckbox: true,
  },
  {
    Header: "Date",
    accessor: "PaymentDate",
    width: "300px",
    sortable: true,
    filterable: true,
    showCheckbox: true,
  },
  {
    Header: "Status",
    accessor: "payment_status",
    width: "300px",
    sortable: true,
    filterable: true,
    showCheckbox: true,
  },
  {
    Header: "Method",
    accessor: "payment_platform",
    width: "300px",
    fixed: false,
    sortable: true,
    filterable: true,
    showCheckbox: true,
  },
  {
    Header: "Created At",
    accessor: "CreatedAt",
    width: "300px",
    sortable: true,
    filterable: true,
    showCheckbox: true,
  },
  {
    Header: "Updated At",
    accessor: "UpdatedAt",
    width: "300px",
    sortable: true,
    filterable: true,
    showCheckbox: true,
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

  console.log(subscriptionsData, "subscription")
  console.log(plansData, "plans")

  useEffect(() => {
    handleGetSubscriptionsData();
    handleGetPlansData();
  }, []);
console.log(subscriptionsData, "hello")

useEffect(() => {
  if (subscriptionsData && subscriptionsData.length && plansData && plansData.length) {
    let tableData = subscriptionsData
      .filter((item:any) => item.active === 1)
      .map((subscription:any) => {
        const matchedPlan = plansData.find((plan:any) => plan.id === subscription.plan_id);
        return {
          ...subscription,
          planID: matchedPlan ? matchedPlan.id : subscription.plan_id,
          plan: matchedPlan ? matchedPlan : "",
          PaymentDate: IsoDateConverter(subscription.amount_paid_date),
          CreatedAt: IsoDateConverter(subscription.created_at),
          UpdatedAt: IsoDateConverter(subscription.updated_at),
        };
      });
     
    console.log(tableData, "tableData");
    setTableRowData(tableData);
  }
}, [subscriptionsData, plansData]);

  return (
    <PageWrapper PageHeader={() => null} PageAction={() => null}>
      {/* <DataTable data={tableRowData} columns={columns} actionItems={[]} /> */}
      <ReactTable
        data={tableRowData}
        columns={columns}
        onEditRow={() => {}}
        onDeleteRow={() => {}}
      />
    </PageWrapper>
  );
}

export default ManageSubscriptions;
