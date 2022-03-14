import React, { useMemo } from "react";

import Modal from "../atoms/modal";
import Carousel from "../atoms/carousel";

import "./gif-modal.css";

import styled from "styled-components";

const GifDiv = styled.div`
  display: flex !important;
  justify-content: center;
  align-items: center;
`;

interface IGifModal {
  visible: boolean;
  gif: { title?: string; images?: { [key: string]: any } };
  onClose: () => void;
}

const GifModal: React.FC<IGifModal> = ({
  children,
  visible,
  gif,
  onClose,
  ...props
}) => {
  const animatedGifs = useMemo(() => {
    if (gif && gif.images && gif.images.length !== 0) {
      return Object.keys(gif.images).reduce(
        (acc: { images: { [key: string]: any } }[], key) => {
          if (gif && gif.images) {
            if (!key.includes("still") && gif.images[key].url) {
              acc.push(gif.images[key]);
            }
          }
          return acc;
        },
        []
      );
    } else {
      return [];
    }
  }, [gif]);
  return (
    <Modal
      className="gif_modal"
      data-testid="gif-modal"
      visible={visible}
      footer={null}
      title={gif.title}
      destroyOnClose={true}
      onCancel={onClose}
      width={600}
    >
      <Carousel>
        {animatedGifs.map((element: { [key: string]: any }, idx) => {
          return (
            <GifDiv key={idx}>
              <img data-testid={`animated-gif-${idx}`} src={element.url}></img>
            </GifDiv>
          );
        })}
      </Carousel>
    </Modal>
  );
};

export default GifModal;
