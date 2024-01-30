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
  FileInput,
} from "@mantine/core";
import { Trash, Plus } from "tabler-icons-react";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import APIRequest from "../../helper/api";

import { randomId } from "@mantine/hooks";
import axios from "axios";
import ImageUpload from "../../components/ImageUpload/ImageUpload";
import { resolve } from "path";
import {
  updateIndividualVariantSourceRate,
  uploadingMultipleImagesToS3,
} from "../../helper/helper";
// testing

const initialFormValues: any = {
  _categoryId: "",
  variantName: "",
  HSNCode: "",
  brokenPercentage: "",
  tags: "",
  images: [],
  imagesArray: [],
  sourceRates: [
    {
      _sourceId: "",
      price: "",
      key: randomId(),
    },
  ],
  updateSourceRates: false,
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
  const [updateFormImages, setUpdateFormImages] = useState<string[]>([]);
  const [isBasmatiCategory, setIsBasmatiCategory] = useState<boolean>(false);

  const form = useForm({
    clearInputErrorOnChange: true,
    initialValues: { ...initialFormValues },

    validate: {
      variantName: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
    },
  });

  const tagsOptions = [
    { value: "raw", label: "Raw" },
    { value: "steam", label: "Steam" },
    { value: "paraboiled", label: "Paraboiled" },
  ];

  const handleDeleteImage = (index: number) => {
    const updatedImages = [...form.values.images];
    updatedImages.splice(index, 1);
    form.setFieldValue("images", updatedImages);
    setUpdateFormImages([...updatedImages]);
  };

  const imageFileLabels = ["Image 1", "Image 2", "Image 3", "Image 4"];

  const fileInputs = imageFileLabels.map((label, index) => (
    <Grid.Col key={index}>
      <FileInput
        accept="image/png,image/jpeg"
        label="Upload file (png/jpg)"
        onChange={(e) => {
          handlePictureChange(e)
            .then((result: any) => {
              form.values.imagesArray.push({
                url: result.uri,
                src: e,
                publicUrl: result.publicUri,
                index,
                label,
              });
            })
            .catch((err: any) => {
              console.log(err);
            });
        }}
      />
    </Grid.Col>
  ));

  const existingImages = updateFormImages.map((imageUrl: any, index: any) => (
    <ImageUpload
      key={index}
      imageUrl={imageUrl}
      onDelete={() => handleDeleteImage(index)}
    />
  ));

  const combinedFileInputs = [
    ...existingImages,
    ...fileInputs.slice(updateFormImages.length),
  ];

  useEffect(() => {
    if (updateFormData && modalType === "update") {
      form.setValues(updateFormData);

      const images = updateFormData.images || [];
      setUpdateFormImages([...images]);
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
    if(modalType==="add"){
      if (formValues.imagesArray && formValues.imagesArray.length > 0) {
        for (const image of formValues.imagesArray) {
          const uri = image.url;
          const publicURI = image.publicUrl;
          const file = image.src;
          try {
            const response = await axios.put(`${uri}`, file).then(() => {
              form.values.images.push(publicURI);
            });
          } catch (error) {
            console.error(`Error processing image: ${error}`);
            // Handle error as needed
          }
        }
      }
      handleCloseModal(false);
      handleSaveCallback(formValues);  
    }
    if(modalType==="update"){
    const payloadCommonVariantDetails = { ...form.values };
    delete payloadCommonVariantDetails.sourceRates;
    delete payloadCommonVariantDetails.imagesArray;
    if (formValues.imagesArray.length !== 0) {
      const uploadImageResponseArr = await uploadingMultipleImagesToS3(
        form.values
      );
      payloadCommonVariantDetails.images = uploadImageResponseArr;
      }
    if (formValues.updateSourceRates) {
      const x = await updateIndividualVariantSourceRate(
        formValues._variantId,
        formValues.sourceRates[0]._id,
        formValues.updatePrice
      );
    }
    handleCloseModal(true);
    //variant common fields update
    handleSaveCallback(payloadCommonVariantDetails);
  }

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
          // onChange={(e) => {
          //   form.setFieldValue("updateSourceRates", true);
          // }}
        />

        <NumberInput
          required
          label="Ex-Mill"
          placeholder="Eg. 56.50"
          precision={2}
          {...form.getInputProps(`sourceRates.${index}.price`)}
          onChange={(e) => {
            form.setFieldValue("updateSourceRates", true);
            form.setFieldValue(`sourceRates.${index}.price`, e);
            form.setFieldValue(`updatePrice`, e);
          }}
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
        {...form.getInputProps("_categoryId")}
      />

      <Space h="md" />

      <TextInput
        required
        label="Variant Name"
        placeholder="eg. 1509 Sella"
        {...form.getInputProps("variantName")}
      />

      <Space h="md" />

      <Select
        data={tagsOptions || []}
        label="Tags"
        placeholder={isBasmatiCategory ? "Not Applicable" : "eg. steam"}
        disabled={isBasmatiCategory}
        {...form.getInputProps("tags")}
      />

      <Space h="md" />

      <TextInput
        label="HSN Code"
        placeholder="eg. CSQ212"
        {...form.getInputProps("HSNCode")}
      />

      <Space h="md" />

      <NumberInput
        min={0}
        label="Broken %"
        placeholder="eg. 5"
        {...form.getInputProps("brokenPercentage")}
      />
      <Space h="md" />

      <label htmlFor="imageUpload">Image Upload</label>
      <Space h="sm" />
      <Grid>{combinedFileInputs}</Grid>

      <Space h="md" />

      {fields}

      <Group position="right" mt="md">
        <Button type="submit">Save</Button>
      </Group>
    </form>
  );
}

export default AddOrEditProductForm;
