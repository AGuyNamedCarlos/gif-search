import React, { useEffect, useState, useCallback, useMemo } from "react";

import axios from "axios";

import {
  API_KEY,
  defaultItemsPerPage,
  defaultCurrentPage,
  defaultPaginationState,
  MAX_GIPHY_OFFSET,
} from "../constants/consts";
import notification from "../components/atoms/Notification";
import ContentLayout from "../components/molecules/Layout";
import Input from "../components/atoms/Input";
import Col from "../components/atoms/Col";
import Button from "../components/atoms/Button";
import Pagination from "../components/atoms/Pagination";
import GifModal from "../components/molecules/GifModal";

import Spin from "../components/atoms/Spinner";

import LoadingContext from "../contexts/loading-context";

import { Gif, GiphyResponse } from "../@types/giphy.types";
import {
  GifContainer,
  ImagesDiv,
  Img,
  SpinDiv,
  TitleDiv,
} from "./Giphy.styles";
interface IPagination {
  totalItems: number;
  items: number;
}

const Giphy = () => {
  const [data, setData] = useState<Gif[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [selectedGif, setSelectedGif] = useState<Gif>();
  const [paginationState, setPaginationState] = useState<IPagination>(
    defaultPaginationState
  );
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [currentPage, setCurrentPage] = useState(defaultCurrentPage);
  const [title, setTitle] = useState("");

  // Used to determine which "page" we have to call.
  const offset = useMemo(() => {
    return Math.min(itemsPerPage * (currentPage - 1), MAX_GIPHY_OFFSET);
  }, [itemsPerPage, currentPage]);

  const showErrorMessage = () => {
    notification.error({
      message: "Error",
      description: "Unable to load gifs. Please try again in a few seconds.",
      duration: 5,
      placement: "topRight",
    });
  };

  // Default call without any query
  const fetchTrending = useCallback(async () => {
    try {
      setLoading(true);
      const { data, status } = await axios.get<GiphyResponse>(
        "http://api.giphy.com/v1/gifs/trending",
        {
          params: {
            offset,
            api_key: API_KEY,
            limit: itemsPerPage,
          },
        }
      );
      if (status === 200) {
        const { data: items = [], pagination } = data;
        setTitle("Trending Gifs!");
        setData(items);
        setPaginationState({
          totalItems: pagination.total_count,
          items: items.length,
        });
      }
    } catch (error) {
      setData([]);
      showErrorMessage();
    } finally {
      setLoading(false);
    }
  }, [itemsPerPage, offset]);

  // Queried Search for gifs
  const searchData = useCallback(async () => {
    if (!!searchParam) {
      try {
        setLoading(true);
        const { data, status } = await axios.get<GiphyResponse>(
          "http://api.giphy.com/v1/gifs/search",
          {
            params: {
              offset,
              api_key: API_KEY,
              q: searchParam,
              limit: itemsPerPage,
            },
          }
        );

        if (status === 200) {
          const { data: items = [], pagination } = data;
          setTitle(
            searchParam
              .split(" ")
              .map(
                (title) =>
                  `${title.charAt(0).toUpperCase()}${title.slice(1)} Gifs!`
              )
              .join(" ")
          );
          setData(items);
          setPaginationState({
            totalItems: pagination.total_count,
            items: items.length,
          });
        }
      } catch (error) {
        setData([]);
        showErrorMessage();
      } finally {
        setLoading(false);
      }
    }
  }, [searchParam, itemsPerPage, offset]);

  useEffect(() => {
    if (loading) {
      setTitle("Loading Awesome Gifs!");
    }
  }, [loading]);

  const getData = useCallback(() => {
    if (searchParam) {
      searchData();
    } else {
      fetchTrending();
    }
  }, [searchData, fetchTrending, searchParam]);

  useEffect(() => {
    let timeout = window.setTimeout(async () => {
      getData();
    }, 500);
    return () => {
      window.clearTimeout(timeout);
    };
  }, [searchParam, getData]);

  const onInputChange = (event: any) => {
    setSearchParam(event.target.value);
    setCurrentPage(1);
  };

  const onPageChange = (page: number, pageSize: number) => {
    setItemsPerPage(pageSize || defaultItemsPerPage);
    setCurrentPage(page);
  };

  const clearSearch = () => {
    setSearchParam("");
    setCurrentPage(1);
  };

  const selectGif = (gif: Gif) => {
    setSelectedGif(gif);
  };

  const onCloseModal = () => {
    setSelectedGif(undefined);
  };

  const renderGifs = () => {
    return (
      <ImagesDiv data-testid="gif-container">
        {data.map((element: any, idx) => {
          return (
            <Img
              key={idx}
              data-testid={`gif-item-${idx}`}
              src={element.images.fixed_width_still.url}
              alt={element.title}
              onClick={(e) => selectGif(element)}
            />
          );
        })}
      </ImagesDiv>
    );
  };

  const loadingTime = !!loading ? "loading_time" : "";
  return (
    <LoadingContext.Provider value={{ loading: loading }}>
      <ContentLayout>
        <div
          className="ant-row ant-row-center"
          style={{ rowGap: "5px", marginLeft: "-16px", marginRight: "-16px" }}
        >
          <Col span={14} offset={4}>
            <Input.Group>
              <Input
                style={{ width: "calc(100% - 200px)" }}
                data-testid="search-input"
                value={searchParam}
                onChange={onInputChange}
                placeholder="Type to search"
              />
              <Button data-testid="clear-button" onClick={clearSearch}>
                Clear Search
              </Button>
            </Input.Group>
          </Col>
          <Col span={12} offset={6}>
            <Pagination
              data-testid="pagination-component"
              showLessItems={true}
              total={paginationState.totalItems}
              current={currentPage}
              pageSize={itemsPerPage}
              defaultPageSize={defaultItemsPerPage}
              defaultCurrent={defaultCurrentPage}
              onChange={onPageChange}
              showSizeChanger={false}
            />
          </Col>
          <Col span={22}>
            <TitleDiv className={loadingTime}>{title}</TitleDiv>
          </Col>
          <Col span={24}>
            {!loading && data.length > 0 ? (
              <GifContainer>{renderGifs()}</GifContainer>
            ) : (
              <SpinDiv>
                <Spin size="large" />
              </SpinDiv>
            )}
          </Col>
        </div>
        {!!selectedGif && (
          <GifModal visible={true} gif={selectedGif} onClose={onCloseModal} />
        )}
      </ContentLayout>
    </LoadingContext.Provider>
  );
};

export default Giphy;
