import React, { useState, useEffect } from "react";
import {
  Group,
  TextInput,
  Space,
  MultiSelect,
  Grid,
  FileInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Select, Button } from "../../components";
import { stateName } from "../../constants/state.constants";
import axios from "axios";


interface ImageResult {
  uri: string;
  publicUri: string;
  fileSrc: string;
  // Add other properties if needed
}

function AddEditLocationFormContainer(props: any) {
  const handleSetLocationPayload = props.handleSetLocationPayload;
  const locationPayload = props.locationPayload;
  const locationData = props.locationData;
  const selectedFilterValue = props.selectedFilterValue || null;
  const updateFormData = props.updateFormData;
  const handlePictureChange = props.handlePictureChange;
  const modalType = props.modalType || "add";
  const [locationType, setLocationType] = useState("");
  const [defaultOriginValues, setDefaultOriginValues] = useState<string[]>([]);
  const [imageResult, setImageResult] = useState<ImageResult | null>(null);
  const handleCloseModal = props.handleCloseModal;

  const form = useForm({
    clearInputErrorOnChange: true,
    initialValues: {},
  });
  const originOptions = locationData?.origin?.map((d: any) => {
    return { label: d.portName, value: d._id };
  });

  //to show previous values while editing the row
  useEffect(() => {
    if (updateFormData && modalType === "update") {
      if (selectedFilterValue === "destination") {
        const originAsStringArray = updateFormData.linkedOrigin.map(
          (arr: any) => arr._originId
        );
        setDefaultOriginValues(originAsStringArray);
        form.setValues({
          ...updateFormData,
          linkedOrigin: [...originAsStringArray],
        });
      } else {
        form.setValues({
          ...updateFormData,
        });
      }
    }
  }, [updateFormData, modalType]);

  const imageFileLabels = ["Image 1"];

  const fileInputs = imageFileLabels.map((label, index) => (
    <Grid.Col key={index}>
      <FileInput
        accept="image/png,image/jpeg"
        placeholder="Upload Image"
        onChange={(e) => {
          handlePictureChange(e)
            .then((result: any) => {
              setImageResult(result);
            })
            .catch((err: any) => {
              console.log(err);
            });
            form.getInputProps("image").onChange(e);
        }}
      />
    </Grid.Col>
  ));


  const handleLinkedOriginChange = (newOriginValues: string[]) => {
    setDefaultOriginValues(newOriginValues);
    form.setValues((prevValues: any) => ({
      ...prevValues,
      linkedOrigin: newOriginValues,
    }));
  };

  useEffect(() => {
    if (selectedFilterValue) {
      setLocationType(selectedFilterValue);
    }
  }, [selectedFilterValue]);

  const handleSubmit =  async (values: typeof form.values) => {
    handleCloseModal(false);

    let sourceArr: any = [...locationPayload.source];
    let originArr: any = [...locationPayload.origin];
    let destinationArr: any = [...locationPayload.destination];

    if (locationType === "source") {
      sourceArr.push(values);
    }
    if (locationType === "origin") {
      originArr.push(values);
    }
    if (locationType === "destination") {
      destinationArr.push(values);
    }

    console.log("values", values)
    console.log("imageResult", imageResult)

    if (locationType==="destination" || locationType==="origin"){
 if(imageResult)
     {
      console.log("hello hello", imageResult)
        const uri = imageResult.uri;
        const publicURI = imageResult.publicUri;
        const file = imageResult.fileSrc;
        try {
          const response =  await axios.put(`${uri}`, file).then(() => {
            console.log("response",imageResult)
            form.setValues((prevValues: any) => ({
              ...prevValues,
              image: publicURI,
            }));
            // form.setFieldValue = publicURI;
          });
        } catch (error) {
          console.error(`Error processing image: ${error}`);
          // Handle error as needed
        }
      }}
    

    let payload: any = {
      source: [],
      origin: [],
      destination: [],
    };

    if (sourceArr.length) {
      payload.source = [...sourceArr];
    }

    if (originArr.length) {
      payload.origin = [...originArr];
    }

    if (destinationArr.length) {
      payload.destination = [...destinationArr];
    }

    handleSetLocationPayload(payload);
  };

  
  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Select
        required
        searchable
        label="Select location type"
        placeholder="Eg. Source"
        disabled={modalType === "update" ? true : false}
        data={[
          { value: "source", label: "Source" },
          { value: "origin", label: "Origin" },
          { value: "destination", label: "Destination" },
        ]}
        value={locationType}
        onChange={(value: any) => {
          setLocationType(value);
        }}
      />

      <Space h="md" />

      {locationType === "source" ? (
        <>
          <TextInput
            required
            label="Region Name"
            placeholder="eg. Kolkata"
            {...form.getInputProps("region")}
          />
          <Space h="md" />
          <Select
            required
            label="State Name"
            data={stateName}
            placeholder="eg. Haryana"
            searchable
            {...form.getInputProps("state")}
          />
          <Space h="md" />
          <Group position="right" mt="md" spacing="md">
            <Button type="submit">Submit</Button>
          </Group>
        </>
      ) : null}

      {locationType === "origin" ? (
        <>
          <TextInput
            required
            label="Enter Port Name"
            placeholder="eg. JNPT"
            {...form.getInputProps("portName")}
          />
          <Space h="md" />
          <TextInput
            label="Origin Port Code"
            placeholder="eg. QWS23"
            {...form.getInputProps("portCode")}
          />
          <Space h="md" />
          <TextInput
            required
            label="Enter CFS Station"
            placeholder="eg. Chennai cfs"
            {...form.getInputProps("cfsStation")}
          />
          <Space h="md" />
          <TextInput
            required
            label="Enter City Name"
            placeholder="eg. Kolkata"
            {...form.getInputProps("city")}
          />
          <Space h="md" />

          <label htmlFor="imageUpload">Image Upload</label>
          <Grid>{fileInputs}</Grid>

          <Space h="md" />
          <Select
            required
            data={stateName}
            label="Enter State Name"
            placeholder="eg. Maharashtra"
            searchable
            {...form.getInputProps("state")}
          />
          <Space h="md" />

          <Space h="md" />
          <Group position="right" mt="md" spacing="md">
            <Button type="submit">Submit</Button>
          </Group>
        </>
      ) : null}

      <Space h="md" />

      {locationType === "destination" ? (
        <>
          <TextInput
            required
            label="Enter Port Name"
            placeholder="eg. JNPT"
            {...form.getInputProps("portName")}
          />
          <Space h="md" />
          <TextInput
            label="Destination Port Code"
            placeholder="eg. QWS23"
            {...form.getInputProps("portCode")}
          />
          <Space h="md" />
          <TextInput
            required
            label="Enter Country Name"
            placeholder="eg. Vietnam"
            {...form.getInputProps("country")}
          />
          <Space h="md" />
          <MultiSelect
            data={originOptions}
            label="Linked Origins"
            placeholder="Select Linked Origins"
            value={defaultOriginValues}
            onChange={handleLinkedOriginChange}
            clearButtonLabel="Clear selection"
            clearable
          />
          <Space h="md" />

          <label htmlFor="imageUpload">Image Upload</label>
          <Grid>{fileInputs}</Grid>

          <Space h="md" />
          <Group position="right" mt="md" spacing="md">
            <Button type="submit">Submit</Button>
          </Group>
        </>
      ) : null}
    </form>
  );
}

export default AddEditLocationFormContainer;
