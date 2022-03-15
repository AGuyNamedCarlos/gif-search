import styled from "styled-components";

export const GifContainer = styled.div`
  margin: 0 auto;
  width: 95%;
  height: 1080px;
`;

export const ImagesDiv = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  max-height: 100%;
`;

export const Img = styled.img`
  cursor: pointer;
  display: block;
  float: left;
  flex: 0 0 auto;
  margin: 8px;
`;

export const SpinDiv = styled.div`
  text-align: center;
`;

export const TitleDiv = styled.div`
  background: linear-gradient(
    to right,
    #fff35c 20%,
    #00ff99 40%,
    #00ccff 60%,
    #9933ff 80%,
    #ff6666 100%
  );
  background-size: 200% auto;
  font-size: 24px;
  color: #000;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;

  &.loading_time {
    text-align: center;
  }

  animation: shine 3s linear infinite;
  @keyframes shine {
    to {
      background-position: 200%;
    }
  }
`;
