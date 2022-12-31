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

function EditShlForm(props: any) {
  const [categoriesValue, setCategoriesValue] = useState("");
  const [catUpdateValue, setCatUpdateValue] = useState("");
  const [categoriesList, setCategoriesList] = useState([]);

  const [allValue, setAllValue] = useState({});

  const form = useForm({
    clearInputErrorOnChange: true,
    initialValues: {
      name: "",
      category: "",
      city: "",
      state: "",
      // destination: "",
      exmill: "",
      // transportation: "",
    },

    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
    },
  });

  const handleClick: any = () => {
    const arr: any = [...categoriesList];
    arr.push(categoriesValue);
    console.log(arr);
    setCategoriesList(arr);
  };

  const handleDeleteItem = (index: number) => {
    const arr: any = [...categoriesList];

    // logic to delete an item starts
    if (index > -1) {
      arr.splice(index, 1);
    }

    // logic to delete an item end

    setCategoriesList(arr);
    console.log(arr);
  };

  const handleError = (errors: typeof form.errors) => {
    if (errors.name) {
      showNotification({ message: "Please fill name field", color: "red" });
    }
  };
  const handleUpdate = (index: number) => {
    const arr: any = [...categoriesList];
    arr[index] = catUpdateValue;

    setCategoriesList(arr);

    console.log(arr);
  };

  const handleSubmit = (values: typeof form.values) => {
    let arr: any = [];
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit, handleError)}>
      <TextInput
        required
        label="Enter Origin Port"
        placeholder="Eg. chennai"
        {...form.getInputProps("originPort")}
      />

      <Space h="md" />
      {categoriesList.map((k, i) => {
        return (
          <Group spacing="md" key={i}>
            <TextInput
              required
              label="Enter Destination Port"
              placeholder="Eg. singapore"
              data={[]}
              {...form.getInputProps("destination")}
            />


            <NumberInput
              required
              label="Enter SHL Charges"
              placeholder="Eg. 26500"
              {...form.getInputProps("shl")}
            />
            <NumberInput
                  required
                  label="Surrender"
                  placeholder="Eg. 26500"
                  {...form.getInputProps("surrender")}
                />
            <NumberInput
                  required
                  label="THC"
                  placeholder="Eg. 26500"
                  {...form.getInputProps("thc")}
                />
            <div
              style={{
                display: "inline-flex",
                alignItems: "bottom",
                // width: "100%",
                marginTop: `3%`,
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

            <Grid>
              
              <Grid.Col span={2}>
                <NumberInput
                  required
                  label="B/L Fee"
                  placeholder="Eg. 26500"
                  {...form.getInputProps("blfee")}
                />
              </Grid.Col>
              <Grid.Col span={2}>
                <NumberInput
                  required
                  label="Seal"
                  placeholder="Eg. 26500"
                  {...form.getInputProps("Seal")}
                />
              </Grid.Col>
              <Grid.Col span={2}>
                <NumberInput
                  required
                  label="Convenience Fees"
                  placeholder="Eg. 26500"
                  {...form.getInputProps("cf")}
                />
              </Grid.Col>
              <Grid.Col span={2}>
                <NumberInput
                  required
                  label="MUC"
                  placeholder="Eg. 26500"
                  {...form.getInputProps("muc")}
                />
              </Grid.Col>
              <Grid.Col span={2}>
                <NumberInput
                  required
                  label="COO"
                  placeholder="Eg. 26500"
                  {...form.getInputProps("coo")}
                />
              </Grid.Col>
            </Grid>

          </Group>
        );
      })}

      <Space h="md" />

      <Group>
        <TextInput
          required
          label="Enter Destination Port"
          placeholder="Eg. singapore"
          data={[]}
          {...form.getInputProps("destination")}
        />

        <NumberInput
          required
          label="Enter SLL Charges"
          placeholder="Eg. 26500"
          {...form.getInputProps("shl")}
        />
        <NumberInput
              required
              label="THC"
              placeholder="Eg. 26500"
              {...form.getInputProps("thc")}
            />
            <NumberInput
              required
              label="B/L Fee"
              placeholder="Eg. 26500"
              {...form.getInputProps("blfee")}
            />
         <div
          style={{
            display: "inline-flex",
            alignItems: "bottom",
            // width: "100%",
            marginTop: `3%`,
          }}
        >
          <Button onClick={handleClick}>+</Button>
         
        </div>
        <Grid>

          <Grid.Col span={2}>
            <NumberInput
              required
              label="Surrender"
              placeholder="Eg. 26500"
              {...form.getInputProps("surrender")}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <NumberInput
              required
              label="Convenience Fees"
              placeholder="Eg. 26500"
              {...form.getInputProps("cf")}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <NumberInput
              required
              label="MUC"
              placeholder="Eg. 26500"
              {...form.getInputProps("muc")}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <NumberInput
              required
              label="Seal"
              placeholder="Eg. 26500"
              {...form.getInputProps("Seal")}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <NumberInput
              required
              label="COO"
              placeholder="Eg. 26500"
              {...form.getInputProps("coo")}
            />
          </Grid.Col>
        </Grid>
        <div
          style={{
            display: "inline-flex",
            alignItems: "bottom",
            width: "100%",
            marginTop: `3%`,
          }}
        >
         
          
        </div>
      </Group>

      <Space h="lg" />

      <Group position="right" mt="md">
        <Button type="submit">Save</Button>
      </Group>
    </form>
  );
}

export default EditShlForm;
