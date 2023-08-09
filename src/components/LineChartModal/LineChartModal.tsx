import React, { useState, useEffect } from 'react';
import { Button } from "@mantine/core";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DateRangePicker } from '@mantine/dates';
import APIRequest from "../../helper/api";
import moment from "moment";

const LineChartModal = (props:any) => {
const variantsData=props.variantsData;
const [graphData, setGraphData] = useState<any>([]);
const [selectedRange, setSelectedRange] = useState<[Date | null, Date | null]>(() => {
  const currentDate = new Date();
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  return [startOfMonth, endOfMonth];
});

const handleGetVariantPriceTrend= async () => {

  if ( variantsData && selectedRange[0] && selectedRange[1]) {
    const start = moment(selectedRange[0]).startOf('day').toISOString();
    const end = moment(selectedRange[1]).endOf('day').toISOString();

    const queryParams = new URLSearchParams();
    queryParams.append('sourceId', variantsData._sourceId);
    queryParams.append('startDate', start);
    queryParams.append('endDate', end);

    const url = `history/variant/${variantsData._variantId}?${queryParams.toString()}`;

    const response = await APIRequest(url, "GET");

    if (response) {
        const filteredResponse: { price: number; createdAt: any; }[] = response.map((item: { price: number; createdAt: string; }) => ({
            price: item.price,
            date: new Date(item.createdAt)
          }));
          console.log(filteredResponse,"filtered")
     setGraphData(filteredResponse)
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

  useEffect(()=>{
    handleGetVariantPriceTrend();
  }, [selectedRange]);


  return (
    <div style={{ width: '100%' }}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
    
      <DateRangePicker
        placeholder="Pick Date Range"
        value={selectedRange}
        onChange={setSelectedRange}
        style={{ width:'100%' ,marginRight: '8px' }} 
      />

   <Button.Group
   style={{ width:'20%'}}>
      <Button 
      variant="default"
      onClick={handlePastMonthClick}
      >Month</Button>
      <Button 
      variant="default"
      onClick={handlePastWeekClick}
      >Week</Button>
    </Button.Group>
      </div>

      <ResponsiveContainer width="100%" height={500}>
        <LineChart
          width={500}
          height={300}
          data={graphData}
          margin={{
            top: 50,
            right: 40,
            left: 0,
            bottom: 50,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => moment(date).format('DD-MMMM')}
            // label={{ value: 'day', position: 'bottom', dy: 10 }}
          />
          <YAxis
            dataKey="price"
            // label={{ value: 'Price', position: 'left', dy: 10 }}
            domain={['dataMin', 'dataMax']}
            tickCount={10}
          />
          <Tooltip
           wrapperStyle={{ backgroundColor: 'lightgray' }} 
           labelFormatter={(label) => moment(label).format('hh:mm:ss, DD-MM-YYYY')}
           formatter={(value) => `${value} INR`} />
          <Line connectNulls type="monotone" dataKey="price" stroke="#8884d8" fill="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartModal;





