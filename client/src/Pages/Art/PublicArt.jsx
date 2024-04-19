import { useEffect, useState } from "react";
import "./PublicArt.css";

function PublicArt() {
  const [artData, setArtData] = useState([]);

  useEffect(() => {
    const fetchArtData = async () => {
      try {
        const response = await fetch("api/public-art");
        const data = await response.json();
        setArtData(data);
      } catch (error) {
        console.error("Error occurred while fetching art data:", error);
      }
    };

    fetchArtData();
  }, []);

  return (
    <div className="wrapper">
      <div className="gallery">
        {artData.map((art) => (
          <div className="publicart__card" key={art.title}>
            <div className="top">
              <div className="publicart__card-imgbox">
                <img src={`/assets/${art.imgpath}`} alt={art.title} />
                <div className="publicart__card-imgtitle">{art.title}</div>
              </div>
              <div className="publicart__card-textbox">
                <div className="publicart__card-bodyheading">Artist:</div>
                <div className="publicart__card-bodytext">{art.artist}</div>
                <div className="publicart__card-bodyheading">Adress:</div>
                <div className="publicart__card-bodytext">{art.address}</div>
                <div className="publicart__card-bodyheading">Description:</div>
                <div className="publicart__card-bodytext">{art.short_desc}</div>
              </div>
            </div>

            <button>+ Add</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PublicArt;
