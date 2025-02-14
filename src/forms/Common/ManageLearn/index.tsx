import React, { useEffect, useState, useRef } from "react";
import {
  Grid,
  Space,
  TextInput,
  NumberInput,
  Textarea,
  MultiSelect,
  Group,
} from "@mantine/core";
import { Button } from "../../../components/index";
import { useForm } from "@mantine/form";
import { randomId } from "@mantine/hooks";
import ReactPlayer from "react-player";


const initialFormValues = {
  url: "",
  title: "",
  author: "",
  duration_seconds: 0,
  about: "",
  tags: [],
  key: randomId(),
};

function EditLearnForm(props: any) {
  const handleCloseModal = props.handleCloseModal;
  const handleSaveAction = props.handleSaveAction;
  const updateFormData = props.updateFormData;
  const tagsList = props.tagsList;
  const modalType = props.modalType || "add";
  const [inputURL, setInputURL] = useState("");
  const [duration, setDuration] = useState<number | null>(null);
  const [tagValues, setTagValues] = useState<string[]>([]);
  const playerRef = useRef<ReactPlayer | null>(null); 
  // const playerRef = useRef(null);

  const form: any = useForm({
    clearInputErrorOnChange: true,
    initialValues: { ...initialFormValues },
  });

  const listOfTags = tagsList.map((d: any) => ({
    value: d._id,
    label: d.tagName,
  }));

  //to show previous values while editing the row
  useEffect(() => {
    if (updateFormData && modalType === "update") {
      const tagsAsStringArray = updateFormData.tags.map((tag:any) => tag.value);
      setTagValues(tagsAsStringArray);
      form.setValues({
        ...updateFormData,
        tags: [...tagsAsStringArray],
      });
      setInputURL(updateFormData.url);
    }
  }, [updateFormData, modalType]);


  const handleTagChange = (newTagValues: string[]) => {
    setTagValues(newTagValues);
    form.setValues((prevValues: any) => ({
      ...prevValues,
      tags: newTagValues,
    }));
  };

  const handleFormSubmit = (formValues: typeof form.values) => {
    // const duration = playerRef.current? playerRef.current.getDuration(): "0";
    handleSaveAction(formValues);
    handleCloseModal(false);
    form.setValues(initialFormValues);
  };


  useEffect(() => {
    if (inputURL && playerRef.current) {
      const duration = playerRef.current.getDuration();
    }
  }, [inputURL]);

  return (
    <form onSubmit={form.onSubmit(handleFormSubmit)}>
      <Grid gutter="sm">
        <Grid.Col span={12}>
          <TextInput
            required
            label="Video URL"
            value={inputURL}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const newInputURL = event.target.value;
              setInputURL(newInputURL);
              form.setValues((prevValues: any) => ({
                ...prevValues,
                url: newInputURL,
              }));
            }}
          />
          <Space h="xs" />
          {inputURL && (
            <div>
            <ReactPlayer
              ref={playerRef}
              url={inputURL}
              width={70}
              height={40}
              light={true}
              playing={false}
              onReady={(player: ReactPlayer) => {
                playerRef.current = player;
              }}
              onDuration={(duration) => {
                setDuration(duration);
              }}
            />
            <p>Duration: {duration !== null ? duration.toFixed(2) : "N/A"}</p>
          </div>
          )}
        </Grid.Col>

        <Grid.Col span={12}>
          <TextInput
            required
            label="Title"
            placeholder="eg. Packaging in Rice Export Business"
            {...form.getInputProps("title")}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <TextInput
            required
            hideControls
            label="Author"
            placeholder="eg. Dhanraj"
            {...form.getInputProps("author")}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <NumberInput
            required
            hideControls
            label="Duration(in secs)"
            placeholder="eg. 600"
            {...form.getInputProps("duration_seconds")}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Textarea
            placeholder="Write here"
            label="About"
            {...form.getInputProps("about")}
          />
        </Grid.Col>
        <Grid.Col span={12}>
           <MultiSelect
            data={listOfTags}
            label="Tags"
            placeholder="Pick all that you like"
            value={tagValues}
            onChange={handleTagChange}
            clearButtonLabel="Clear selection"
            clearable
          />
        </Grid.Col>
      </Grid>

      <Space h="sm" />
      <Group position="right" mt="md" spacing="md">
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  );
}

export default EditLearnForm;
