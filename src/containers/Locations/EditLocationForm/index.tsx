import React, { useState, useEffect } from "react";
import {
  Group,
  Button,
  TextInput,
  NumberInput,
  Select,
  Space,
  MultiSelect,
} from "@mantine/core";
import { ArrowRightCircle, Category } from "tabler-icons-react";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { locationCat } from "../../../constants/var.constants";
// import { useNavigate } from "react-router-dom";
// import EditLocationForm from "./locForm";

function EditLocationFormContainer(props: any) {
  const handleSettingLocationData = props.handleSettingLocationData;
  const locationPayload = props.locationPayload;
  const locationData = props.locationData;

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
    return {label: d.portName, value: d._id};
  })

  return (
    <form onSubmit={form.onSubmit(handleSubmit, handleError)}>
      <Select
        required
        label="Select location type"
        placeholder="Eg. Source"
        disabled={select}
        data={[
          { value: "source", label: "Source" },
          { value: "origin", label: "Origin" },
          { value: "destination", label: "Destination" },
        ]}
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
            data={[
              { value: "Andhra Pradesh", label: "Andhra Pradesh" },
              {
                value: "Andaman & Nicobar Islands",
                label: "Andaman & Nicobar Islands",
              },
              { value: "Arunachal Pradesh", label: "Arunachal Pradesh" },
              { value: "Assam", label: "Assam" },
              { value: "Bihar", label: "Bihar" },
              { value: "Chhattisgarh", label: "Chhattisgarh" },
              { value: "Haryana", label: "Haryana" },
              { value: "Punjab", label: "Punjab" },
              { value: "Rajasthan", label: "Rajasthan " },
              { value: "Gujarat", label: "Gujarat " },
              { value: "Madhya Pradesh", label: "Madhya Pradesh" },
              { value: "Utter Pradesh", label: "Utter Pradesh" },
              { value: "Jharkhand", label: "Jharkhand" },
              { value: "West Bengal", label: "West Bengal" },
              { value: "Karnataka", label: "Karnataka" },
              { value: "Kerala", label: "Kerala " },
              { value: "Tamil Nadu", label: "Tamil Nadu" },
              { value: "Himachal Pradesh", label: "Himachal Pradesh" },
              { value: "Jammu & Kashmir", label: "Jammu & Kashmir" },
              { value: "Maharashtra", label: "Maharashtra" },
              { value: "Odisha", label: "Odisha" },
              { value: "Uttarakhand", label: "Uttarakhand" },
              { value: "Telangana", label: "Telangana" },
              { value: "Tripura", label: "Tripura" },
              { value: "Sikkim", label: "Sikkim" },
              { value: "Nagaland", label: "Nagaland" },
              { value: "Mizoram", label: "Mizoram" },
              { value: "Meghalaya", label: "Meghalaya" },
              { value: "Lakshadweep", label: "Lakshadweep" },
              { value: "Goa", label: "Goa" },
            ]}
            placeholder="eg. Haryana"
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
            data={[
              { value: "Andhra Pradesh", label: "Andhra Pradesh" },
              {
                value: "Andaman & Nicobar Islands",
                label: "Andaman & Nicobar Islands",
              },
              { value: "Arunachal Pradesh", label: "Arunachal Pradesh" },
              { value: "Assam", label: "Assam" },
              { value: "Bihar", label: "Bihar" },
              { value: "Chhattisgarh", label: "Chhattisgarh" },
              { value: "Haryana", label: "Haryana" },
              { value: "Punjab", label: "Punjab" },
              { value: "Rajasthan", label: "Rajasthan " },
              { value: "Gujarat", label: "Gujarat " },
              { value: "Madhya Pradesh", label: "Madhya Pradesh" },
              { value: "Utter Pradesh", label: "Utter Pradesh" },
              { value: "Jharkhand", label: "Jharkhand" },
              { value: "West Bengal", label: "West Bengal" },
              { value: "Karnataka", label: "Karnataka" },
              { value: "Kerala", label: "Kerala " },
              { value: "Tamil Nadu", label: "Tamil Nadu" },
              { value: "Himachal Pradesh", label: "Himachal Pradesh" },
              { value: "Jammu & Kashmir", label: "Jammu & Kashmir" },
              { value: "Maharashtra", label: "Maharashtra" },
              { value: "Odisha", label: "Odisha" },
              { value: "Uttarakhand", label: "Uttarakhand" },
              { value: "Telangana", label: "Telangana" },
              { value: "Tripura", label: "Tripura" },
              { value: "Sikkim", label: "Sikkim" },
              { value: "Nagaland", label: "Nagaland" },
              { value: "Mizoram", label: "Mizoram" },
              { value: "Meghalaya", label: "Meghalaya" },
              { value: "Lakshadweep", label: "Lakshadweep" },
              { value: "Goa", label: "Goa" },
            ]}
            label="Enter State Name"
            placeholder="eg. Maharashtra"
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
            label="Select origin ports"
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

export default EditLocationFormContainer;
