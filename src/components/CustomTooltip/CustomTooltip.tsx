import React from "react";
import { Tooltip } from "@mantine/core";
import { InfoCircle } from "tabler-icons-react";

interface UserData {
  full_name: string;
  email: string;
  phone: string;
}

interface PlanData {
  name: string;
  price: number;
  currency?: string;
  validity: number;
  validity_type?: string;
  refund_policy: number;
  refund_policy_valid_day?: number;
}

type DataType = UserData | PlanData;

interface CustomTooltipProps {
  data?: DataType;
  type: "user" | "plan";
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ data, type }) => {
  const getContent = () => {
    if (type === "user" && data) {
      const userData = data as UserData;
      return (
        <div>
          <div>
            <strong>Name:</strong> {userData.full_name}
          </div>
          <div>
            <strong>Email:</strong> {userData.email}
          </div>
          <div>
            <strong>Phone:</strong> {userData.phone}
          </div>
        </div>
      );
    } else if (type === "plan" && data) {
      const planData = data as PlanData;
      return (
        <div>
          <div>
            <strong>Plan:</strong> {planData.name}
          </div>
          <div>
            <strong>Price:</strong> {planData.price}{" "}
            {planData.currency || "null"}
          </div>
          <div>
            <strong>Validity:</strong> {planData.validity}{" "}
            {planData.validity_type || "null"}
          </div>
          <div>
            <strong>Refundable:</strong>{" "}
            {planData.refund_policy === 1
              ? `Yes, ${planData.refund_policy_valid_day} day/s`
              : "No"}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {data ? (
        <Tooltip
          width={230}
          withArrow={true}
          arrowSize={5}
          position="top"
          color={"#407bbf"}
          transition="pop"
          transitionDuration={200}
          events={{
            hover: true,
            focus: false,
            touch: false,
          }}
          label={getContent()}
          multiline={true}
          style={{ marginTop: 8, marginLeft: 8 }}
        >
          <span
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "left",
            }}
          >
            <InfoCircle
              size={18}
              strokeWidth={2}
              color={"#2d4c86"}
              style={{ marginInline: 3, marginTop: 3 }}
            />
          </span>
        </Tooltip>
      ) : (
        <InfoCircle
          size={18}
          strokeWidth={1.5}
          color={"gray"}
          style={{ marginInline: 3, marginTop: 3, cursor: "default" }}
        />
      )}
    </>
  );
};

export default CustomTooltip;
