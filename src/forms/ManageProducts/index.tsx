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
  Alert,
} from "@mantine/core";
import { Trash, Plus } from "tabler-icons-react";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import APIRequest from "../../helper/api";

import { randomId } from "@mantine/hooks";
import ImageUpload from "../../components/ImageUpload/ImageUpload";
import {
  updateIndividualVariantSourceRate,
  uploadingMultipleImagesToS3,
  uploadImageToS3,
  getChangedPropertiesFromObject,
  intersectObjects,
} from "../../helper/helper";
import { getSpecificVariantProfileData } from "../../services/rice-price/variant-profile";

const initialFormValues: any = {
  _categoryId: "",
  variantName: "",
  HSNCode: "",
  tags: "",
  images: [],
  imagesArray: [],
  grainType: "",
  grainColour: "",
  grainLength: {
    rangeFrom: 0,
    rangeTo: 0,
    note: "",
    unit: "mm",
  },
  grainWidth: {
    rangeFrom: 0,
    rangeTo: 0,
    note: "",
    unit: "mm",
  },
  whitenessReadingAverage: {
    rangeFrom: 0,
    rangeTo: 0,
    note: "",
    unit: "mm",
  },
  moisturePercentage: {
    rangeFrom: 0,
    rangeTo: 0,
    note: "",
    unit: "mm",
  },
  chalkyPercentage: {
    rangeFrom: 0,
    rangeTo: 0,
    note: "",
    unit: "mm",
  },
  damagedAndDiscoloredPercentage: {
    rangeFrom: 0,
    rangeTo: 0,
    note: "",
    unit: "mm",
  },
  sourceRates: [
    {
      _sourceId: "",
      price: "",
    },
  ],
  updateSourceRates: false,
};

const requiredRiceProfilePayload = {
  grainType: "",
  grainColour: "",
  grainLength: {
    rangeFrom: 0,
    rangeTo: 0,
    note: "",
    unit: "mm",
  },
  grainWidth: {
    rangeFrom: 0,
    rangeTo: 0,
    note: "",
    unit: "mm",
  },
  whitenessReadingAverage: {
    rangeFrom: 0,
    rangeTo: 0,
    note: "",
    unit: "mm",
  },
  moisturePercentage: {
    rangeFrom: 0,
    rangeTo: 0,
    note: "",
    unit: "mm",
  },
  chalkyPercentage: {
    rangeFrom: 0,
    rangeTo: 0,
    note: "",
    unit: "mm",
  },
  damagedAndDiscoloredPercentage: {
    rangeFrom: 0,
    rangeTo: 0,
    note: "",
    unit: "mm",
  },
};

