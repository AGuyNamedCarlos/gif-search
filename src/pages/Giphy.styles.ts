import styled from "styled-components";

export const MainDiv = styled.div`
  width: 60%;
  text-align: center;
`;

export const RowDiv = styled.div`
  margin-top: 10px;
`;

export const GifContainer = styled.div`
  margin: 0 auto;
  max-width: 80%;
  height: 1080px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
  flex: 1 1 auto;

  @media (max-width: 1330px) {
    height: 1300px;
  }

  @media (max-width: 915px) {
    height: 1800px;
  }
`;

export const Img = styled.img`
  max-height: 100%;
  cursor: pointer;
  display: block;
  margin: 4px;
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
