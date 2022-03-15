import React from "react";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import GifModal from "../GifModal";

afterEach(cleanup);
afterEach(jest.clearAllMocks);

beforeEach(jest.useFakeTimers);

const mockGif = {
  id: "Ya9zfjDhKACHuf9Kri",
  url: "https://giphy.com/gifs/bafta-baftas-bafta-2022-Ya9zfjDhKACHuf9Kri",
  title: "Bafta 2022 GIF by BAFTA",
  images: {
    original: {
      height: "269",
      width: "480",
      size: "3248827",
      url: "https://media1.giphy.com/media/Ya9zfjDhKACHuf9Kri/giphy.gif?cid=9de43ad3w4p3a4cfsse4igxtpdz4a2fy7vb2pcb8e7nw7izo&rid=giphy.gif&ct=g",
      mp4_size: "289910",
      mp4: "https://media1.giphy.com/media/Ya9zfjDhKACHuf9Kri/giphy.mp4?cid=9de43ad3w4p3a4cfsse4igxtpdz4a2fy7vb2pcb8e7nw7izo&rid=giphy.mp4&ct=g",
      frames: "61",
      hash: "435e2053ac611f9d4857aa1f4cf6e205",
    },
    downsized_large: {
      height: "269",
      width: "480",
      size: "3248827",
      url: "https://media1.giphy.com/media/Ya9zfjDhKACHuf9Kri/giphy.gif?cid=9de43ad3w4p3a4cfsse4igxtpdz4a2fy7vb2pcb8e7nw7izo&rid=giphy.gif&ct=g",
    },
    downsized_medium: {
      height: "269",
      width: "480",
      size: "3248827",
      url: "https://media1.giphy.com/media/Ya9zfjDhKACHuf9Kri/giphy.gif?cid=9de43ad3w4p3a4cfsse4igxtpdz4a2fy7vb2pcb8e7nw7izo&rid=giphy.gif&ct=g",
    },
    fixed_height: {
      height: "200",
      width: "357",
      size: "2340596",
      url: "https://media1.giphy.com/media/Ya9zfjDhKACHuf9Kri/200.gif?cid=9de43ad3w4p3a4cfsse4igxtpdz4a2fy7vb2pcb8e7nw7izo&rid=200.gif&ct=g",
    },
    fixed_height_downsampled: {
      height: "200",
      width: "357",
      size: "276235",
      url: "https://media1.giphy.com/media/Ya9zfjDhKACHuf9Kri/200_d.gif?cid=9de43ad3w4p3a4cfsse4igxtpdz4a2fy7vb2pcb8e7nw7izo&rid=200_d.gif&ct=g",
    },
    fixed_height_still: {
      height: "200",
      width: "357",
      size: "45346",
      url: "https://media1.giphy.com/media/Ya9zfjDhKACHuf9Kri/200_s.gif?cid=9de43ad3w4p3a4cfsse4igxtpdz4a2fy7vb2pcb8e7nw7izo&rid=200_s.gif&ct=g",
    },
    fixed_width: {
      height: "112",
      width: "200",
      size: "797505",
      url: "https://media1.giphy.com/media/Ya9zfjDhKACHuf9Kri/200w.gif?cid=9de43ad3w4p3a4cfsse4igxtpdz4a2fy7vb2pcb8e7nw7izo&rid=200w.gif&ct=g",
      webp_size: "139792",
      webp: "https://media1.giphy.com/media/Ya9zfjDhKACHuf9Kri/200w.webp?cid=9de43ad3w4p3a4cfsse4igxtpdz4a2fy7vb2pcb8e7nw7izo&rid=200w.webp&ct=g",
    },
    fixed_width_downsampled: {
      height: "112",
      width: "200",
      size: "102185",
      url: "https://media1.giphy.com/media/Ya9zfjDhKACHuf9Kri/200w_d.gif?cid=9de43ad3w4p3a4cfsse4igxtpdz4a2fy7vb2pcb8e7nw7izo&rid=200w_d.gif&ct=g",
    },
    fixed_width_still: {
      height: "112",
      width: "200",
      size: "17396",
      url: "https://media1.giphy.com/media/Ya9zfjDhKACHuf9Kri/200w_s.gif?cid=9de43ad3w4p3a4cfsse4igxtpdz4a2fy7vb2pcb8e7nw7izo&rid=200w_s.gif&ct=g",
    },
    original_still: {
      height: "269",
      width: "480",
      size: "62794",
      url: "https://media1.giphy.com/media/Ya9zfjDhKACHuf9Kri/giphy_s.gif?cid=9de43ad3w4p3a4cfsse4igxtpdz4a2fy7vb2pcb8e7nw7izo&rid=giphy_s.gif&ct=g",
    },
    "480w_still": {
      height: "269",
      width: "480",
      size: "3248827",
      url: "https://media1.giphy.com/media/Ya9zfjDhKACHuf9Kri/480w_s.jpg?cid=9de43ad3w4p3a4cfsse4igxtpdz4a2fy7vb2pcb8e7nw7izo&rid=480w_s.jpg&ct=g",
    },
  },
};

describe("Gif Display Modal", () => {
  test("The Header should display the title of the gif", async () => {
    render(<GifModal gif={mockGif} visible={true} />);

    const modalHeader = await screen.findByText("Bafta 2022 GIF by BAFTA");
    expect(modalHeader).toBeInTheDocument();
  });

  test("The Different renditions of the gif should be displayed", async () => {
    render(<GifModal gif={mockGif} visible={true} />);

    await waitFor(async () => {
      const images = await screen.findAllByTestId(/animated-gif-/i);
      expect(images.length).not.toBe(0);
    });
  });
});
