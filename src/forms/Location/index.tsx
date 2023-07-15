import React, { useState, useEffect } from "react";
import { Group, TextInput, Space, MultiSelect } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Select, Button } from "../../components";
import { showNotification } from "@mantine/notifications";
import { stateName } from "../../constants/state.constants";

function AddEditLocationFormContainer(props: any) {
  const handleSettingLocationData = props.handleSettingLocationData;
  const locationPayload = props.locationPayload;
  const locationData = props.locationData;
  const selectedFilterValue = props.selectedFilterValue || null;

  const [select, setSelect] = useState(false);
  const [locationType, setLocationType] = useState("");

  const handleCloseModal = props.handleCloseModal;

  const form = useForm({
    clearInputErrorOnChange: true,
    initialValues: {},

    // validate: {
    //   name: (value) =>
    //     value.length < 2 ? "Name must have at least 2 letters" : null,
    // },
  });

  useEffect(() => {
    if (selectedFilterValue) {
      setLocationType(selectedFilterValue);
    }
  }, [selectedFilterValue]);

  const handleError = (errors: typeof form.errors) => {
    if (errors.name) {
      showNotification({ message: "Please fill name field", color: "red" });
    }
  };

  const handleSubmit = (values: typeof form.values) => {
    setSelect(true);
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

    handleSettingLocationData(payload);
  };

  const originOptions = locationData?.origin?.map((d: any) => {
    return { label: d.portName, value: d._id };
  });

  return (
    <form onSubmit={form.onSubmit(handleSubmit, handleError)}>
      <Select
        required
        searchable
        label="Select location type"
        placeholder="Eg. Source"
        disabled={select}
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
          <Select
            required
            data={stateName}
            label="Enter State Name"
            placeholder="eg. Maharashtra"
            searchable
            {...form.getInputProps("state")}
          />
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
            required
            label="Enter Country Name"
            placeholder="eg. Vietnam"
            {...form.getInputProps("country")}
          />
          <Space h="md" />
          <MultiSelect
            data={originOptions || []}
            label="Select Origin Ports"
            placeholder="Eg. Vishakapatnam"
            {...form.getInputProps("linkedOrigin")}
          />
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