const requiredVariantPayload = {
  _categoryId: "",
  variantName: "",
  HSNCode: "",
  tags: "",
  images: [],
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
  const handleRiceProfilePatch = props.handleRiceProfilePatch;
  const handleRiceProfilePost = props.handleRiceProfilePost;

  const [regionOptions, setRegionOptions] = useState<any>([]);
  const [updateFormImages, setUpdateFormImages] = useState<string[]>([]);
  const [isBasmatiCategory, setIsBasmatiCategory] = useState<boolean>(false);
  const [requiredFieldsFilled, setRequiredFieldsFilled] = useState(false); // Track if required fields are filled
  const [variantObject, setVariantObject] = useState<any>([]);
  const [riceProfileObject, setRiceProfileObject] = useState<any>([]);
  const [riceProfileObjID, setRiceProfileObjID] = useState<any>(null);

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

  useEffect(() => {
    const filled = form.values.variantName && form.values._categoryId;
    setRequiredFieldsFilled(!!filled);
  }, [form.values]);

  const handleDeleteImage = (index: number) => {
    const updatedImages = [...form.values.images];
    updatedImages.splice(index, 1);
    form.setFieldValue("images", updatedImages);
    setUpdateFormImages([...updatedImages]);
  };

  const handleGetVariantProfileData = async () => {
    const response = await getSpecificVariantProfileData(
      updateFormData._variantId
    );
    if (response) {
      const matchingVariant = response.find(
        (variant: any) => variant.variantId === updateFormData._variantId
      );
      setRiceProfileObject(matchingVariant || []);
      setRiceProfileObjID(matchingVariant?._id || null);
      if (matchingVariant) {
        form.setValues({
          grainType: matchingVariant.grainType || "",
          grainColour: matchingVariant.grainColour || "",
          grainLength: matchingVariant.grainLength || {},
          grainWidth: matchingVariant.grainWidth || {},
          moisturePercentage: matchingVariant.moisturePercentage || {},
          whitenessReadingAverage:
            matchingVariant.whitenessReadingAverage || {},
          damagedAndDiscoloredPercentage:
            matchingVariant.damagedAndDiscoloredPercentage || {},
          chalkyPercentage: matchingVariant.chalkyPercentage || {},
        });
      }
    }
  };
  useEffect(() => {});

  const handlePictureInputChange = (e: any) => {
    const variant = form.values.variantName
      .replace(/[^_\w\s]/g, "")
      .replace(/\s+/g, "_");
    const categoryId = form.values._categoryId;
    const category = categoryData
      .find((cat: any) => cat._id === categoryId)
      ?.name?.replace(/\s+/g, "_");

    return handlePictureChange(e, variant, category)
      .then((result: any) => {
        form.values.imagesArray.push({
          url: result.uri,
          src: e,
          path: result.path,
        });
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const imageFileLabels = ["Image 1", "Image 2", "Image 3", "Image 4"];

  const fileInputs = imageFileLabels.map((label, index) => (
    <Grid.Col span={6} key={index}>
      <FileInput
        disabled={!requiredFieldsFilled}
        accept="image/png,image/jpeg"
        label="Upload file (png/jpg)"
        onChange={(e) => {
          handlePictureInputChange(e);
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
      setVariantObject(updateFormData);
      form.setValues(updateFormData);
      handleGetVariantProfileData();

      const images = updateFormData.images || [];
      setUpdateFormImages([...images]);
    }
  }, [updateFormData, modalType]);

  const handleGetSources: any = async () => {
    const regionResponse = await APIRequest("location/source", "GET");

    if (regionResponse) {
      const options: any = regionResponse.source
        .filter((d: any) => {
          // Filter out the selected source from the regionOptions
          return !form.values.sourceRates.some(
            (source: any) => source._sourceId === d._id
          );
        })
        .map((d: any) => ({
          label: d.region,
          value: d._id,
        }));
      setRegionOptions([...options]);
    }
  };

  const handleAddRegionCost: any = () => {
    // Filter out the selected sources from the regionOptions
    const filteredRegionOptions = regionOptions.filter(
      (option: any) =>
        !form.values.sourceRates.some(
          (source: any) => source._sourceId === option.value
        )
    );

    if (filteredRegionOptions.length > 0) {
      // Add a new source rate field
      form.insertListItem("sourceRates", initialFormValues.sourceRates[0], {
        ...initialFormValues.sourceRates[0],
      });

      setRegionOptions(filteredRegionOptions);
    } else {
      // Optionally, you can show a notification or handle the case where all sources are already selected
      showNotification({
        message: "All sources have been selected.",
        color: "blue",
      });
    }
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
    const variantFormValues = intersectObjects(
      requiredVariantPayload,
      formValues
    );
    const riceProfileFormValues = intersectObjects(
      requiredRiceProfilePayload,
      formValues
    );

    const variantPayload = getChangedPropertiesFromObject(
      variantObject,
      variantFormValues
    );

    const riceProfilePayload = getChangedPropertiesFromObject(
      riceProfileObject,
      riceProfileFormValues
    );

    if (modalType === "add") {
      if (formValues.imagesArray && formValues.imagesArray.length > 0) {
        for (const image of formValues.imagesArray) {
          const uri = image.url;
          const path = image.path;
          const file = image.src;

          try {
            // Upload image to S3
            await uploadImageToS3(uri, file);
            // After successful upload, push the image path to form.values.images
            form.values.images.push(path);
          } catch (error) {
            console.error(`Error processing image: ${error}`);
            // Handle error as needed
          }
        }
      }
      handleCloseModal(false);
      handleSaveCallback(formValues);
    }

    if (modalType === "update") {
      const payloadCommonVariantDetails = { ...form.values };
      delete payloadCommonVariantDetails.sourceRates;
      delete payloadCommonVariantDetails.imagesArray;
      if (formValues.imagesArray.length !== 0) {
        const uploadImageResponseArr = await uploadingMultipleImagesToS3(
          form.values
        );
        payloadCommonVariantDetails.images = uploadImageResponseArr;
      }

      let sourceID = formValues.sourceRates[0]._sourceId;
      let price = formValues.sourceRates[0].price;

      if (formValues.updateSource) {
        sourceID = formValues.updateSource;
      }
      if (formValues.updatePrice) {
        price = formValues.updatePrice;
      }

      if (formValues.updateSourceRates) {
        const x = await updateIndividualVariantSourceRate(
          formValues._variantId,
          formValues.sourceRates[0]._id,
          price,
          sourceID
        );
      }
      if (Object.keys(riceProfilePayload).length > 0) {
        if (riceProfileObjID) {
          const patchPayload = {
            ...riceProfilePayload,
            _id: riceProfileObjID,
          };
          handleRiceProfilePatch(patchPayload);
        } else {
          const postPayload = {
            ...riceProfilePayload,
            variantId: updateFormData._variantId,
          };
          handleRiceProfilePost(postPayload);
        }
      }
      handleCloseModal(false);
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
      <Group spacing="xl">
        <Select
          required
          label="Select Region"
          placeholder="Eg. Karnal"
          data={regionOptions}
          {...form.getInputProps(`sourceRates.${index}._sourceId`)}
          onChange={(e) => {
            form.setFieldValue("updateSourceRates", true);
            form.setFieldValue(`sourceRates.${index}._sourceId`, e);
            form.setFieldValue(`updateSource`, e);
          }}
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
      <Grid>
        <Grid.Col span={6}>
          <Select
            required
            label="Select Category"
            placeholder="Eg. Non-Basmati"
            data={categoryOptions}
            {...form.getInputProps("_categoryId")}
          />
        </Grid.Col>
        <Space h="md" />
        <Grid.Col span={6}>
          <Select
            data={tagsOptions || []}
            label="Tags"
            placeholder={isBasmatiCategory ? "Not Applicable" : "eg. steam"}
            disabled={isBasmatiCategory || !form.values._categoryId}
            {...form.getInputProps("tags")}
          />
        </Grid.Col>

        <Space h="md" />
        <Grid.Col span={12}>
          <TextInput
            required
            label="Variant Name"
            placeholder="eg. 1509 Sella"
            {...form.getInputProps("variantName")}
          />
        </Grid.Col>
        <Space h="md" />
        <Grid.Col span={12}>
          <TextInput
            label="HSN Code"
            placeholder="eg. CSQ212"
            {...form.getInputProps("HSNCode")}
          />
        </Grid.Col>
      </Grid>
      <Space h="md" />

      <div
        style={{
          backgroundColor: "#F5F5F5",
          padding: "10px",
          fontWeight: "600",
        }}
      >
        Variant Properties
        <Space h="sm" />
        <Grid>
          <Grid.Col span={6}>
            <TextInput
              label="Grain Color"
              placeholder="white"
              {...form.getInputProps("grainColour")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label="Grain Type"
              placeholder="long grain"
              {...form.getInputProps("grainType")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <NumberInput
              hideControls
              label="Grain Length (mm)"
              description="Range From"
              placeholder="8.3 mm"
              {...form.getInputProps("grainLength.rangeFrom")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <NumberInput
              label=" "
              hideControls
              description="Range To"
              placeholder="8.7 mm"
              {...form.getInputProps("grainLength.rangeTo")}
            />
          </Grid.Col>
        </Grid>
        <Grid>
          <Grid.Col span={6}>
            <NumberInput
              hideControls
              label="Grain Width (mm)"
              description="Range From"
              placeholder="1.7 mm"
              {...form.getInputProps("grainWidth.rangeFrom")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <NumberInput
              label=" "
              hideControls
              description="Range To"
              placeholder="1.8 mm"
              {...form.getInputProps("grainWidth.rangeTo")}
            />
          </Grid.Col>
        </Grid>
        <Grid>
          <Grid.Col span={6}>
            <NumberInput
              hideControls
              label="Moisture (%)"
              description="Range From"
              placeholder="0"
              {...form.getInputProps("moisturePercentage.rangeFrom")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <NumberInput
              label=" "
              hideControls
              description="Range To"
              placeholder="2%"
              {...form.getInputProps("moisturePercentage.rangeTo")}
            />
          </Grid.Col>
        </Grid>
        <Grid>
          <Grid.Col span={6}>
            <NumberInput
              hideControls
              label="Whiteness Reading (%)"
              description="Range From"
              placeholder="27%"
              {...form.getInputProps("whitenessReadingAverage.rangeFrom")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <NumberInput
              label=" "
              hideControls
              description="Range To"
              placeholder="28%"
              {...form.getInputProps("whitenessReadingAverage.rangeTo")}
            />
          </Grid.Col>
        </Grid>
        <Grid>
          <Grid.Col span={6}>
            <NumberInput
              hideControls
              label="Chalky (%)"
              description="Range From"
              placeholder="0"
              {...form.getInputProps("chalkyPercentage.rangeFrom")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <NumberInput
              label=" "
              hideControls
              description="Range To"
              placeholder="2%"
              {...form.getInputProps("chalkyPercentage.rangeTo")}
            />
          </Grid.Col>
        </Grid>
        <Grid>
          <Grid.Col span={6}>
            <NumberInput
              hideControls
              label="Damaged and Discolored (%)"
              description="Range From"
              placeholder="0"
              {...form.getInputProps(
                "damagedAndDiscoloredPercentage.rangeFrom"
              )}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <NumberInput
              label=" "
              hideControls
              description="Range To"
              placeholder="2%"
              {...form.getInputProps("damagedAndDiscoloredPercentage.rangeTo")}
            />
          </Grid.Col>
        </Grid>
      </div>

      <Space h="md" />
      <div
        style={{
          backgroundColor: "#F5F5F5",
          padding: "10px",
          fontWeight: "600",
        }}
      >
        Variant Images
        <Space h="sm" />
        <Grid>{combinedFileInputs}</Grid>
      </div>

      <Space h="md" />
      {fields}

      <Group position="right" mt="md">
        <Button type="submit">Save</Button>
      </Group>
    </form>
  );
}

export default AddOrEditProductForm;
