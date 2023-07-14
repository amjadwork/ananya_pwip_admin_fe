import React, { useState, useEffect } from "react";
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
import { Trash, Plus } from "tabler-icons-react";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import APIRequest from "../../helper/api";

import { randomId } from "@mantine/hooks";

// testing

const initialFormValues: any = {
  _categoryId: "",
  variantName: "",
  sourceRates: [
    {
      _sourceId: "",
      price: "",
      key: randomId(),
    },
  ],
};

function AddOrEditProductForm(props: any) {
  const handleCloseModal = props.handleCloseModal;
  const categoryData = props.categoryData || [];
  const handleSaveCallback = props.handleSaveCallback;
  const updateFormData = props.updateFormData;
  const modalType = props.modalType || "add";
  const modalOpen = props.modalOpen || false;

  const [regionOptions, setRegionOptions] = useState<any>([]);

  const form = useForm({
    clearInputErrorOnChange: true,
    initialValues: { ...initialFormValues },

    validate: {
      variantName: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
    },
  });

  useEffect(() => {
    if (updateFormData && modalType === "update") {
      form.setValues(updateFormData);
    }
  }, [updateFormData, modalType]);

  const handleGetSources: any = async () => {
    const regionResponse = await APIRequest("location/source", "GET");

    if (regionResponse) {
      const options: any = regionResponse.source.map((d: any) => ({
        label: d.region,
        value: d._id,
      }));
      setRegionOptions([...options]);
    }
  };

  const handleAddRegionCost: any = () => {
    form.insertListItem("sourceRates", initialFormValues.sourceRates[0], {
      ...initialFormValues.sourceRates[0],
    });
  };

  const handleRemoveRegionCost = (index: number) => {
    form.removeListItem("sourceRates", index);
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
    if (modalOpen) {
      handleGetSources();
    }
  }, [modalOpen]);

  const fields = form.values.sourceRates.map((item: any, index: number) => (
    <React.Fragment key={item?.key + index * 12}>
      <Group spacing="md">
        <Select
          required
          label="Select Region"
          placeholder="Eg. Karnal"
          data={regionOptions}
          {...form.getInputProps(`sourceRates.${index}._sourceId`)}
        />

        <NumberInput
          required
          label="Ex-Mill"
          placeholder="Eg. 26500"
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
                onClick={() => handleRemoveRegionCost(index)}
              >
                <Trash size="1rem" />
              </ActionIcon>
            ) : null}
            {index === form.values.sourceRates.length - 1 &&
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
        disabled={modalType === "update" ? true : false}
        {...form.getInputProps("_categoryId")}
      />

      <Space h="md" />

      <TextInput
        required
        label="Variant name"
        placeholder="eg. 1509 Sella"
        disabled={modalType === "update" ? true : false}
        {...form.getInputProps("variantName")}
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
