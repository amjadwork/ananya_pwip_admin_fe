import React, { useState } from "react";
import {
  Group,
  Button,
  NumberInput,
  Select,
  Space,
  Grid,
  ActionIcon,
} from "@mantine/core";
import { Plus, Minus, Check } from "tabler-icons-react";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";

const initialFormValues = {
  "_originPortId_|": "",
  "_destinationPortId_|": "",
  "chaCharge_|": "",
  "silicaGel_|": "",
  "craftPaper_|": "",
  "transportCharge_|": "",
  "loadingCharge_|": "",
  "customCharge_|": "",
  "pqc_|": "",
  "coo_|": "",
};

function EditChaForm(props: any) {
  const regionSelectOptions = props.regionSelectOptions;
  const destinationSelectOptions = props.destinationSelectOptions;
  const handleCloseModal = props.handleCloseModal;
  const handleUpdateChaUIData = props.handleUpdateChaUIData;

  const [chaDestinationItemList, setChaDestinationItemList] = useState([]);
  const [chaPayload, setChaPayload] = useState(null);
  const [chaFormValues, setChaFormValues] = useState({ ...initialFormValues });

  const form: any = useForm({
    clearInputErrorOnChange: true,
    initialValues: chaFormValues,
  });

  const handleAddItem: any = () => {
    let arr: any = [];

    arr.push("");
    let destinationObject: any = {};
    const object: any = { ...form.values };
    let destinationsArr: any = [...chaDestinationItemList];

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

    setChaPayload(payloadObject);
    setChaDestinationItemList(destinationsArr);

    // reset inital form value
    let formResetValues: any = {};
    Object.keys({ ...destinationObject }).map((key) => {
      formResetValues[`${key}_|`] = "";
    });
    setChaFormValues(formResetValues);
    // reset inital form value ends
  };

  const handleDeleteItem = (index: number) => {
    let destinationsArr: any = [...chaDestinationItemList];

    // logic to delete an item starts
    if (index > -1) {
      destinationsArr.splice(index, 1);
    }

    // logic to delete an item end

    setChaDestinationItemList(destinationsArr);
  };

  const handleError = (errors: typeof form.errors) => {
    if (errors.name) {
      showNotification({ message: "Please fill name field", color: "red" });
    }
  };
  // const handleUpdate = (index: number) => {
  //   const arr: any = [...chaDestinationItemList];
  //   arr[index] = catUpdateValue;

  //   setChaDestinationItemList(arr);

  //   console.log(arr);
  // };

  const handleFormSubmit = (formValues: typeof form.values) => {
    // update UI table
    handleUpdateChaUIData(chaPayload);

    handleCloseModal(false);
  };

  return (
    <form onSubmit={form.onSubmit(handleFormSubmit, handleError)}>
      {/* <TextInput
        required
        label="Enter Origin Port"
        placeholder="Eg. chennai"
        {...form.getInputProps("originPort")}
      /> */}
      <Select
        required
        label="Select Origin Port"
        placeholder="Eg. chennai"
        data={regionSelectOptions}
        {...form.getInputProps("_originPortId")}
        sx={() => ({
          marginBottom: 18,
        })}
      />

      <Space h="md" />
      {chaDestinationItemList.map((item, i) => {
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
                <Grid.Col span={10}>
                  <Select
                    defaultValue={item["_destinationPortId"]}
                    required
                    label="Select Destination Port"
                    placeholder="Eg. singapore"
                    data={destinationSelectOptions}
                    {...form.getInputProps("_destinationPortId_|" + i)}
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

                <Grid.Col span={2}>
                  <NumberInput
                    required
                    label="Enter CHA Charges"
                    placeholder="Eg. 26500"
                    defaultValue={item["chaCharge"]}
                    {...form.getInputProps("chaCharge_|" + i)}
                  />
                </Grid.Col>

                <Grid.Col span={2}>
                  <NumberInput
                    required
                    label="Silica Gel"
                    placeholder="Eg. 26500"
                    defaultValue={item["silicaGel"]}
                    {...form.getInputProps("silicaGel_|" + i)}
                  />
                </Grid.Col>

                <Grid.Col span={2}>
                  <NumberInput
                    required
                    label="Craft Paper"
                    placeholder="Eg. 26500"
                    defaultValue={item["craftPaper"]}
                    {...form.getInputProps("craftPaper_|" + i)}
                  />
                </Grid.Col>

                <Grid.Col span={2}>
                  <NumberInput
                    required
                    label="Transport Charge"
                    placeholder="Eg. 26500"
                    defaultValue={item["transportCharge"]}
                    {...form.getInputProps("transportCharge_|" + i)}
                  />
                </Grid.Col>
                <Grid.Col span={2}>
                  <NumberInput
                    required
                    label="Loading Charge"
                    placeholder="Eg. 26500"
                    defaultValue={item["loadingCharge"]}
                    {...form.getInputProps("loadingCharge_|" + i)}
                  />
                </Grid.Col>
                <Grid.Col span={2}>
                  <NumberInput
                    required
                    label="Custom Charge"
                    placeholder="Eg. 26500"
                    defaultValue={item["customCharge"]}
                    {...form.getInputProps("customCharge_|" + i)}
                  />
                </Grid.Col>
                <Grid.Col span={2}>
                  <NumberInput
                    required
                    label="PQC"
                    placeholder="Eg. 26500"
                    defaultValue={item["pqc"]}
                    {...form.getInputProps("pqc_|" + i)}
                  />
                </Grid.Col>
                <Grid.Col span={2}>
                  <NumberInput
                    required
                    label="COO"
                    placeholder="Eg. 26500"
                    defaultValue={item["coo"]}
                    {...form.getInputProps("coo_|" + i)}
                  />
                </Grid.Col>
              </Grid>
            </Group>
            <Space h="md" />
          </React.Fragment>
        );
      })}

      <Group
        sx={(theme) => ({
          border: `1px solid ${theme.colors.gray[2]}`,
          borderRadius: 12,
          padding: 12,
        })}
      >
        <Grid>
          <Grid.Col span={11}>
            <Select
              required
              label="Select Destination Port"
              placeholder="Eg. singapore"
              data={destinationSelectOptions}
              {...form.getInputProps("_destinationPortId_|")}
            />
          </Grid.Col>

          <Grid.Col span={1}>
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

          <Grid.Col span={2}>
            <NumberInput
              required
              label="Enter CHA Charges"
              placeholder="Eg. 26500"
              {...form.getInputProps("chaCharge_|")}
            />
          </Grid.Col>

          <Grid.Col span={2}>
            <NumberInput
              required
              label="Silica Gel"
              placeholder="Eg. 26500"
              {...form.getInputProps("silicaGel_|")}
            />
          </Grid.Col>

          <Grid.Col span={2}>
            <NumberInput
              required
              label="Craft Paper"
              placeholder="Eg. 26500"
              {...form.getInputProps("craftPaper_|")}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <NumberInput
              required
              label="Transport Charges"
              placeholder="Eg. 26500"
              {...form.getInputProps("transportCharge_|")}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <NumberInput
              required
              label="Loading Charges"
              placeholder="Eg. 26500"
              {...form.getInputProps("loadingCharge_|")}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <NumberInput
              required
              label="Custom Charges"
              placeholder="Eg. 26500"
              {...form.getInputProps("customCharge_|")}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <NumberInput
              required
              label="PQC"
              placeholder="Eg. 26500"
              {...form.getInputProps("pqc_|")}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <NumberInput
              required
              label="COO"
              placeholder="Eg. 26500"
              {...form.getInputProps("coo_|")}
            />
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

export default EditChaForm;
