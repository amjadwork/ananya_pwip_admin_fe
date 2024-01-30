// Updated ImageUpload component
import React, { useRef, useState } from "react";
import { Card, createStyles, ActionIcon } from "@mantine/core";
import { Trash } from "tabler-icons-react";

const useStyles = createStyles((theme) => ({
  card: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid #ccc",
    borderRadius: "4px",
    cursor: "pointer",
    backgroundColor: "#f0f0f0",
    margin: "5px",
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2px",
  },
  cardImage: {
    width: "130px",
    height: "100px",
    objectFit: "cover",
  },
  trashIcon: {
    position: "absolute",
    top: "-14px",
    right: "-12px",
    cursor: "pointer",
    transition: "opacity 0.3s ease",
  },
  cardHovered: {
    "&:hover $trashIcon": {
      opacity: .75,
    },
  },
}));

function ImageUpload(props: any) {
  const { imageUrl, key, onDelete } = props;
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const { classes } = useStyles();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`${classes.card} ${isHovered ? classes.cardHovered : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={classes.cardContent}>
        <img src={imageUrl} alt={key} className={classes.cardImage} />
        <ActionIcon
          className={classes.trashIcon}
          variant="transparent"
          color="red"
          onClick={onDelete}
        >
          <Trash size="1.5rem" />
        </ActionIcon>
      </div>
    </div>
  );
}

export default ImageUpload;
