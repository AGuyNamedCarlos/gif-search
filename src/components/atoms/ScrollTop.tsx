import React, { useEffect, useState, useCallback } from "react";
import { UpOutlined } from "@ant-design/icons";
import styled from "styled-components";

const ScrollIcon = styled.div`
  background: white;
  position: fixed;
  bottom: 15px;
  right: 32px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: #121212;
  opacity: 0;
  pointer-events: none;
  transition: all 0.4s;

  &.active {
    bottom: 32px;
    pointer-events: auto;
    opacity: 1;
  }
`;

type ScrollTopType = {
  elementId: string;
};

const ScrollTop = ({ elementId }: ScrollTopType) => {
  const [isVisible, setIsVisible] = useState(false);
  const [element, setElement] = useState<HTMLElement>();

  useEffect(() => {
    if (elementId) {
      setElement(document.getElementById(elementId) || undefined);
    }
  }, [elementId]);

  const toggleVisibility = useCallback(() => {
    setIsVisible((element?.scrollTop || 0) > 300);
  }, [element]);

  const scrollToTop = () => {
    element?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    element &&
      element.addEventListener("scroll", toggleVisibility, { passive: true });

    return () => {
      element && element.removeEventListener("scroll", toggleVisibility);
    };
  }, [element, toggleVisibility]);

  const active = isVisible ? "active" : "";
  return (
    <ScrollIcon onClick={scrollToTop} className={active}>
      <UpOutlined />
    </ScrollIcon>
  );
};

export default ScrollTop;
