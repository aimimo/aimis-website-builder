import type { JSONContent } from "@tiptap/react";
import axios from "axios";

const API = "http://localhost:3000";

export const getPages = async () => {
  const res = await axios.get(`${API}/pages`);
  return res.data.pages;
};

export const createPage = async (data: {
  title: string;
  site_id: number;
  slug: string;
  content: JSONContent;
}) => {
  const res = await axios.post(`${API}/pages`, data);
  return res.data;
};

export const getPageBySlug = async (slug: string) => {
  const res = await axios.get(`${API}/pages/${slug}`);
  return res.data;
};
