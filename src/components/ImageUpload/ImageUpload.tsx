import React, { useRef } from "react";
import { Card, Group, createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  cardContainer: {
    display: "flex",
    flexDirection: "row",
    gap: "16px"
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid #ccc",
    borderRadius: "4px",
    cursor: "pointer",
    backgroundColor: "#f0f0f0",
    margin:"5px"
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding:"2px" 
  },
  cardImage: {
    width:"130px",
    height:"100px" ,
    fit:"fit",
  },
}));


function ImageUpload(props: any) {
  const { imageUrl, key} = props;
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const { classes } = useStyles();
 console.log(imageUrl, "imageurl")
  return (
    <div className={classes.cardContainer}>
      <div
        className={classes.card}
      >
        <div className={classes.cardContent}>
        <img 
        src={imageUrl} 
        alt={key}
        className={classes.cardImage} />
        </div>
      </div>
    </div>
  );
}

export default ImageUpload;