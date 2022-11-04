import React from "react";
import {
  Group,
  Button,
  TextInput,
  NumberInput,
  Radio,
  Box,
  Select,
  Space,
  Card,
  Input,
  Checkbox,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import {
  eceForm,
  AllCfsCost,
  ALLShippingCost,
} from "../../../constants/eceForm.constants";

import { Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";

const EceForm = () => {
  const [total, setTotal] = React.useState([
    { exmillPrice: "", transportationCharges: "" },
  ]);

  const [count, setCount] = React.useState(5);
  // console.log("count");
  const [countWeight, setCountWeight] = React.useState(0);

  const form = useForm({
    clearInputErrorOnChange: true,
    initialValues: {
      name: "",
      companyName: "",
      contactDetails: "",
      date: "",
      productDetails: "",
      category: "",

      sourcingLocation: "",
      originPort: "",
      destinationPort: "",

      exMill: "",
      BagsCharges: "",

      TransportationCharges: "",
      brokenPercentage: "",
      CfshandlingCharges: "",

      CraftPaper: "",
      SilicaGel: "",
      LoadingCharges: "",
      LTransportationCharges: "",
      CustomCharges: "",
      PQCertificate: "",
      COO: "",

      FinanceCost: "",
      InspectionCost: "",
      Overheads: "",
      ShippingCost: "",

      Thc: "",
      OriginalBLFee: "",
      Surrender: "",
      Muc: "",
      Seal: "",
      ConvenienceFee: "",
      Others: "",

      MarginCost: "",
      Ofc: "",
      InsuranceCost: "",

      chooseOne: "",
      bookingType: "",
      containerWeight: "",
    },
  });

  const handleError = (errors: typeof form.errors) => {
    if (errors.name) {
      showNotification({ message: "Please fill name field", color: "red" });
    }
  };

  const handleSubmit = (values: typeof form.values) => {
    console.log("values", values);
    setTotal(values);
    console.log("total ", total);

    let price: any = values.exMill;
    const discount: any = values.brokenPercentage;
    let res: any = discount / 5;
    let factor = res - 1;
    let discountPrice = 300 * factor;

    let finalPrice = price - discountPrice;
    console.log("final prices", finalPrice);

    const totalvalues: any = [
      { exMill: finalPrice },
      { BagsCharges: values?.BagsCharges },
      { transportationCharges: values?.TransportationCharges },
      { handlingCharges: values?.CfshandlingCharges },
      { FinanceCost: values?.FinanceCost },
      { InspectionCost: values?.InspectionCost },
      { Overheads: values?.Overheads },
      { ShippingCost: values?.ShippingCost },
      { Ofc: values?.Ofc },
      { InsuranceCost: values?.InsuranceCost },
      { MarginCost: values?.MarginCost },
    ];
    console.log(totalvalues);

    let arr: any = [];
    console.log(arr);

    totalvalues.forEach((mobile: any) => {
      for (let key in mobile) {
        arr.push(JSON.parse(mobile[key]));
      }
    });
    console.log("Array", arr);

    const sum = arr.reduce(function summarize(sum: any, number: any) {
      const updatedSum = sum + number;
      return updatedSum;
    }, 0);
    console.log("Sum", sum);
  };
  return (
    <form onSubmit={form.onSubmit(handleSubmit, handleError)}>
      <Card p="xl">
        {eceForm.map((k, i) => {
          if (k.type === "input") {
            return (
              <TextInput
                label={k.label}
                placeholder={k.placeholder}
                {...form.getInputProps(k.name)}
              />
            );
          }


          if (k.type === "select") {
            return (
              <Select
                label={k.label}
                placeholder={k.placeholder}
                data={k.options}
                {...form.getInputProps(k.name)}
              />
            );
          }

          if (k.type === "date") {
            return (
              <DatePicker
                label={k.label}
                placeholder="Pick date"
                {...form.getInputProps(k.name)}
              />
            );
          }
          if (k.type === "radio") {
            return (
              <Radio.Group label={k.label} >
                {k?.options.map((d,i)=>{
                  return(
                    <Radio key={i} value={d.name}   />
                  );
                })}
                
              </Radio.Group>
            );
          }
          <Space h="md" />;
          if (k.name === "bookingType") {
            return (
              <Radio.Group label={k.label}>
                <Radio value="FCL" label="FCL" />
              </Radio.Group>
            );
          }
          <Space h="md" />;
          if (k.name === "containerWeight") {
            return (
              <Radio.Group label={k.label}>
                <Radio value="Metric tons" label="Metric tons" />
                <Radio value="Kg" label="Kg" />
                <Radio value="Quintel" label="Quintel" />
              </Radio.Group>
            );
          }

          <Space h="md" />;
          if (k.type === "counter"&& k.name==="brokenPercentage") {
            return (
              <Group key={i}>
                   {k.label}
                  <Button onClick={() => setCount(count-5)} disabled={count===0}>-</Button>
                  <Box className="counter ">{count}</Box>
                  <Button className="rounded-full ring-1" onClick={() => setCount(count+5)} >+</Button>

                
              </Group>
            );
          }
          if (k.type === "counter" && k.name==="containerCount") {
            return (
              <Group key={i}>
                {k.label}
                  <Button onClick={() => setCountWeight(countWeight-1)} disabled={countWeight===0}>-</Button>

                  <Button className="counter ">{countWeight}</Button>
                  <Button className="rounded-full ring-1" onClick={() => setCountWeight(countWeight+1)} >+</Button>

                
              </Group>
            );
          }
        })}

        <Space h="md" />
        <Button size="xs" color="blue" type="submit">
          Submit
        </Button>
      </Card>
    </form>
  );
};

export default EceForm;
