import React, { useState } from "react";
import {
  Group,
  Button,
  TextInput,
  NumberInput,
  Select,
  Space,
  ActionIcon,
  Grid,
} from "@mantine/core";
import { Plus, Minus, Check } from "tabler-icons-react";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";

const initialFormValues = {
  "_originPortId_|": "",
  "_destinationPortId_|": "",
  "ofcCharge_|": "",
};

function EditOfcForm(props: any) {
  const regionSelectOptions = props.regionSelectOptions;
  const destinationSelectOptions = props.destinationSelectOptions;
  const handleCloseModal = props.handleCloseModal;
  const handleUpdateOfcUIData = props.handleUpdateOfcUIData;

  const [ofcDestinationItemList, setOfcDestinationItemList] = useState([]);
  const [ofcPayload, setOfcPayload] = useState(null);
  const [ofcFormValues, setOfcFormValues] = useState({ ...initialFormValues });

  const form = useForm({
    clearInputErrorOnChange: true,
    initialValues: ofcFormValues,
    // validate: {
    //   name: (value) =>
    //     value.length < 2 ? "Name must have at least 2 letters" : null,
    // },
  });

  const handleAddItem: any = () => {
    let arr: any = [];

    arr.push("");
    let destinationObject: any = {};
    const object: any = { ...form.values };
    let destinationsArr: any = [...ofcDestinationItemList];

    Object.keys(object)
      .filter((key) => {
        const _key = key.split("_|")[0];
        if (_key !== "_originPortId") {
          return key;
        }
      })
      .map((key) => {
        const _key = key.split("_|")[0];
        destinationObject[_key] = object[key];
        return {
          [_key]: object[key],
        };
      });

    destinationsArr.push(destinationObject);

    const payloadObject: any = {
      _originPortId: object._originPortId,
      destinations: [...destinationsArr],
    };

    setOfcPayload(payloadObject);
    setOfcDestinationItemList(destinationsArr);

    // reset inital form value
    let formResetValues: any = {};
    Object.keys({ ...destinationObject }).map((key) => {
      formResetValues[`${key}_|`] = "";
    });
    setOfcFormValues(formResetValues);
    // reset inital form value ends
  };

  const handleDeleteItem = (index: number) => {
    let destinationsArr: any = [...ofcDestinationItemList];

    // logic to delete an item starts
    if (index > -1) {
      destinationsArr.splice(index, 1);
    }

    // logic to delete an item end

    setOfcDestinationItemList(destinationsArr);
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
    handleUpdateOfcUIData(ofcPayload);

    handleCloseModal(false);
  };

  return (
    <form onSubmit={form.onSubmit(handleFormSubmit, handleError)}>
      <Select
        required
        searchable
        label="Select Origin Port"
        placeholder="Eg. chennai"
        data={regionSelectOptions}
        {...form.getInputProps("_originPortId")}
        sx={() => ({
          marginBottom: 18,
        })}
      />

      <Space h="md" />

      <Space h="md" />
      {ofcDestinationItemList.map((item, i) => {
        return (
          <React.Fragment key={i}>
            <Group
              spacing="md"
              sx={(theme) => ({
                border: `1px solid ${theme.colors.gray[2]}`,
                borderRadius: 12,
                padding: 12,
                backgroundColor: theme.colors.gray[0],
              })}
            >
              <Grid>
                <Grid.Col span={6}>
                  <Select
                    defaultValue={item["_destinationPortId"]}
                    required
                    searchable
                    label="Select Destination Port"
                    placeholder="Eg. singapore"
                    data={destinationSelectOptions}
                    {...form.getInputProps("_destinationPortId_|" + i)}
                  />
                </Grid.Col>

                <Grid.Col span={4}>
                  <NumberInput
                    required
                    type="number"
                    label="Enter OFC Charges"
                    placeholder="Eg. 26500"
                    precision={2}
                    hideControls
                    defaultValue={item["ofcCharge"]}
                    {...form.getInputProps("ofcCharge_|" + i)}
                  />
                </Grid.Col>

                <Grid.Col span={2}>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "flex-end",
                      justifyContent: "flex-end",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <Group spacing="md" position="right" margin-bottom="5px">
                      <ActionIcon
                        variant="filled"
                        onClick={() => handleDeleteItem(i)}
                      >
                        <Minus size={20} />
                      </ActionIcon>
                    </Group>
                  </div>
                </Grid.Col>
              </Grid>
            </Group>
          </React.Fragment>
        );
      })}

      <Space h="md" />

      <Group
        spacing="md"
        sx={(theme) => ({
          border: `1px solid ${theme.colors.gray[2]}`,
          borderRadius: 12,
          padding: 12,
        })}
      >
        <Grid>
          <Grid.Col span={6}>
            <Select
              required
              searchable
              label="Select Destination Port"
              placeholder="Eg. singapore"
              data={destinationSelectOptions}
              {...form.getInputProps("_destinationPortId_|")}
            />
          </Grid.Col>

          <Grid.Col span={4}>
            <NumberInput
              required
              label="Enter OFC Charges"
              placeholder="Eg. 26500"
              precision={2}
              hideControls
              type="number"
              {...form.getInputProps("ofcCharge_|")}
            />
          </Grid.Col>

          <Grid.Col span={2}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "flex-end",
                height: "100%",
                width: "100%",
                justifyContent: "flex-end",
              }}
            >
              <Button onClick={handleAddItem}>+</Button>
            </div>
          </Grid.Col>
        </Grid>
      </Group>

      <Space h="lg" />

      <Group position="right" mt="md">
        <Button type="submit">Save</Button>
      </Group>
    </form>
  );
}

export default EditOfcForm;
