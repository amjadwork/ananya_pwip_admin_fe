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
  name: "",
  region: [
    {
      region: "",
      exMill: "",
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

  const handleGetRegions: any = async () => {
    const regionResponse = await APIRequest(
      "location?filterType=source",
      "GET"
    );

    if (regionResponse) {
      const options: any = regionResponse[0].source.map((d: any) => ({
        label: d.region,
        value: d._id,
      }));
      setRegionOptions([...options]);
    }
  };

  const handleAddRegionCost: any = () => {
    form.insertListItem("region", initialFormValues.region[0], {
      ...initialFormValues.region[0],
    });
  };

  const handleRemoveRegionCost = (index: number) => {
    form.removeListItem("region", index);
  };

  const handleError = (errors: typeof form.errors) => {
    if (errors.name) {
      showNotification({ message: "Please fill name field", color: "red" });
    }
  };

  const handleSubmit = async (formValues: typeof form.values) => {
    handleCloseModal(false);
    handleSaveCallback(formValues);
  };

  const categoryOptions = categoryData.map((cat: any) => ({
    value: cat._id,
    label: cat.name,
  }));

  React.useEffect(() => {
    handleGetRegions();
  }, []);

  const fields = form.values.region.map((item: any, index: number) => (
    <React.Fragment key={item.key + index}>
      <Group spacing="md">
        <Select
          required
          label="Select Region"
          placeholder="Eg. Karnal"
          data={regionOptions}
          {...form.getInputProps(`region.${index}.region`)}
        />

        <NumberInput
          required
          label="Ex-Mill"
          placeholder="Eg. 26500"
          {...form.getInputProps(`region.${index}.exMill`)}
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
            {form.values.region.length > 1 && modalType !== "update" ? (
              <ActionIcon
                variant="light"
                color="red"
                onClick={() => handleRemoveRegionCost(index)}
              >
                <Trash size="1rem" />
              </ActionIcon>
            ) : null}
            {index === form.values.region.length - 1 &&
            modalType !== "update" ? (
              <ActionIcon
                variant="light"
                color="blue"
                onClick={() => handleAddRegionCost(index)}
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
        data={categoryOptions}
        {...form.getInputProps("_categoryId")}
      />

      <Space h="md" />

      <TextInput
        required
        label="Variant name"
        placeholder="eg. 1509 Sella"
        {...form.getInputProps("name")}
      />

      <Space h="md" />

      {fields}

      <Group position="right" mt="md">
        <Button type="submit">Save</Button>
      </Group>
    </form>
  );
}

export default AddOrEditProductForm;
