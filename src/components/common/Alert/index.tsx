import React from "react";
import { Alert as MantineAlert } from "@mantine/core";

const Alert= (props: any) => {
  return (
    <MantineAlert title="Something wrong" color="red" radius="md">
      APIs Showing Error!
    </MantineAlert>
  );
};

export default Alert;
