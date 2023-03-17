import React, { useState } from "react";
import {
  Group,
  Button,
  TextInput,
  NumberInput,
  Select,
  Space,
  Grid,
  ActionIcon,
} from "@mantine/core";
import { Plus, Minus, Check } from "tabler-icons-react";
import { ArrowRightCircle } from "tabler-icons-react";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { manageCha } from "../../../constants/var.constants";

const initialFormValues = {
  "_originPortId_|": "",
  "_destinationPortId_|": "",
  "shlCharge_|": "",
  "thc_|": "",
  "blFee_|": "",
  "surrender_|": "",
  "convenienceFee_|": "",
  "muc_|": "",
  "seal_|": "",
  "coo_|": "",
};

function EditShlForm(props: any) {
  const regionSelectOptions = props.regionSelectOptions;
  const destinationSelectOptions = props.destinationSelectOptions;
  const handleCloseModal = props.handleCloseModal;
  const handleUpdateShlUIData = props.handleUpdateShlUIData;

  const [shlDestinationItemList, setShlDestinationItemList] = useState([]);
  const [shlPayload, setShlPayload] = useState(null);
  const [shlFormValues, setShlFormValues] = useState({ ...initialFormValues });

  const form = useForm({
    clearInputErrorOnChange: true,
    initialValues: shlFormValues,
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
    let destinationsArr: any = [...shlDestinationItemList];

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

    setShlPayload(payloadObject);
    setShlDestinationItemList(destinationsArr);

    // reset inital form value
    let formResetValues: any = {};
    Object.keys({ ...destinationObject }).map((key) => {
      formResetValues[`${key}_|`] = "";
    });
    setShlFormValues(formResetValues);
    // reset inital form value ends
  };

  const handleDeleteItem = (index: number) => {
    let destinationsArr: any = [...shlDestinationItemList];

    // logic to delete an item starts
    if (index > -1) {
      destinationsArr.splice(index, 1);
    }

    // logic to delete an item end

    setShlDestinationItemList(destinationsArr);
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
    handleUpdateShlUIData(shlPayload);

    handleCloseModal(false);
  };

  return (
    <form onSubmit={form.onSubmit(handleFormSubmit, handleError)}>
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
      {shlDestinationItemList.map((item, i) => {
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
                    defaultValue={item["shlCharge"]}
                    {...form.getInputProps("shlCharge_|" + i)}
                  />
                </Grid.Col>

                <Grid.Col span={2}>
                  <NumberInput
                    required
                    label="Surrender"
                    placeholder="Eg. 26500"
                    defaultValue={item["surrender"]}
                    {...form.getInputProps("surrender_|" + i)}
                  />
                </Grid.Col>

                <Grid.Col span={2}>
                  <NumberInput
                    required
                    label="THC"
                    placeholder="Eg. 26500"
                    defaultValue={item["thc"]}
                    {...form.getInputProps("thc_|" + i)}
                  />
                </Grid.Col>

                <Grid.Col span={2}>
                  <NumberInput
                    required
                    label="B/L Fee"
                    placeholder="Eg. 26500"
                    {...form.getInputProps("blFee_|" + i)}
                  />
                </Grid.Col>

                <Grid.Col span={2}>
                  <NumberInput
                    required
                    label="Seal"
                    placeholder="Eg. 26500"
                    {...form.getInputProps("seal_|" + i)}
                  />
                </Grid.Col>

                <Grid.Col span={2}>
                  <NumberInput
                    required
                    label="Convenience Fees"
                    placeholder="Eg. 26500"
                    {...form.getInputProps("convenienceFee_|" + i)}
                  />
                </Grid.Col>

                <Grid.Col span={2}>
                  <NumberInput
                    required
                    label="MUC"
                    placeholder="Eg. 26500"
                    {...form.getInputProps("muc_|" + i)}
                  />
                </Grid.Col>

                <Grid.Col span={2}>
                  <NumberInput
                    required
                    label="COO"
                    placeholder="Eg. 26500"
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
          {/* <TextInput
            required
            label="Enter Destination Port"
            placeholder="Eg. singapore"
            {...form.getInputProps("destination")}
          /> */}
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
              label="Enter SHL Charges"
              placeholder="Eg. 26500"
              {...form.getInputProps("shlCharge_|")}
            />
          </Grid.Col>

          <Grid.Col span={2}>
            <NumberInput
              required
              label="THC"
              placeholder="Eg. 26500"
              {...form.getInputProps("thc_|")}
            />
          </Grid.Col>

          <Grid.Col span={2}>
            <NumberInput
              required
              label="B/L Fee"
              placeholder="Eg. 26500"
              {...form.getInputProps("blFee_|")}
            />
          </Grid.Col>

          <Grid.Col span={2}>
            <NumberInput
              required
              label="Surrender"
              placeholder="Eg. 26500"
              {...form.getInputProps("surrender_|")}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <NumberInput
              required
              label="Convenience Fees"
              placeholder="Eg. 26500"
              {...form.getInputProps("convenienceFee_|")}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <NumberInput
              required
              label="MUC"
              placeholder="Eg. 26500"
              {...form.getInputProps("muc_|")}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <NumberInput
              required
              label="Seal"
              placeholder="Eg. 26500"
              {...form.getInputProps("seal_|")}
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

export default EditShlForm;
