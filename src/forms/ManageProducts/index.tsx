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
  Grid,
  MultiSelect,
  FileInput,
} from "@mantine/core";
import { Trash, Plus } from "tabler-icons-react";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import APIRequest from "../../helper/api";

import { randomId } from "@mantine/hooks";
import axios from "axios";
// testing

const initialFormValues: any = {
  _categoryId: "",
  variantName: "",
  HSNCode: "",
  brokenPercentage: "",
  tags: "",
  images: [],
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
  const handlePictureChange = props.handlePictureChange;

  const [regionOptions, setRegionOptions] = useState<any>([]);
  const [isBasmatiCategory, setIsBasmatiCategory] = useState<boolean>(false);

  const tagsOptions = [
    { value: "raw", label: "Raw" },
    { value: "steam", label: "Steam" },
    { value: "paraboiled", label: "Paraboiled" },
  ];

  const imageFileLabels = ["Image 1", "Image 2", "Image 3", "Image 4"];

  const fileInputs = imageFileLabels.map((label, index) => (
    <Grid.Col key={index}>
      <FileInput
        accept="image/png,image/jpeg"
        placeholder="Upload Image 1"
        onChange={(e) => {
          handlePictureChange(e)
            .then((result: any) => {
              console.log("t", result);
              form.values.images.push({
                url: result.uri,
                // imageSrc: e,
              });
              console.log("RRRRRRR", form.values.images);
            })
            .catch((err: any) => {
              console.log(err);
            });
        }}
      />
    </Grid.Col>
  ));

  console.log(updateFormData, "here here")
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

  useEffect(() => {
    if (modalOpen) {
      handleGetSources();
    }
  }, [modalOpen]);

  //to set if the category selected is Basmati, if yes Tags field will be disabled
  useEffect(() => {
    const selectedCategory = categoryData.find(
      (cat: any) => cat._id === form.values._categoryId
    );
    setIsBasmatiCategory(selectedCategory?.name === "Basmati");
  }, [form.values._categoryId, categoryData]);

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
          precision={2}
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
        label="Variant Name"
        placeholder="eg. 1509 Sella"
        disabled={modalType === "update" ? true : false}
        {...form.getInputProps("variantName")}
      />

      <Space h="md" />

      <Select
        data={tagsOptions || []}
        label="Tags"
        placeholder={isBasmatiCategory ? "Not Applicable" : "eg. steam"}
        disabled={isBasmatiCategory || modalType === "update"}
        {...form.getInputProps("tags")}
      />

      <Space h="md" />

      <TextInput
        label="HSN Code"
        placeholder="eg. CSQ212"
        disabled={modalType === "update" ? true : false}
        {...form.getInputProps("HSNCode")}
      />

      <Space h="md" />

      <NumberInput
        min={0}
        label="Broken %"
        placeholder="eg. 5"
        disabled={modalType === "update" ? true : false}
        {...form.getInputProps("brokenPercentage")}
      />

      <Space h="md" />
      <label htmlFor="imageUpload">Image Upload</label>
      <Grid>{fileInputs}</Grid>

      <Space h="md" />

      {fields}

      <Group position="right" mt="md">
        <Button type="submit">Save</Button>
      </Group>
    </form>
  );
}

export default AddOrEditProductForm;
