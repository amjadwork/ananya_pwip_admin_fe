import React, { useState, useEffect } from "react";
import { Button, Grid, Table } from "@mantine/core";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DateRangePicker } from "@mantine/dates";
import APIRequest from "../../helper/api";
import { eximColumn } from "../../constants/eximColumn.constants";
import { dummyEximData } from "../../constants/dummyEximData.constants";
import ReactTable from "../../components/ReactTable/ReactTable";
import { camelCaseToTitleCase } from "../../helper/helper";
import moment from "moment";

const LineChartModal = (props: any) => {
  const variantsData = props.variantsData;
  const variantProperties = props.variantProperties;
  const [graphData, setGraphData] = useState<any>([]);
  const [selectedRange, setSelectedRange] = useState<
    [Date | null, Date | null]
  >(() => {
    const currentDate = new Date();
    const pastSixMonths = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 5,
      1
    ); // Subtracting 5 months to get 6 months ago
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );
    return [pastSixMonths, endOfMonth];
  });

  // Extract keys with rangeFrom and rangeTo properties
  const properties = Object.keys(variantProperties)
    .filter((key) => key !== "_id" && key !== "variantId" && key !== "__v")
    .map((key) => {
      if (key === "grainType" || key === "grainColour") {
        return {
          name: camelCaseToTitleCase(key),
          value: camelCaseToTitleCase(variantProperties[key]) || " N/A",
        };
      } else {
        const { rangeFrom, rangeTo, unit } = variantProperties[key];
        return {
          name: camelCaseToTitleCase(key),
          value:
            rangeTo || rangeFrom ? `${rangeFrom}-${rangeTo} ${unit}` : "N/A",
        };
      }
    });

  const handleGetVariantPriceTrend = async () => {
    if (variantsData && selectedRange[0] && selectedRange[1]) {
      const start = moment(selectedRange[0]).startOf("day").toISOString();
      const end = moment(selectedRange[1]).endOf("day").toISOString();

      const queryParams = new URLSearchParams();
      queryParams.append("sourceId", variantsData._sourceId);
      queryParams.append("startDate", start);
      queryParams.append("endDate", end);

      const url = `history/variant/${variantsData._variantId}?${queryParams.toString()}`;

      const response = await APIRequest(url, "GET");

      if (response) {
        const filteredResponse: { price: number; date: any }[] = response.map(
          (item: { price: number; createdAt: string }) => ({
            price: item.price,
            date: new Date(item.createdAt),
          })
        );
        filteredResponse.push({
          price: variantsData.price,
          date: new Date(variantsData.updatedAt),
        });

        setGraphData(filteredResponse);
      }
    }
  };

  const handlePastMonthClick = () => {
    const currentDate = new Date();
    const pastMonth = new Date(currentDate);
    pastMonth.setMonth(currentDate.getMonth() - 1);
    setSelectedRange([pastMonth, currentDate]);
    handleGetVariantPriceTrend();
  };

  const handlePastWeekClick = () => {
    const currentDate = new Date();
    const pastWeek = new Date(currentDate);
    pastWeek.setDate(currentDate.getDate() - 7);
    setSelectedRange([pastWeek, currentDate]);
    handleGetVariantPriceTrend();
  };

  const handle3MonthClick = () => {
    const currentDate = new Date();
    const pastThreeMonths = new Date(currentDate);
    pastThreeMonths.setMonth(currentDate.getMonth() - 3);
    setSelectedRange([pastThreeMonths, currentDate]);
    handleGetVariantPriceTrend();
  };

  const handle6MonthClick = () => {
    const currentDate = new Date();
    const pastSixMonths = new Date(currentDate);
    pastSixMonths.setMonth(currentDate.getMonth() - 6);
    setSelectedRange([pastSixMonths, currentDate]);
    handleGetVariantPriceTrend();
  };

  const handle1YearClick = () => {
    const currentDate = new Date();
    const pastYear = new Date(currentDate);
    pastYear.setFullYear(currentDate.getFullYear() - 1);
    setSelectedRange([pastYear, currentDate]);
    handleGetVariantPriceTrend();
  };

  const handle2YearClick = () => {
    const currentDate = new Date();
    const pastTwoYears = new Date(currentDate);
    pastTwoYears.setFullYear(currentDate.getFullYear() - 2);
    setSelectedRange([pastTwoYears, currentDate]);
    handleGetVariantPriceTrend();
  };

  useEffect(() => {
    handleGetVariantPriceTrend();
  }, [selectedRange]);

  useEffect(() => {
    handleGetVariantPriceTrend();
  }, []);

  return (
    <div style={{ paddingInline: "12px" }}>
      <div
        style={{
          backgroundColor: "#F3F7F9",
          marginBottom: "10px",
          padding: "10px",
        }}
      >
        <div style={{ fontSize: "14px", fontWeight: "bold", color: "#006EB4" }}>
          {variantsData?.sourceName}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{ fontSize: "24px", fontWeight: "bold", color: "#1B1B1B" }}
          >
            {variantsData?.variantName}
          </div>
          <div
            style={{
              fontSize: "12px",
              fontWeight: "normal",
              color: "#006EB4",
              marginLeft: "2px",
              marginTop: "10px",
            }}
          >
            {variantsData?.categoryName}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{ fontSize: "18px", fontWeight: "bold", color: "#003559" }}
          >
            &#x20B9;{variantsData?.price}/{variantsData?.unit}
          </div>
          <div
            style={{
              fontSize: "12px",
              fontWeight: "normal",
              color: "#808080",
              marginLeft: "2px",
              marginTop: "10px",
            }}
          >
            HSN Code: {variantsData?.HSNCode || "N/A"}
          </div>
        </div>
      </div>
      <div>
        <Grid columns={24} grow gutter="xs">
          <Grid.Col
            span={15}
            style={{ backgroundColor: "#F4F4F4", marginRight: "10px" }}
          >
            <div
              style={{
                padding: "8px",
              }}
            >
              <DateRangePicker
                placeholder="Pick Date Range"
                value={selectedRange}
                onChange={setSelectedRange}
              />

              <ResponsiveContainer width={800} height={450}>
                <LineChart
                  data={graphData}
                  margin={{
                    top: 30,
                    right: 0,
                    left: 50,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => moment(date).format("DD-MM-YYYY")}
                    tick={{
                      fontSize: 12,
                      textAnchor: "middle",
                    }}
                    // label={{ value: 'day', position: 'bottom', dy: 10 }}
                  />
                  <YAxis
                    dataKey="price"
                    domain={["dataMin", "dataMax"]}
                    tickCount={10}
                    tick={{
                      fontSize: 14,
                      textAnchor: "end",
                    }}
                  />
                  <Tooltip
                    wrapperStyle={{ backgroundColor: "white" }}
                    labelFormatter={(label) =>
                      `date: ${moment(label).format("DD-MM-YYYY")}`
                    }
                    formatter={(value, name, props) => {
                      if (
                        props?.payload?.date ===
                        graphData[graphData.length - 1].date
                      ) {
                        return (
                          <span>
                            {value} INR{" "}
                            <div style={{ color: "green", fontSize: "13px" }}>
                              current price
                            </div>
                          </span>
                        );
                      } else {
                        return [`price: ${value} INR`];
                      }
                    }}
                  />
                  <Line
                    connectNulls
                    type="monotone"
                    dataKey="price"
                    stroke="#006EB4"
                    fill="#006EB4"
                    activeDot={{ r: 6, fill: "green" }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <Button.Group
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  variant="default"
                  onClick={handlePastWeekClick}
                  style={{ flex: 1 }}
                >
                  1W
                </Button>

                <Button
                  variant="default"
                  onClick={handlePastMonthClick}
                  style={{ flex: 1 }}
                >
                  1M
                </Button>
                <Button
                  variant="default"
                  onClick={handle3MonthClick}
                  style={{ flex: 1 }}
                >
                  3M
                </Button>
                <Button
                  variant="default"
                  onClick={handle6MonthClick}
                  style={{ flex: 1 }}
                >
                  6M
                </Button>
                <Button
                  variant="default"
                  onClick={handle1YearClick}
                  style={{ flex: 1 }}
                >
                  1Y
                </Button>
                <Button
                  variant="default"
                  onClick={handle2YearClick}
                  style={{ flex: 1 }}
                >
                  2Y
                </Button>
              </Button.Group>
            </div>
          </Grid.Col>
          <Grid.Col
            span={7}
            style={{
              paddingTop: "40px",
            }}
          >
            <Table
              verticalSpacing="sm"
              fontSize="sm"
              withBorder
              withColumnBorders
            >
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property, index) => (
                  <tr key={index}>
                    <td>{property.name}</td>
                    <td>{property.value}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Grid.Col>
        </Grid>
        <div
          style={{
            padding: "5px",
            marginTop: "10px",
          }}
        >
          <ReactTable
            data={dummyEximData}
            columns={eximColumn}
            actionButtons={[]}
          />
        </div>
      </div>
    </div>
  );
};

export default LineChartModal;
