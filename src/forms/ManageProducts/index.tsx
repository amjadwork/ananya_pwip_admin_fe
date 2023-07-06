import React, { useState, useRef, useEffect } from "react";
import {
  Group,
  Button,
  TextInput,
  NumberInput,
  Select,
  Space,
  ActionIcon,
  Flex,
} from "@mantine/core";
import { Minus, Trash, Plus } from "tabler-icons-react";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import APIRequest from "../../helper/api";

import { randomId } from "@mantine/hooks";

const initialFormValues: any = {
  _categoryId: "",
  variantName: "",
  sourceRates: [
    {
      _sourceId: "",
      price:"",
      unit: "kg",
      key: randomId(),
    },
  ],
};

function AddOrEditProductForm(props: any) {
  const inputRef: any = useRef(null);

  const handleCloseModal = props.handleCloseModal;
  const categoryData = props.categoryData || [];
  const handleSaveCallback = props.handleSaveCallback;
  const variantsData = props.variantsData;
  const updateFormData = props.updateFormData;
  const modalType = props.modalType || "add";
  // const handleDeleteVariant=props.handleDeleteVariant;

  const [variantRegionCostingList, setVariantRegionCostingList] = useState<any>(
    variantsData?.costing || []
  );
  const [numberValue, setNumberValue] = useState(0);
  const [regionValue, setRegionValue] = useState("");
  const [regionOptions, setRegionOptions] = useState<any>([]);
  const form = useForm({
    clearInputErrorOnChange: true,
    initialValues: { ...initialFormValues },

    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
    },
  });

  useEffect(() => {
    if (updateFormData && modalType === "update") {
      console.log(updateFormData);
      form.setValues(updateFormData);
    }
  }, [updateFormData, modalType]);

  const handleGetSource: any = async () => {
    const response= await APIRequest(
      "location?filterType=source",
      "GET"
    );

    if (response) {
      const options: any = response[0].source.map((d: any) => ({
        label: d.region,
        value: d._id,
      }));
      setRegionOptions([...options]);
    }
  };

  const handleAddSourceRates: any = () => {
    form.insertListItem("sourceRates", initialFormValues.sourceRates[0], {
      ...initialFormValues.sourceRates[0],
    });
  };

  const handleTrashSourceRates = (index: number) => {
    form.removeListItem("sourceRates", index);
  };

  const handleError = (errors: typeof form.errors) => {
    if (errors.name) {
      showNotification({ message: "Please fill name field", color: "red" });
    }
  };
console.log(form.values, "form")
  const handleSubmit = async (formValues: typeof form.values) => {
    handleCloseModal(false);
    handleSaveCallback(formValues);
    let obj: any = { ...formValues };
    if (variantRegionCostingList.length) {
      obj.costing = variantRegionCostingList;
    }
  console.log("formValues",variantRegionCostingList)
    const payload = { ...obj };

    const response = await APIRequest("variant", "POST", payload);
    if(response){
      showNotification({
        message: "Successfully added variant",
        color: "green",
      });

    }
  
  };

  const selectCategory = categoryData.map((cat: any) => ({
    value: cat._id,
    label: cat.name,
  }));

  React.useEffect(() => {
    handleGetSource();
  }, []);

  const fields = Array.isArray(form.values.sourceRates) && form.values.sourceRates.map((item: any, index: number) => (
    <React.Fragment key={item.key + index}>
      <Group spacing="md">
        <Select
          required
          searchable
          label="Select Source"
          placeholder="eg. Karnal"
          data={regionOptions}
          {...form.getInputProps(`sourceRates.${index}._sourceId`)}
        />

        <NumberInput
          required
          label="Rate/kg"
          placeholder="eg. 26.4"
          {...form.getInputProps(`sourceRates.${index}.price`)}
        />

        <Flex
          justify="space-between"
          align="flex-end"
          direction="row"
          sx={() => ({
            marginTop: `3%`,
          })}
        >
          <Group spacing="md" position="right" margin-bottom="5px">
            {form.values.sourceRates.length > 1 && modalType !== "update" ? (
              <ActionIcon
                variant="light"
                color="red"
                onClick={() => handleTrashSourceRates(index)}
              >
                <Trash size="1rem" />
              </ActionIcon>
            ) : null}
            {index === form.values.sourceRates.length - 1 &&
            modalType !== "update" ? (
              <ActionIcon
                variant="light"
                color="blue"
                onClick={() => handleAddSourceRates(index)}
              >
                <Plus size="1rem" />
              </ActionIcon>
            ) : null}
          </Group>
        </Flex>
      </Group>
      <Space h="md" />
    </React.Fragment>
  ));

  return (
    <form onSubmit={form.onSubmit(handleSubmit, handleError)}>
      <Select
        required
        label="Select Category"
        placeholder="Eg. Non-Basmati"
        data={selectCategory}
        {...form.getInputProps("_categoryId")}
      />

      <Space h="md" />

      <TextInput
        required
        label="Enter Variant"
        placeholder="eg. 1509 Sella"
        {...form.getInputProps("variantName")}
      />

      <Space h="md" />

      {fields}

      <Group position="right" mt="md">
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  );
}

export default AddOrEditProductForm;
