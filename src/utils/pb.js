import PocketBaseClient from "pocketbase";
const baseUrl = import.meta.env.PB_URL;

const pb = new PocketBaseClient(baseUrl);

export default pb;
