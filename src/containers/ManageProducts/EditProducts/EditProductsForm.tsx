import React, { useState, useEffect, useRef } from "react";
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
import { ArrowRightCircle } from "tabler-icons-react";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
// import { MyContext } from './context';

import { riceCategory } from "../../../constants/var.constants";

function EditProductForm(props: any) {
  const handleCloseModal = props.handleCloseModal;

  // const [categoriesValue, setCategoriesValue] = useState("");
  // const [catUpdateValue, setCatUpdateValue] = useState("");
  const [categoriesList, setCategoriesList] = useState([]);
  const [numberValue,setNumberValue]= useState(0);
  const [regionValue,setRegionValue]=useState("");
  const [regUpdateValue,setRegUpdateValue]=useState("");
  const [numUpdateValue,setNumUpdateValue]=useState("");

  const [allValue, setAllValue] = useState({});

  const inputRef: any = useRef(null);

  const form = useForm({
    clearInputErrorOnChange: true,
    initialValues: {
      name: "",
      category: "",
      // region: "",
      // state: "",
      // destination: "",
      // exmill: "",
      // transportation: "",
    },

    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
    },
  });

  const handleClick: any = () => {
    const arr: any = [...categoriesList];
    const categoryObj = {
      regionName: regionValue,
      exmill:numberValue,
    };
    arr.push(categoryObj);
    setCategoriesList(arr);

    console.log(arr);

    setRegionValue("");
    // setNumberValue("");
    if (inputRef) {
      inputRef.current.value = "";
    }

   
    setNumberValue(0);
    if (inputRef) {
      inputRef.current.value = "";
    }
    // const arr: any = [...categoriesList];
    // arr.push(categoriesValue);
    // console.log(arr);
    // setCategoriesList(arr);
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
  // const handleUpdate = (index: number) => {
  //   const arr: any = [...categoriesList];
  //   arr[index] = catUpdateValue;

  //   setCategoriesList(arr);

  //   console.log(arr);
  // };

  const handleSubmit = (values: typeof form.values) => {
    console.log("values", values);
    const arr:any=[];
    arr.push(values);
    setAllValue(arr);
    handleCloseModal(false);

    // if (values.category === "Basmati") {
    //   arr = [...riceCategory[0].list];
    //   arr.push(values);
    //   console.log("arr 1", arr);
    // } else {
    //   arr = [...riceCategory[1].list];
    //   arr.push(values);
    //   console.log("arr 2", arr);
    // }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit, handleError)}>
      <Select
        required
        label="Select Category"
        placeholder="Eg. Non-Basmati"
        data={[
          { value: "non-basmati", label: "Non-Basmati" },
          { value: "basmati", label: "Basmati" },
        ]}
        {...form.getInputProps("category")}
      />

      <Space h="md" />

      <TextInput
        required
        label="Variant name"
        placeholder="eg. 1509 Sella"
        {...form.getInputProps("name")}
      />

      <Space h="md" />
      {categoriesList.map((k:any, i) => {
        return (
          <Group spacing="md" key={i}>
            <Select
              required
              defaultValue={k.regionName}
              label="Select Region"
              placeholder="Eg. Karnal"
              data={[
                { value: "karnal", label: "karnal" },
                { value: "chennai", label: "chennai" },
              ]}
              onChange={(e: any) =>{ 
                console.log();
                setRegUpdateValue(e.target.value)}}
              // name={regUpdateValue}
              // {...form.getInputProps("region")}
            />

            <NumberInput
              required
              defaultValue={k.exmill }

              label="Ex-Mill"
              placeholder="Eg. 26500"
              onChange={(e: any) => setNumUpdateValue(e.target.value)}
              // name={numberValue}
              // {...form.getInputProps("exmill")}
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
          label="Select Region"
          placeholder="Eg. Karnal"
          data={[
            { value: "karnal", label: "karnal" },
            { value: "chennai", label: "chennai" },
          ]}
          value={regionValue}
          onChange={(event: any) => {
            setRegionValue(event);
          }}
          ref={inputRef}
          // {...form.getInputProps("region")}
        />

        <NumberInput
          required
          label="Ex-Mill"
          placeholder="Eg. 26500"
          value={numberValue}
          onChange={(val:number) => {
            setNumberValue(val)}}
          
          ref={inputRef}
          // {...form.getInputProps("exmill")}
        />

        <div
          style={{
            display: "inline-flex",
            alignItems: "bottom",
            width: "100%",
            marginTop: `3%`,
          }}
        >
          <Button onClick={handleClick}>+</Button>
        </div>
      </Group>

      <Space h="lg" />

      <Group position="right" mt="md">
        <Button type="submit">Save</Button>
      </Group>
    </form>
  );
}

export default EditProductForm;
