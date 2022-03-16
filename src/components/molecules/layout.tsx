import React from "react";

import Layout, { Content, ILayoutProps } from "../atoms/Layout";

import styled from "styled-components";

const ContentLayoutWrapper = styled(Layout)`
  height: 100vh;
  max-height: 100%;
  min-height: 100%;
  overflow: hidden;
`;

const ContentWrapper = styled(Content)`
  display: flex;
  padding: 1rem;
  padding-bottom: 0;
  overflow: auto;
  flex-direction: column;
  align-items: center;
  background: #181818;
`;

const HeaderWrapper = styled.div`
  height: 40px;
  width: 100%;
  background-image: linear-gradient(
    to right,
    #fff35c,
    #00ff99,
    #00ccff,
    #9933ff,
    #ff6666
  );
  background-size: 600% 100%;
  animation: gradient 3s infinite alternate;
  @keyframes gradient {
    0% {
      background-position: left;
    }
    100% {
      background-position: right;
    }
  }
`;

const ContentLayout: React.FC<ILayoutProps> = ({ children, ...props }) => {
  return (
    <ContentLayoutWrapper>
      <HeaderWrapper></HeaderWrapper>
      <ContentWrapper id="content-layout">{children}</ContentWrapper>
    </ContentLayoutWrapper>
  );
};

export default ContentLayout;
