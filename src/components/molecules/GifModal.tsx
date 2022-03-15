import React, { useMemo } from "react";

import Modal from "../atoms/Modal";
import Carousel from "../atoms/Carousel";
import styled from "styled-components";

import "./GifModal.css";

import { Gif, Images } from "../../@types/giphy.types";

const GifDiv = styled.div`
  display: flex !important;
  justify-content: center;
  align-items: center;
`;

interface IGifModal {
  visible: boolean;
  gif: Gif;
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
    return (Object.keys({ ...gif.images }) as [keyof Images])
      .map((key) => {
        const image = gif.images[key];

        if ("url" in image && !key.includes("still")) {
          return image.url;
        }
        return undefined;
      })
      .filter(Boolean);
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
        {animatedGifs.map((url, idx) => {
          return (
            <GifDiv key={idx}>
              <img
                alt={gif.title}
                data-testid={`animated-gif-${idx}`}
                src={url}
              ></img>
            </GifDiv>
          );
        })}
      </Carousel>
    </Modal>
  );
};

export default GifModal;
