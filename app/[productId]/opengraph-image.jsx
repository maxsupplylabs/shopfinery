import { ImageResponse } from "next/og";
import { getDocumentByFieldValue } from "../../utils/functions";
// Route segment config
export const runtime = "edge";
// Image metadata
export const alt = "About Acme";
export const size = {
  width: 500,
  height: 500,
};
export const contentType = "image/png";
// Image generation
export default async function Image({ params }) {

  const { productId } = params;
  async function imgURL() {
    let data;
    try {
      const res = await getDocumentByFieldValue(
        "products",
        "id",
        productId
      );
      data = {
        img:
          res?.images[0]?.src ||
          "",
        name: res?.name || "",
      };
    } catch (e) {
      console.log(e);
      data = {
        img: "",
        name: "",
      };
    }
    return data;
  }
  const data = await imgURL();
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: "#333",
          backgroundColor: "#f8f8f8",
          position: "relative",
        }}
      >
        <img
          src={data?.img}
          alt={"name"}
          style={{
            width: "500px",
            height: "500px",
            // borderRadius: "14px",
            marginBottom: "10px",
          }}
        />

      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  );
}