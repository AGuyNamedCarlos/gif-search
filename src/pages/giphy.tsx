import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

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
import Button from "../components/atoms/Button";
import Pagination from "../components/atoms/Pagination";
import GifModal from "../components/molecules/GifModal";
import ScrollTop from "../components/atoms/ScrollTop";

import Spin from "../components/atoms/Spinner";

import LoadingContext from "../contexts/loading-context";

import { Gif, GiphyResponse } from "../@types/giphy.types";
import {
  GifContainer,
  Img,
  SpinDiv,
  TitleDiv,
  MainDiv,
  RowDiv,
} from "./Giphy.styles";
interface IPagination {
  totalItems: number;
  items: number;
}

const Giphy = () => {
  const [data, setData] = useState<Gif[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedGif, setSelectedGif] = useState<Gif>();
  const [paginationState, setPaginationState] = useState<IPagination>(
    defaultPaginationState
  );
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [currentPage, setCurrentPage] = useState(defaultCurrentPage);
  const [title, setTitle] = useState("");

  let [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const search = searchParams.get("search");
    if (search) {
      setSearchValue(search);
    }
  }, [searchParams]);

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
    if (!!searchValue) {
      try {
        setLoading(true);
        const { data, status } = await axios.get<GiphyResponse>(
          "http://api.giphy.com/v1/gifs/search",
          {
            params: {
              offset,
              api_key: API_KEY,
              q: searchValue,
              limit: itemsPerPage,
            },
          }
        );

        if (status === 200) {
          const { data: items = [], pagination } = data;
          setTitle(
            searchValue
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
  }, [searchValue, itemsPerPage, offset]);

  /*
    The Giphy API does not always return the same total_count when moving through pages.
    If the user clicks a page that does not have anything, this function will get the actual
    last page and redirect to it.
  */
  useEffect(() => {
    const { totalItems } = paginationState;
    if (data.length === 0 && totalItems !== 0) {
      const newLastPage = Math.ceil(totalItems / itemsPerPage);
      setCurrentPage(newLastPage);
    }
  }, [data, itemsPerPage, paginationState]);

  useEffect(() => {
    if (loading) {
      setTitle("Loading Awesome Gifs!");
    }
  }, [loading]);

  const getData = useCallback(() => {
    if (searchValue) {
      searchData();
    } else {
      fetchTrending();
    }
  }, [searchData, fetchTrending, searchValue]);

  useEffect(() => {
    let timeout = window.setTimeout(async () => {
      getData();
    }, 500);
    return () => {
      window.clearTimeout(timeout);
    };
  }, [searchValue, getData]);

  useEffect(() => {
    setSearchParams({
      ...(searchValue && { search: searchValue }),
    });
  }, [searchValue, setSearchParams]);

  const onInputChange = (event: any) => {
    setSearchValue(event.target.value);
    setCurrentPage(1);
  };

  const onPageChange = (page: number, pageSize: number) => {
    setItemsPerPage(pageSize || defaultItemsPerPage);
    setCurrentPage(page);
  };

  const clearSearch = () => {
    setSearchValue("");
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
      <>
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
      </>
    );
  };
  const loadingTime = !!loading ? "loading_time" : "";
  return (
    <LoadingContext.Provider value={{ loading: loading }}>
      <ContentLayout>
        <MainDiv>
          <RowDiv>
            <Input
              style={{ width: "calc(60% - 200px)" }}
              data-testid="search-input"
              value={searchValue}
              onChange={onInputChange}
              placeholder="Type to search"
            />
            <Button data-testid="clear-button" onClick={clearSearch}>
              Clear Search
            </Button>
          </RowDiv>
          <RowDiv>
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
          </RowDiv>
          <RowDiv>
            <TitleDiv className={loadingTime}>{title}</TitleDiv>
          </RowDiv>
          <RowDiv>
            {!loading && data.length > 0 ? (
              <GifContainer data-testid="gif-container">
                {renderGifs()}
              </GifContainer>
            ) : (
              <SpinDiv>
                <Spin size="large" />
              </SpinDiv>
            )}
          </RowDiv>
        </MainDiv>
        {!!selectedGif && (
          <GifModal visible={true} gif={selectedGif} onClose={onCloseModal} />
        )}
      </ContentLayout>
      <ScrollTop elementId={"content-layout"} />
    </LoadingContext.Provider>
  );
};

export default Giphy;
