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
  Textarea,
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
  hasOnlyPriceUpdatePermission,
} from "../../helper/helper";
import { getSpecificVariantProfileData } from "../../services/rice-price/variant-profile";
import {
  hasEditPermission,
} from "../../helper/helper";

const initialFormValues: any = {
  _categoryId: "",
  variantName: "",
  HSNCode: "",
  tags: "",
  images: [],
  imagesArray: [],
  brokenPercentage: "",
  grainType: "",
  grainColour: "",
  grainLength: {
    rangeFrom: null,
    rangeTo: null,
    notes: "",
    unit: "mm",
  },
  grainWidth: {
    rangeFrom: null,
    rangeTo: null,
    notes: "",
    unit: "mm",
  },
  whitenessReadingAverage: {
    rangeFrom: null,
    rangeTo: null,
    notes: "",
    unit: "%",
  },
  moisturePercentage: {
    rangeFrom: null,
    rangeTo: null,
    notes: "",
    unit: "%",
  },
  chalkyPercentage: {
    rangeFrom: null,
    rangeTo: null,
    notes: "",
    unit: "%",
  },
  damagedAndDiscoloredPercentage: {
    rangeFrom: null,
    rangeTo: null,
    notes: "",
    unit: "%",
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
    rangeFrom: null,
    rangeTo: null,
    notes: "",
    unit: "mm",
  },
  grainWidth: {
    rangeFrom: null,
    rangeTo: null,
    notes: "",
    unit: "mm",
  },
  whitenessReadingAverage: {
    rangeFrom: null,
    rangeTo: null,
    notes: "",
    unit: "%",
  },
  moisturePercentage: {
    rangeFrom: null,
    rangeTo: null,
    notes: "",
    unit: "%",
  },
  chalkyPercentage: {
    rangeFrom: null,
    rangeTo: null,
    notes: "",
    unit: "%",
  },
  damagedAndDiscoloredPercentage: {
    rangeFrom: null,
    rangeTo: null,
    notes: "",
    unit: "%",
  },
};

