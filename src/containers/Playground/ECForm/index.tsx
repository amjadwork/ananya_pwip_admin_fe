import React, { useState, useEffect } from "react";
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
import { eceForm } from "../../../constants/eceForm.constants";

import { Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";

const initialFormState: any = {
  clearInputErrorOnChange: true,
  initialValues: {
    name: "",
    companyName: "",
    contactDetails: "",
    date: "",
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
};

const EceForm = () => {
  // const [total, setTotal] = React.useState([
  //   { exmillPrice: "", transportationCharges: "" },
  // ]);

  const [brokenPercentage, setBrokenPercentage] = useState(5);
  const [containerCount, setContainerCount] = useState(0);

  const form: any = useForm(initialFormState);

  const handleError = (errors: typeof form.errors) => {
    if (errors.name) {
      showNotification({ message: "Please fill name field", color: "red" });
    }
  };

  

  const handleCount = (type: string, name: string) => {
    let count: number = 0;

    count = name === "containerCount" ? containerCount : brokenPercentage;

    const increaseBy: number = name === "containerCount" ? 1 : 5;

    if (type === "increase") {
      count = count + increaseBy;
    }
    if (type === "reduce") {
      count = count - increaseBy;
    }

    if (name === "containerCount") {
      setContainerCount(() => count);
    } else {
      setBrokenPercentage(() => count);
    }
  };

  const handleSubmit = (values: typeof form.values) => {
    console.log("values", values);
    // setTotal(values);
    // console.log("total ", total);

    let price: any = values.exMill;
    const discount: any = brokenPercentage;
    let res: any = discount / 5;
    let factor = res - 1;
    let discountPrice = 300 * factor;

    let finalPrice = price - discountPrice;
    console.log("exMillPrice with discount", finalPrice);

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
      { OriginalBLFee: values?.OriginalBLFee},
    ];
    console.log("totalvalues", totalvalues);

    let arr: any = [];

    console.log("arr", arr);

    totalvalues.forEach((mobile: any) => {
      for (let key in mobile) {
        if (mobile[key]) {
          arr.push(parseFloat(mobile[key]));
        }
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
                key={k.label + i}
                label={k.label}
                placeholder={k.placeholder}
                {...form.getInputProps(k.name)}
              />
            );
          }

          if (k.type === "select") {
            return (
              <Select
                key={k.label + i}
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
                key={k.label + i}
                label={k.label}
                placeholder="Pick date"
                {...form.getInputProps(k.name)}
              />
            );
          }
          if (k.type === "radio") {
            return (
              <Radio.Group label={k.label} key={k.label + i}                     
                onChange ={(value)=>{console.log(value);}}
              >
                {k &&
                  k.options?.map((d: any, i: number) => {
                    return (
                      <Radio key={d.name + i} value={d.name} label={d.name} 
                      // onChange ={(value)=>{console.log(value);}}
                       />
                    );
                  })}
              </Radio.Group>
            );
          }

          <Space h="md" />;
          if (k.type === "counter") {
            return (
              <Group key={k.label + i}>
                {k.label}
                <Button
                  onClick={() => handleCount("reduce", k.name)}
                  disabled={
                    (k.name === "brokenPercentage" && brokenPercentage === 0) ||
                    (k.name === "containerCount" && containerCount === 0)
                  }
                >
                  -
                </Button>
                <Box>
                  {k.name === "containerCount"
                    ? containerCount
                    : brokenPercentage}
                </Box>
                <Button onClick={() => handleCount("increase", k.name)}>
                  +
                </Button>
              </Group>
            );
          }
          // if (k.name === "CfshandlingCharges") {
          //   return <Group key={k.label + i}>
          //       <Button onClick = {()=> handleAction()}>+</Button>
          //   </Group>;
          // }


         
          // if (k.type === "counter" && k.name === "containerCount") {
          //   return (
          //     <Group key={i}>
          //       {k.label}
          //       <Button
          //         onClick={() => setContainerCount(containerCount - 1)}
          //         disabled={containerCount === 0}
          //       >
          //         -
          //       </Button>
          //       <Box>{containerCount}</Box>
          //       <Button onClick={() => setContainerCount(containerCount + 1)}>
          //         +
          //       </Button>
          //     </Group>
          //   );
          // }
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
