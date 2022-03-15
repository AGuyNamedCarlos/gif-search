import React from "react";
import {
  cleanup,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import Giphy from "../Giphy";
import mockedAxios from "axios";
import { act } from "react-dom/test-utils";

afterEach(cleanup);
afterEach(jest.clearAllMocks);

beforeEach(jest.useFakeTimers);

describe("Render Components", () => {
  test("Input rendered correctly", async () => {
    render(<Giphy />);
    const input = await screen.findByTestId("search-input");
    expect(input).toBeInTheDocument();
  });

  test("Clear button renders with Clear Search", async () => {
    render(<Giphy />);
    const button = await screen.findByTestId("clear-button");
    expect(button.textContent).toBe("Clear Search");
  });

  test("Pagination Component renders correctly", async () => {
    render(<Giphy />);
    const pagination = await screen.findByTestId("pagination-component");
    expect(pagination).toBeInTheDocument();
  });
});

describe("Set Values", () => {
  test("Should be able to type in input", async () => {
    render(<Giphy />);
    const input = await screen.findByTestId("search-input");

    fireEvent.change(input, { target: { value: "Mountain" } });
    expect(input.value).toBe("Mountain");
  });

  test("Should empty input when Clear Search is clicked", async () => {
    render(<Giphy />);
    const input = await screen.findByTestId("search-input");
    const button = await screen.findByTestId("clear-button");
    fireEvent.change(input, { target: { value: "Mountain" } });
    fireEvent.click(button);

    expect(input.value).toBe("");
  });
});

describe("Fetching Data", () => {
  test("Should load the gif container component after first fetch", async () => {
    render(<Giphy />);

    const gifContainer = await screen.findByTestId("gif-container");
    expect(gifContainer).toBeInTheDocument();
    expect(mockedAxios.get).toBeCalledTimes(1);
    expect(mockedAxios.get).toBeCalledWith(
      "http://api.giphy.com/v1/gifs/trending",
      {
        params: {
          api_key: process.env.REACT_APP_API_KEY,
          limit: 20,
          offset: 0,
        },
      }
    );
  });

  test("Typing in input should trigger the searchData function", async () => {
    render(<Giphy />);
    await waitFor(async () => {
      const gifContainer = await screen.findByTestId("gif-container");
      expect(gifContainer).toBeInTheDocument();
    });
    const input = await screen.findByTestId("search-input");
    fireEvent.change(input, { target: { value: "Mountain" } });

    // Input has a debounce function to search after 1 second
    act(() => {
      jest.runAllTimers();
    });

    await waitFor(async () => {
      const gifContainer = await screen.findByTestId("gif-container");
      expect(gifContainer).toBeInTheDocument();
    });

    expect(mockedAxios.get).toBeCalledTimes(2);
    expect(mockedAxios.get).toBeCalledWith(
      "http://api.giphy.com/v1/gifs/search",
      {
        params: {
          api_key: process.env.REACT_APP_API_KEY,
          limit: 20,
          offset: 0,
          q: "Mountain",
        },
      }
    );
  });
});
