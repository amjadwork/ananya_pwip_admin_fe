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

import { showNotification } from "@mantine/notifications";

import APIRequest from "../../../helper/api";

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

    FinanceCost: "",
    InspectionCost: "",
    Overheads: "",
    ShippingCost: "",

    OriginalBLFee: "",
    MarginCost: "",
    Ofc: "",
    InsuranceCost: "",
  },
};

const EceForm = () => {
  const [checked, setChecked] = useState(false);
  const [term, setTerm] = useState("");

  const [brokenPercentage, setBrokenPercentage] = useState(5);
  const [containerCount, setContainerCount] = useState(0);
  const [initialFormValue, setInitialFormValue] = useState([...eceForm]);
  const [productList, setProductList] = useState([]);
  const [categoryList, setCategoryList] = useState<any>([]);
  const [variantsList, setVariantsList] = useState<any>([]);
  const [locationList, setLocationList] = useState<any>([]);

  const form: any = useForm(initialFormState);

  const handleSettingFormValues = (response: any, compareString: any) => {
    const formValues = [...initialFormValue].map((d: any) => {
      let obj = { ...d };
      if (obj.name === compareString) {
        obj.options = response.map((p: any) => ({
          label: p.name,
          value: p._id,
        }));
      }
      return { ...obj };
    });

    console.log("formValues", formValues);

    setInitialFormValue(formValues);
  };

  const handleGetProductData = async () => {
    const productResponse: any = await APIRequest("product", "GET");

    if (productResponse) {
      setProductList(productResponse);

      handleSettingFormValues(productResponse, "productType");
    }
  };

  const handleGetCategoryData = async (id: string) => {
    const productId = id;

    const categoryDetailResponse: any = await APIRequest(
      `category?_productId=${productId}`,
      "GET"
    );
    if (categoryDetailResponse) {
      setCategoryList(categoryDetailResponse[0].category || []);

      handleSettingFormValues(
        categoryDetailResponse[0].category,
        "productCategory"
      );
    }
  };

  const handleGetVariantData = async (ids: Array<[]>) => {
    const categoryIds = ids;

    const variantResponse: any = await APIRequest(
      `variant?_categoryId=${categoryIds}`,
      "GET"
    );
    if (variantResponse) {
      setVariantsList(variantResponse);

      handleSettingFormValues(variantResponse, "variety");
    }
  };

  const handleGetLocationsData = async () => {
    const locationResponse: any = await APIRequest(`location`, "GET");
    // setLocationList
    if (locationResponse) {
      setVariantsList(locationResponse);

      const formValues = [...initialFormValue].map((d: any) => {
        let obj = { ...d };
        if (obj.name === "sourcingLocation") {
          obj.options = locationResponse[0].source.map((p: any) => ({
            label: p.region,
            value: p._id,
          }));
        }

        if (obj.name === "originPort") {
          obj.options = locationResponse[0].origin.map((p: any) => ({
            label: p.portName,
            value: p._id,
          }));
        }

        if (obj.name === "destinationPort") {
          obj.options = locationResponse[0].destination.map((p: any) => ({
            label: p.portName,
            value: p._id,
          }));
        }
        return { ...obj };
      });

      setInitialFormValue(formValues);
    }
  };

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
    const terms: string = values.shipmentTerms;

    setTerm(terms);

    let price: any = values.exMill;

    const discount: any = brokenPercentage;
    let res: any = discount / 5;
    let factor = res - 1;
    let discountPrice = 300 * factor;

    let finalPrice = price - discountPrice;

    const totalvalues: any = [
      { exMill: finalPrice },
      { BagsCharges: values?.BagsCharges },
      { transportationCharges: values?.TransportationCharges },
      { handlingCharges: values?.CfshandlingCharges },
      { FinanceCost: values?.FinanceCost },
      { InspectionCost: values?.InspectionCost },
      { Overheads: values?.Overheads },
      { ShippingCost: values?.ShippingCost },
      { InsuranceCost: values?.InsuranceCost },
      { MarginCost: values?.MarginCost },
      { OriginalBLFee: values?.OriginalBLFee },
      // { Ofc: values?.Ofc },
    ];

    let arr: any = [];

    totalvalues.forEach((mobile: any) => {
      for (let key in mobile) {
        if (mobile[key]) {
          arr.push(parseFloat(mobile[key]));
        }
      }
    });

    const sum = arr.reduce(function summarize(sum: any, number: any) {
      const updatedSum = sum + number;
      return updatedSum;
    }, 0);

    let totalsum: any = sum;

    if (checked === true) {
      totalsum = totalsum + (20 * totalsum) / 100;
      return totalsum;
    } else {
      totalsum = totalsum;
    }
  };

  React.useEffect(() => {
    handleGetProductData();
  }, []);

  React.useEffect(() => {
    if (productList.length && variantsList.length) {
      handleGetLocationsData();
    }
  }, [productList, variantsList]);

  function onChangeHandler(name: any, value: any) {
    if (name === "productType") {
      const productId = value;
      handleGetCategoryData(productId);
    }

    if (name === "productCategory") {
      const catIds = [value];
      handleGetVariantData(catIds);
    }
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit, handleError)}>
      <Card p="xl">
        {initialFormValue?.map((k: any, i: number) => {
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

          <Space h="xl" />;

          if (k.type === "checkbox") {
            return (
              <Checkbox
                key={i}
                label={k.label}
                checked={checked}
                onChange={(event) => setChecked(event.currentTarget.checked)}
              />
            );
          }

          if (k.type === "select") {
            return (
              <Select
                key={k.label + i}
                label={k.label}
                placeholder={k.placeholder}
                data={k.options || []}
                name={k.name}
                onChange={(value) => onChangeHandler(k.name, value)}
                // {...form.getInputProps(k.name)}
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
              <Radio.Group label={k.label} key={k.label + i}>
                {k &&
                  k.options?.map((d: any, i: number) => {
                    return (
                      <Radio
                        key={d.name + i}
                        value={d.name}
                        label={d.name}
                      ></Radio>
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
