import React, { useState } from "react";
import {
  Group,
  Button,
  TextInput,
  NumberInput,
  Select,
  Space,
  ActionIcon,
} from "@mantine/core";
import { Plus, Minus, Check } from "tabler-icons-react";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";

const initialFormValues = {
  cfsStation: "",
  "_sourcePortId_|": "",
  "transportationCharge_|": "",
};

function EditTransportForm(props: any) {
  const sourceSelectOptions = props.sourceSelectOptions;
  const handleUpdateTransportUIData = props.handleUpdateTransportUIData;
  const handleCloseModal = props.handleCloseModal;

  const [transportItemList, setTransportItemList] = useState([]);
  const [transportPayload, setTransportPayload] = useState(null);
  const [transportFormValues, setTransportFormValues] = useState({
    ...initialFormValues,
  });

  const form = useForm({
    clearInputErrorOnChange: true,
    initialValues: transportFormValues,
    // validate: {
    //   name: (value) =>
    //     value.length < 2 ? "Name must have at least 2 letters" : null,
    // },
  });

  const handleAddItem: any = () => {
    let arr: any = [];

    arr.push("");
    let transportObject: any = {};
    const object: any = { ...form.values };

    let transportArr: any = [...transportItemList];

    Object.keys(object)
      .filter((key) => {
        const _key = key.split("_|")[0];
        if (_key !== "cfsStation") {
          return key;
        }
      })
      .map((key) => {
        const _key = key.split("_|")[0];
        transportObject[_key] = object[key];
        return {
          [_key]: object[key],
        };
      });

    transportArr.push(transportObject);

    const payloadObject: any = {
      cfsStation: object.cfsStation,
      sourceLocations: [...transportArr],
    };

    setTransportPayload(payloadObject);
    setTransportItemList(transportArr);

    // reset inital form value
    let formResetValues: any = {};
    Object.keys({ ...transportObject }).map((key) => {
      formResetValues[`${key}_|`] = "";
    });
    setTransportFormValues(formResetValues);
    // reset inital form value ends
  };

  const handleDeleteItem = (index: number) => {
    let transportArr: any = [...transportItemList];

    // logic to delete an item starts
    if (index > -1) {
      transportArr.splice(index, 1);
    }

    // logic to delete an item end

    setTransportItemList(transportArr);
  };

  const handleError = (errors: typeof form.errors) => {
    if (errors.name) {
      showNotification({ message: "Please fill name field", color: "red" });
    }
  };
  // const handleUpdate = (index: number) => {
  //   const arr: any = [...categoriesList];
  //   arr[index] = catUpdateValue;

  //   setCategoriesList(arr);

  //   console.log(arr);
  // };

  const handleFormSubmit = (formValues: typeof form.values) => {
    handleUpdateTransportUIData(transportPayload);
    handleCloseModal(false);
  };

  return (
    <form onSubmit={form.onSubmit(handleFormSubmit, handleError)}>
      <TextInput
        required
        label="Enter CFS Station "
        placeholder="Eg. chennai cfs"
        {...form.getInputProps("cfsStation")}
      />

      <Space h="md" />
      {transportItemList.map((item, i) => {
        return (
          <Group spacing="md" key={i}>
            <Select
              required
              label="Enter Source Location"
              placeholder="Eg. karnal "
              data={sourceSelectOptions}
              defaultValue={item["_sourcePortId"]}
              {...form.getInputProps("_sourcePortId_|" + i)}
            />

            <NumberInput
              required
              label="Enter Transport Charges"
              placeholder="Eg. 26500"
              defaultValue={item["transportationCharge"]}
              {...form.getInputProps("transportationCharge_|" + i)}
            />

            <div
              style={{
                display: "inline-flex",
                alignItems: "bottom",
                // width: "100%",
                marginTop: `3%`,
              }}
            >
              <Group spacing="md" position="right" margin-bottom="10px">
                <ActionIcon
                  variant="filled"
                  onClick={() => handleDeleteItem(i)}
                >
                  <Minus size={20} />
                </ActionIcon>
              </Group>
            </div>
          </Group>
        );
      })}

      <Space h="md" />

      <Group spacing="md" grow>
        <Select
          required
          label="Enter Source Location"
          placeholder="Eg. Karnal"
          data={sourceSelectOptions}
          {...form.getInputProps("_sourcePortId_|")}
        />

        <NumberInput
          required
          label="Enter Transport charges"
          placeholder="Eg. 26500"
          {...form.getInputProps("transportationCharge_|")}
        />

        <div
          style={{
            display: "inline-flex",
            alignItems: "bottom",
            width: "100%",
            marginTop: `3%`,
          }}
        >
          <Button onClick={handleAddItem}>+</Button>
        </div>
      </Group>

      <Space h="lg" />

      <Group position="right" mt="md">
        <Button type="submit">Save</Button>
      </Group>
    </form>
  );
}

export default EditTransportForm;
