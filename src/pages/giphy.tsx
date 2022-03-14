import React, { useEffect, useState, useCallback, useMemo } from "react";
import useDebounce from "../hooks/useDebounce";

import axios from "axios";
import styled from "styled-components";
import {
  API_KEY,
  defaultItemsPerPage,
  defaultCurrentPage,
  defaultPaginationState,
  MAX_GIPHY_OFFSET,
} from "../constants/consts";
import notification from "../components/atoms/notification";
import ContentLayout from "../components/molecules/layout";
import Input from "../components/atoms/input";
import Col from "../components/atoms/col";
import Button from "../components/atoms/button";
import Pagination from "../components/atoms/pagination";
import GifModal from "../components/molecules/gif-modal";

import Spin from "../components/atoms/spinner";

import LoadingContext from "../contexts/loading-context";

const GifContainer = styled.div`
  margin: 0 auto;
  width: 95%;
  height: 1080px;
`;

const ImagesDiv = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  max-height: 100%;
`;

const Img = styled.img`
  cursor: pointer;
  display: block;
  float: left;
  flex: 0 0 auto;
  margin: 8px;
`;

const SpinDiv = styled.div`
  text-align: center;
`;

const TitleDiv = styled.div`
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

interface IPagination {
  totalItems: number;
  items: number;
}

const Giphy = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [selectedGif, setSelectedGif] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [paginationState, setPaginationState] = useState<IPagination>(
    defaultPaginationState
  );
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [currentPage, setCurrentPage] = useState(defaultCurrentPage);

  // Used to determine which "page" we have to call.
  const offset = useMemo(() => {
    return Math.min(itemsPerPage * (currentPage - 1), MAX_GIPHY_OFFSET);
  }, [itemsPerPage, currentPage]);

  const title = useMemo(() => {
    if (!!loading) return "Loading Awesome Gifs!";

    if (!searchParam) {
      return "Trending Gifs!";
    }

    const arr = searchParam.split(" ");

    for (var i = 0; i < arr.length; i++) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }
    const capitalizedSearch = arr.join(" ");

    return `${capitalizedSearch} Gifs!`;
  }, [data, loading]);

  // Default call without any query
  const fetchTrending = useCallback(async () => {
    try {
      setLoading(true);
      const { data, status } = await axios.get(
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
        const { data: items = [], pagination = {} } = data;
        setData(items);
        setPaginationState({
          totalItems: pagination.total_count,
          items: items.length,
        });
        setLoading(false);
      }
    } catch (error) {
      setData([]);
      setLoading(false);
      showErrorMessage();
    }
  }, [searchParam, currentPage, itemsPerPage]);

  // Queried Search for gifs
  const searchData = useCallback(async () => {
    if (!!searchParam) {
      try {
        setLoading(true);
        const { data, status } = await axios.get(
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
          const { data: items = [], pagination = {} } = data;

          setData(items);
          setPaginationState({
            totalItems: pagination.total_count,
            items: items.length,
          });
          setLoading(false);
        }
      } catch (error) {
        setData([]);
        setLoading(false);
        showErrorMessage();
      }
    }
  }, [searchParam, itemsPerPage, currentPage]);

  useEffect(() => {
    if (!!searchParam) {
      searchData();
    } else {
      fetchTrending();
    }
  }, [currentPage, itemsPerPage]);

  const debounceSearch = () => {
    if (!!searchParam) {
      searchData();
    } else if (currentPage !== 1) {
      setCurrentPage(1);
      fetchTrending();
    }
  };

  // Allow for search as the user types
  useDebounce(debounceSearch, [searchParam], 1000);

  const showErrorMessage = () => {
    notification.error({
      message: "Error",
      description: "Unable to load gifs. Please try again in a few seconds.",
      duration: 5,
      placement: "topRight",
    });
  };

  const onInputChange = (event: any) => {
    setSearchParam(event.target.value);
    if (event.target.value === "") {
      fetchTrending();
    }
  };

  const onPageChange = (page: number, pageSize: number) => {
    setItemsPerPage(pageSize || defaultItemsPerPage);
    setCurrentPage(page);
  };

  const clearSearch = () => {
    setSearchParam("");
    setCurrentPage(1);
    fetchTrending();
  };

  const selectGif = (element: any) => {
    setSelectedGif(element);
    setShowModal(true);
  };

  const onCloseModal = () => {
    setShowModal(false);
    setSelectedGif({});
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
        <GifModal
          visible={showModal}
          gif={selectedGif}
          onClose={onCloseModal}
        />
      </ContentLayout>
    </LoadingContext.Provider>
  );
};

export default Giphy;