const requiredVariantPayload = {
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

  const roleString = sessionStorage.getItem("role");
  const role = roleString ? Number(roleString) : 0;
  
  const tagsOptions = [
    { value: "raw", label: "Raw" },
    { value: "steam", label: "Steam" },
    { value: "paraboiled", label: "Paraboiled" },
  ];

  const categoryOptions = categoryData.map((cat: any) => ({
    value: cat._id,
    label: cat.name,
  }));

  const form = useForm({
    clearInputErrorOnChange: true,
    initialValues: { ...initialFormValues },

    validate: {
      variantName: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
    },
  });

  useEffect(() => {
    const filled = form.values.variantName && form.values._categoryId;
    setRequiredFieldsFilled(!!filled);
  }, [form.values]);

  useEffect(() => {
    if (updateFormData && modalType === "update") {
      setVariantObject(updateFormData);
      form.setValues(updateFormData);
      handleGetVariantProfileData();

      const images = updateFormData.images || [];
      setUpdateFormImages([...images]);
    }
  }, [updateFormData, modalType]);

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
        let latestImages = [];
        // Update the images array with the latest four images
        if (modalType === "add") {
          latestImages = [
            ...form.values.imagesArray,
            {
              url: result.uri,
              src: e,
              path: result.path,
            },
          ].slice(-4);
        } else {
          // only n uploads will be considered, n=4-existingImages
          const remainingImages = 4 - updateFormImages.length;
          latestImages = [
            ...form.values.imagesArray,
            {
              url: result.uri,
              src: e,
              path: result.path,
            },
          ].slice(-remainingImages);
        }
        form.setFieldValue("imagesArray", latestImages);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  //deleting the images from the array and setting state
  const handleDeleteImage = (index: number) => {
    const updatedImages = [...form.values.images];
    updatedImages.splice(index, 1); // Remove the image at the specified index
    form.setFieldValue("images", updatedImages);
    setUpdateFormImages([...updatedImages]); // Update state if necessary
  };

  //the existing image preview
  const existingImages = updateFormImages.map((imageUrl: any, index: any) => (
    <ImageUpload
      key={index}
      imageUrl={imageUrl}
      onDelete={() =>
        hasOnlyPriceUpdatePermission()
          ? null
          : handleDeleteImage(index)
      }
    />
  ));

  //getting source to display in the dropdown select menu
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
    // const variantFormValues = intersectObjects(
    //   requiredVariantPayload,
    //   formValues
    // );
    const riceProfileFormValues = intersectObjects(
      requiredRiceProfilePayload,
      formValues
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

  const fields = form.values.sourceRates.map((item: any, index: number) => (
    <React.Fragment key={item?.key + index * 12}>
      <Group>
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
          style={{ width: modalType === "update" ? "48%" : "43%" }}
          disabled={hasOnlyPriceUpdatePermission()}
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
          style={{ width: modalType === "update" ? "48%" : "43%" }}
        />

        <Flex
          justify="space-between"
          align="flex-end"
          direction="row"
          sx={() => ({
            marginTop: `3%`,
          })}
        >
          <Group spacing="sm" position="right" margin-bottom="5px">
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
      <Space h="sm" />
    </React.Fragment>
  ));

  return (
    <form onSubmit={form.onSubmit(handleSubmit, handleError)}>
      <div
        style={{
          border: "1px solid #9B9F9E",
          padding: "15px",
          fontWeight: "600",
        }}
      >
        <Grid>
          <Grid.Col span={6}>
            <Select
              required
              label="Select Category"
              placeholder="Eg. Non-Basmati"
              disabled={hasOnlyPriceUpdatePermission()}
              data={categoryOptions}
              {...form.getInputProps("_categoryId")}
            />
          </Grid.Col>
          <Space h="sm" />
          <Grid.Col span={6}>
            <Select
              data={tagsOptions || []}
              label="Tags"
              placeholder={isBasmatiCategory ? "Not Applicable" : "eg. steam"}
              disabled={
                isBasmatiCategory ||
                !form.values._categoryId ||
                hasOnlyPriceUpdatePermission()
              }
              {...form.getInputProps("tags")}
            />
          </Grid.Col>

          <Space h="sm" />
          <Grid.Col span={12}>
            <TextInput
              required
              label="Variant Name"
              placeholder="eg. 1509 Sella"
              disabled={hasOnlyPriceUpdatePermission()}
              {...form.getInputProps("variantName")}
            />
          </Grid.Col>
          <Space h="sm" />
          <Grid.Col span={6}>
            <TextInput
              label="HSN Code"
              placeholder="eg. CSQ212"
              disabled={hasOnlyPriceUpdatePermission()}
              {...form.getInputProps("HSNCode")}
            />
          </Grid.Col>
          <Space h="sm" />
          <Grid.Col span={6}>
            <NumberInput
              label="Broken Percentage (%)"
              hideControls
              precision={2}
              min={0}
              max={100}
              placeholder="5%"
              disabled={hasOnlyPriceUpdatePermission()}
              {...form.getInputProps("brokenPercentage")}
            />
          </Grid.Col>
        </Grid>
        <Space h="sm" />

        <div
          style={{
            backgroundColor: "#FBFCFF",
            border: "1px solid #9B9F9E",
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
                disabled={hasOnlyPriceUpdatePermission()}
                {...form.getInputProps("grainColour")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Grain Type"
                placeholder="long grain"
                disabled={hasOnlyPriceUpdatePermission()}
                {...form.getInputProps("grainType")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                hideControls
                precision={2}
                min={0}
                max={100}
                label="Grain Length (mm)"
                description="Range From"
                placeholder="8.3 mm"
                disabled={hasOnlyPriceUpdatePermission()}
                {...form.getInputProps("grainLength.rangeFrom")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                label=" "
                hideControls
                precision={2}
                min={0}
                max={100}
                description="Range To"
                placeholder="8.7 mm"
                disabled={hasOnlyPriceUpdatePermission()}
                {...form.getInputProps("grainLength.rangeTo")}
              />
            </Grid.Col>
            <Space h="sm" />
            <Grid.Col span={6}>
              <NumberInput
                hideControls
                precision={2}
                min={0}
                max={100}
                label="Grain Width (mm)"
                description="Range From"
                placeholder="1.7 mm"
                disabled={hasOnlyPriceUpdatePermission()}
                {...form.getInputProps("grainWidth.rangeFrom")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                label=" "
                hideControls
                precision={2}
                min={0}
                max={100}
                description="Range To"
                placeholder="1.8 mm"
                disabled={hasOnlyPriceUpdatePermission()}
                {...form.getInputProps("grainWidth.rangeTo")}
              />
            </Grid.Col>
            <Space h="sm" />
            <Grid.Col span={6}>
              <NumberInput
                hideControls
                precision={2}
                min={0}
                max={100}
                label="Moisture (%)"
                description="Range From"
                placeholder="0"
                disabled={hasOnlyPriceUpdatePermission()}
                {...form.getInputProps("moisturePercentage.rangeFrom")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                label=" "
                hideControls
                precision={2}
                min={0}
                max={100}
                description="Range To"
                placeholder="2%"
                disabled={hasOnlyPriceUpdatePermission()}
                {...form.getInputProps("moisturePercentage.rangeTo")}
              />
            </Grid.Col>
            <Space h="sm" />
            <Grid.Col span={6}>
              <NumberInput
                hideControls
                precision={2}
                min={0}
                max={100}
                label="Whiteness Reading (%)"
                description="Range From"
                placeholder="27%"
                disabled={hasOnlyPriceUpdatePermission()}
                {...form.getInputProps("whitenessReadingAverage.rangeFrom")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                label=" "
                hideControls
                precision={2}
                min={0}
                max={100}
                description="Range To"
                placeholder="28%"
                disabled={hasOnlyPriceUpdatePermission()}
                {...form.getInputProps("whitenessReadingAverage.rangeTo")}
              />
            </Grid.Col>
            <Space h="sm" />
            <Grid.Col span={12}>
              <Textarea
                label="Chalky (%)"
                autosize
                description="Notes"
                disabled={hasOnlyPriceUpdatePermission()}
                {...form.getInputProps("chalkyPercentage.notes")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                hideControls
                precision={2}
                min={0}
                max={100}
                description="Range From"
                placeholder="0"
                disabled={hasOnlyPriceUpdatePermission()}
                {...form.getInputProps("chalkyPercentage.rangeFrom")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                hideControls
                precision={2}
                min={0}
                max={100}
                description="Range To"
                placeholder="2%"
                disabled={hasOnlyPriceUpdatePermission()}
                {...form.getInputProps("chalkyPercentage.rangeTo")}
              />
            </Grid.Col>
            <Space h="sm" />
            <Grid.Col span={6}>
              <NumberInput
                hideControls
                precision={2}
                min={0}
                max={100}
                label="Damaged and Discolored (%)"
                description="Range From"
                placeholder="0"
                disabled={hasOnlyPriceUpdatePermission()}
                {...form.getInputProps(
                  "damagedAndDiscoloredPercentage.rangeFrom"
                )}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                label=" "
                hideControls
                precision={2}
                min={0}
                max={100}
                description="Range To"
                placeholder="2%"
                disabled={hasOnlyPriceUpdatePermission()}
                {...form.getInputProps(
                  "damagedAndDiscoloredPercentage.rangeTo"
                )}
              />
            </Grid.Col>
          </Grid>
        </div>

        <Space h="sm" />
        <div
          style={{
            backgroundColor: "#FBFCFF",
            border: "1px solid #9B9F9E",
            padding: "15px",
            fontWeight: "600",
          }}
        >
          Variant Images
          <div
            style={{
              fontWeight: "200",
              fontSize: "11px",
              marginBottom: "0px",
            }}
          >
            * Important: only the lastest 4 files will be considered
          </div>
          <Space h="xs" />
          <Grid>
            {existingImages}
            {updateFormImages.length < 4 && (
              <Grid.Col span={12}>
                {hasOnlyPriceUpdatePermission() ? null : (
                  <FileInput
                    disabled={!requiredFieldsFilled}
                    accept="image/png,image/jpeg"
                    label="Upload files (png/jpg)*"
                    onChange={(e) => {
                      handlePictureInputChange(e);
                    }}
                  />
                )}
              </Grid.Col>
            )}
          </Grid>
        </div>

        <Space h="sm" />

        <div
          style={{
            backgroundColor: "#FBFCFF",
            border: "1px solid #9B9F9E",
            padding: "15px",
            fontWeight: "600",
          }}
        >
          Sourcing Region and Ex-mill
          <Space h="sm" />
          {fields}
        </div>
      </div>

      <Group mt="md">
        <Button fullWidth size="md" type="submit">
          Click to Submit{" "}
        </Button>
      </Group>
    </form>
  );
}

export default AddOrEditProductForm;
