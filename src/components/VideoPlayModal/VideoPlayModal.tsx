import React from 'react';
import ReactPlayer from 'react-player';

const VideoPlayModal = (props:any) => {
const selectedRowData=props.selectedRowData;
const videoUrl = selectedRowData.url;

  return (
    <ReactPlayer
      url={videoUrl}
      width="100%"
      height={400}
      light={true}
    />
  );
};

export default VideoPlayModal;






