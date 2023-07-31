import React, { useState, useEffect } from "react";
import {
  Group,
  NumberInput,
  Flex,
  Box,
  Space,
  Stepper,
  Radio,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { Card, Select, Button, Checkbox } from "../../components/index";
import { useForm } from "@mantine/form";
import { eceForm } from "../../constants/eceForm.constants";

import { showNotification } from "@mantine/notifications";
import { getAllLocationData } from "../../services/export-costing/Locations";
import { getPackagingData, getProductData, getSpecificCategoryData, getSpecificVariantData } from "../../services/export-costing/Playground";

const initialFormState: any = {
  clearInputErrorOnChange: true,
  initialValues: {
    bookingType: "",

    dollarPrice: "",

    shipmentTerms: "",

    productType: "",
    productCategory: "",
    variety: "",

    sourcingLocation: "",
    originPort: "",
    destinationPort: "",

    containerType: "",
    containerCount: "",
    containerWeight: "",
    exMill: "",

    bagTypes: "",
    bagWeight: "",
    bagsCharges: "",

    TransportationCharges: "",
    brokenPercentage: "",
    CfshandlingCharges: "",

    FinanceCost: "",
    InspectionCost: "",
    Overheads: "",
    ShippingCost: "",

    OriginalBLFee: "",
    MarginCost: "",
    InsuranceCost: "",
  },
};

const EceForm: any = (props: any) => {
  let handleExportPlayground: any = props.handleExportPlayground;

  const [checked, setChecked] = useState(false);
  const [term, setTerm] = useState("");
  const [playgroundSlidesData, setPlaygroundSlidesData] = useState<any>(null);

  const [brokenPercentage, setBrokenPercentage] = useState(5);
  const [containerCount, setContainerCount] = useState(0);
  const [initialFormValue, setInitialFormValue] = useState([...eceForm]);
  const [productList, setProductList] = useState([]);
  const [categoryList, setCategoryList] = useState<any>([]);
  const [variantsList, setVariantsList] = useState<any>([]);
  const [locationList, setLocationList] = useState<any>([]);
  const [bagList, setBagList] = useState<any>([]);
  const [bagWeightList, setBagWeightList] = useState<any>([]);
  const [intialFormValueState, setIntialFormValueState] =
    useState<any>(initialFormState);
  const [bagPrice, setBagPrice] = useState<any>("");

  const [activeSlide, setActiveSlide] = useState<any>(1);

  const [selectedProductVariant, setSelectedProductVariant] =
    useState<any>(null);
  const [exMillPrice, setExMillPrice] = useState<any>(0);

  const form: any = useForm(intialFormValueState);

  const handleNextSlide = () => {
    let currentStep = activeSlide;

    if (currentStep < eceForm.length + 1) {
      currentStep = currentStep + 1;
    }

    setActiveSlide(currentStep);
  };

  const handlePrevSlide = () => {
    let currentStep = activeSlide;

    if (currentStep > 1) {
      currentStep = currentStep - 1;
    }

    setActiveSlide(currentStep);
  };

  const handleGetUSDRate = async () => {
    const headers = new Headers();
    headers.append("apikey", "LeZx4lzxu88JcvSJ4BXAViKIWqgUrNdB");

    const requestOptions: any = {
      method: "GET",
      redirect: "follow",
      headers: headers,
    };

    fetch(
      "https://api.apilayer.com/exchangerates_data/convert?to=INR&from=USD&amount=1",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        playgroundSlidesData[
          "1"
        ][0].label = `Today's Dollar Price ($1 = Rs ${result?.result})`;

        let obj: any = {
          ...intialFormValueState,
        };

        obj.initialValues.dollarPrice = result?.result;

        setIntialFormValueState(obj);
        setPlaygroundSlidesData(playgroundSlidesData);
      })
      .catch((error) => console.error("error", error));
  };

  const handleSettingFormValues = (
    response: any,
    compareString: any,
    key?: string
  ) => {
    const formValues = [...initialFormValue].map((d: any) => {
      let obj = { ...d };
      if (obj.name === compareString) {
        obj.options = response.map((p: any) => {
          if (key) {
            return {
              label: p[key],
              value: p._id,
            };
          }

          return {
            label: p.name,
            value: p._id,
          };
        });
      }
      return { ...obj };
    });
    setInitialFormValue(formValues);
  };

  const handleGetProductData = async () => {
    const productResponse: any = await getProductData()

    if (productResponse) {
      setProductList(productResponse);

      handleSettingFormValues(productResponse, "productType");

      return true;
    } else {
      return false;
    }
  };

  const handleGetCategoryData = async (id: string) => {
    const productId = id;

    const categoryDetailResponse: any = await getSpecificCategoryData(productId)
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

    const variantResponse: any = await getSpecificVariantData(categoryIds)

    if (variantResponse) {
      setVariantsList(variantResponse);

      handleSettingFormValues(variantResponse, "variety");
    }
  };

  const handleGetPackageData = async (dataType?: any) => {
    const packagingResponse: any = await getPackagingData()
    
    if (packagingResponse) {
      if (dataType === "weight") {
        handleSettingFormValues(packagingResponse, "bagWeight", "weight");
        setBagWeightList(packagingResponse);
      } else {
        setBagList(packagingResponse);
        handleSettingFormValues(packagingResponse, "bagTypes", "bag");
      }
    }
  };

  const handleGetLocationsData = async () => {
    const locationResponse: any = await getAllLocationData()
    if (locationResponse) {
      setLocationList(locationResponse);

      const formValues = [...initialFormValue].map((d: any) => {
        let obj = { ...d };
        // if (obj.name === "sourcingLocation") {
        //   obj.options = locationResponse[0].source.map((p: any) => ({
        //     label: p.region,
        //     value: p._id,
        //   }));
        // }

        // if (obj.name === "originPort") {
        //   obj.options = locationResponse[0].origin.map((p: any) => ({
        //     label: p.portName,
        //     value: p._id,
        //   }));
        // }

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

    let obj = { ...intialFormValueState };
    obj.initialValues[name] = count;
    setIntialFormValueState(obj);
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
      { exMill: intialFormValueState?.initialValues?.exMill },
      { bagsCharges: intialFormValueState?.initialValues?.bagsCharges },
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

    const displayData = {
      ...values,
      ...intialFormValueState.initialValues,
      TransportationCharges: values?.TransportationCharges,
      CfshandlingCharges: values?.CfshandlingCharges,
      FinanceCost: values?.FinanceCost,
      InspectionCost: values?.InspectionCost,
      Overheads: values?.Overheads,
      ShippingCost: values?.ShippingCost,
      OriginalBLFee: values?.OriginalBLFee,
      MarginCost: values?.MarginCost,
      InsuranceCost: values?.InsuranceCost,
      dollarPrice:
        values?.dollarPrice ||
        intialFormValueState.initialValues.dollarPrice ||
        0,
      containerWeight: values?.containerWeight,
      bookingType: values?.bookingType,
    };

    console.log(values, displayData);

    handleExportPlayground({ ...displayData, total: totalsum });
  };

  React.useEffect(() => {
    handleGetProductData();
  }, []);

  React.useEffect(() => {
    if (productList.length) {
      handleGetLocationsData();
    }
  }, [productList]);

  React.useEffect(() => {
    if (variantsList.length) {
      handleGetPackageData("bag");
    }
  }, [variantsList]);

  // bagList
  React.useEffect(() => {
    if (bagList.length) {
      handleGetPackageData("weight");
    }
  }, [bagList]);

  React.useEffect(() => {
    handleGetUSDRate();
  }, []);

  function onChangeHandler(name: any, value: any) {
    let obj = { ...intialFormValueState };
    obj.initialValues[name] = value;

    setIntialFormValueState(obj);

    if (name === "productType") {
      const productId = value;
      handleGetCategoryData(productId);
    }

    if (name === "productCategory") {
      const catIds = [value];
      handleGetVariantData(catIds);
    }

    if (name === "variety") {
      const selectedVariant = variantsList.find((f: any) => f._id === value);
      setSelectedProductVariant(selectedVariant);

      const formValues = [...initialFormValue].map((d: any) => {
        let obj = { ...d };
        if (obj.name === "sourcingLocation") {
          obj.options = selectedVariant?.costing?.map((p: any) => ({
            label: p?.regionName || "",
            value: p._id,
          }));
        }

        return { ...obj };
      });

      setInitialFormValue(formValues);
    }

    if (name === "sourcingLocation") {
      const formValues = [...initialFormValue].map((d: any) => {
        let obj = { ...d };
        if (obj.name === "exMill") {
          const selectedSource = selectedProductVariant?.costing?.find(
            (f: any) => f?._id === value
          );
          obj.value = selectedSource?.exMill;
        }

        return { ...obj };
      });

      setIntialFormValueState({
        ...obj,
        initialValues: {
          ...obj.initialValues,
          exMill: formValues[10].value,
        },
      });
      setInitialFormValue(formValues);
    }

    if (name === "destinationPort") {
      const formValues = [...initialFormValue].map((d: any) => {
        let obj = { ...d };
        if (obj.name === "originPort") {
          const selectedDestination = locationList[0]?.destination?.find(
            (f: any) => {
              if (f?._id === value) {
                return f;
              }
            }
          );

          obj.options = selectedDestination?.linkedOrigin.map((d: any) => ({
            label: d.originPortName,
            value: d._originId,
          }));
        }

        return { ...obj };
      });
      setInitialFormValue(formValues);
    }

    if (name === "bagTypes") {
      const selectedBags = bagList.find((f: any) => f._id === value);
      setBagPrice(selectedBags.cost);
      setIntialFormValueState({
        ...obj,
        initialValues: {
          ...obj.initialValues,
          bagsCharges: selectedBags.cost,
        },
      });

      const formValues = [...initialFormValue].map((d: any) => {
        let obj = { ...d };
        if (obj.name === "bagsCharges") {
          obj.value = parseFloat(selectedBags.cost);
        }

        return { ...obj };
      });

      setInitialFormValue(formValues);
    }
  }

  var groupBy = function (xs: any, key: any) {
    return xs.reduce(function (rv: any, x: any) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  useEffect(() => {
    const slides = groupBy([...initialFormValue], "step");
    setPlaygroundSlidesData(slides);
  }, [initialFormValue]);

  return (
    <form
      style={{ height: "100%" }}
      onSubmit={form.onSubmit(handleSubmit, handleError)}
    >
      <Space h="xl" />
      <Stepper
        active={activeSlide - 1}
        breakpoint="sm"
        onStepClick={(index: number) => setActiveSlide(index + 1)}
        iconSize={32}
      >
        {playgroundSlidesData &&
          Object.keys(playgroundSlidesData)?.map((key: any, index: any) => {
            if (parseInt(key) === 13) {
              return (
                <Stepper.Completed key={index}>
                  Completed, click back button to get to previous step
                </Stepper.Completed>
              );
            }
            return <Stepper.Step>Step {key}</Stepper.Step>;
          })}
      </Stepper>
      <Space h="xl" />
      {playgroundSlidesData &&
        Object.keys(playgroundSlidesData)?.map((step: any, index: number) => {
          if (parseInt(step) === activeSlide) {
            return (
              <Card
                p="xl"
                key={step + index}
                mih={350}
                mah={350}
                pos="relative"
              >
                <Flex
                  gap="lg"
                  justify="flex-start"
                  align="flex-start"
                  direction="column"
                  wrap="wrap"
                  w="100%"
                >
                  {playgroundSlidesData[step]?.map((k: any, i: number) => {
                    if (k.type === "numInput") {
                      return (
                        <NumberInput
                          key={k.label + i}
                          label={k.label}
                          placeholder={k.placeholder}
                          w="100%"
                          withAsterisk
                          min={0}
                          hideControls
                          defaultValue={k.value || 0}
                          {...form.getInputProps(k.name)}
                        />
                      );
                    }

                    if (k.type === "checkbox") {
                      return (
                        <Checkbox
                          key={i}
                          label={k.label}
                          checked={checked}
                          onChange={(event: any) =>
                            setChecked(event.currentTarget.checked)
                          }
                          w="100%"
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
                          onChange={(value: any) =>
                            onChangeHandler(k.name, value)
                          }
                          w="100%"
                          withAsterisk
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
                          w="100%"
                          {...form.getInputProps(k.name)}
                        />
                      );
                    }
                    if (k.type === "radio") {
                      return (
                        <Radio.Group
                          label={k.label}
                          key={k.label + i}
                          w="100%"
                          {...form.getInputProps(k.name)}
                        >
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

                    if (k.type === "counter") {
                      return (
                        <Group key={k.label + i} w="100%">
                          {k.label}
                          <Button
                            onClick={() => handleCount("reduce", k.name)}
                            disabled={
                              (k.name === "brokenPercentage" &&
                                brokenPercentage === 0) ||
                              (k.name === "containerCount" &&
                                containerCount === 0)
                            }
                          >
                            -
                          </Button>
                          <Box>
                            {k.name === "containerCount"
                              ? containerCount
                              : brokenPercentage}
                          </Box>
                          <Button
                            onClick={() => handleCount("increase", k.name)}
                          >
                            +
                          </Button>
                        </Group>
                      );
                    }
                  })}
                </Flex>

                <Space h="xl" />

                <Flex
                  gap="md"
                  justify="flex-end"
                  align="center"
                  direction="row"
                  wrap="wrap"
                  pos="absolute"
                  w="100%"
                  bottom={0}
                  right={0}
                  px={24}
                  pb={24}
                >
                  <Button
                    size="xs"
                    color="gray"
                    type="button"
                    onClick={handlePrevSlide}
                    disabled={activeSlide === 1}
                  >
                    Back
                  </Button>

                  <Button
                    size="xs"
                    color="blue"
                    type="submit"
                    disabled={activeSlide !== 13}
                    sx={{
                      display: parseInt(step) === 13 ? "block" : "none",
                    }}
                  >
                    Submit
                  </Button>

                  {parseInt(step) !== 13 && (
                    <Button
                      size="xs"
                      color="blue"
                      type="button"
                      onClick={handleNextSlide}
                      disabled={activeSlide === 13}
                    >
                      Next
                    </Button>
                  )}
                </Flex>
              </Card>
            );
          }
        })}
    </form>
  );
};

export default EceForm;
