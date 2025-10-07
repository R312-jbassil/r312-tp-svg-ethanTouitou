import pocketbase from "pocketbase";
const baseUrl = import.meta.env.PB_URL;

const pb = new pocketbase(baseUrl);

export default pb;
