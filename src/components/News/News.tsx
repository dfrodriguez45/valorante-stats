"use client";

import React from "react";
import useSWR from "swr";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "./News.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

type Props = {};

const News = (props: Props) => {
  const { data, error, isLoading } = useSWR("/api/news", (url) =>
    axios
      .post(url, {
        country: "es-mx",
      })
      .then((res) => res.data)
  );
  return (
    <Swiper
      modules={[Pagination, Navigation, Autoplay]}
      loop={true}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      className="news-container"
    >
      {data?.length > 0 &&
        data.map((item: any) => (
          <SwiperSlide key={item.title}>
            <NewsItem data={item} />
          </SwiperSlide>
        ))}
    </Swiper>
  );
};

type NewsProps = {
  data: any;
};

const NewsItem = ({ data }: NewsProps) => {
  return (
    <a href={data.external_link || data.url} target="_blank" className="news-item">
      <img src={data.banner_url} alt="" className="news-item__image" />
      <div className="news-item__title">{data.title}</div>
    </a>
  );
};

export default News;
