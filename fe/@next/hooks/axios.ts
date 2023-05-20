import axios from "axios";
import { environment } from "@config";

export const domain: string = environment.apiUrl;

export const url: string = `${domain}`;
export const requestUrl = axios.create({
  baseURL: url,
});
