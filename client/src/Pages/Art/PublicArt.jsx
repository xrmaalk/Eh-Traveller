import { useEffect, useState, useContext } from "react"
import "./PublicArt.css"

import { AuthContext } from "../../components/Auth/AuthProvider"
import NavBar from "../../components/ReusableComponents/NavBar"
import Footer from "../../components/Footer/Footer"
import DateTimeModal from "../../components/Itinerary/DateTimeModal"
import NavMenu from "../../components/Navigation/NavMenu"

function PublicArt() {
  const { auth } = useContext(AuthContext)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4
  const [loadError, setLoadError] = useState(null)
  const [artData, setArtData] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [modalArtItem, setModalArtItem] = useState(null)
  const [eventData, setEventData] = useState({
    date: "",
    user: "",
    eventTime: "",
    eventTitle: "",
    place: "",
    description: "",
  })

  useEffect(() => {
    const fetchArtData = async () => {
      try {
        const response = await fetch("api/public-art")
        const data = await response.json()
        setArtData(data)
      } catch (error) {
        console.error("Error occurred while fetching art data:", error)
      }
    }

    fetchArtData()
  }, [])

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = artData.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(artData.length / itemsPerPage)

  const handleArtItemPost = async (artItem, eventData, date, time) => {
    console.log("Art item:", artItem)
    if (!auth || !auth.accessToken) {
      setModalType("signin")
      setShowModal(true)
      return
    }
    try {
      console.log("1. EventData: ", eventData)
      console.log("2. User:....", auth._id)
      const dateTime = new Date(`${date}T00:00:00.000Z`)
      const formattedDate = dateTime.toISOString()
      const response = await fetch("/api/dayevent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.accessToken}`,
        },
        body: JSON.stringify({
          ...eventData,
          user: auth._id,
          username: auth.username,
          eventTitle: artItem.title || eventData.eventTitle,
          date: formattedDate,
          eventTime: time,
          place: `${artItem.lat},${artItem.lng}`,
          description: artItem.short_desc,
        }),
      })
      if (!response.ok) {
        throw new Error("Event creation failed...")
      }
      console.log("Event created successfully:", await response.json())
      setShowModal(false)
    } catch (error) {
      console.error("Event creation error:", error)
      setLoadError(error.message)
    }
  }

  const handleAddToItinerary = async (art) => {
    // Create a new object with only the title and coordinates
    const event = {
      eventTitle: art.title,
      lat: art.point.coordinates[1],
      lng: art.point.coordinates[0],
      point: art.point,
      short_desc: art.short_desc,
    }

    // Populate eventData with the art item data
    setEventData({
      eventTitle: art.title,
      place: `${art.point.coordinates[1]},${art.point.coordinates[0]}`,
      description: art.short_desc,
    })

    // Show the modal and save the art item
    setModalArtItem(event)
    setShowModal(true)
  }

  const handleModalConfirm = async (date, time) => {
    // Set date and time in eventData
    const updatedEventData = {
      ...eventData,
      date: date,
      eventTime: time,
      eventTitle: modalArtItem.eventTitle,
    }
    setEventData(updatedEventData)

    // Close the modal
    setShowModal(false)
    await handleArtItemPost(modalArtItem, updatedEventData, date, time)
  }

  return (
    <>
      <NavMenu />
      <DateTimeModal
        showModal={showModal}
        handleClose={() => setShowModal(false)}
        handleConfirm={handleModalConfirm}
      />
      <div className="wrapper bg-[#ECECEC]">
        {loadError && <p>Error: {loadError}</p>}
        <div>
          <button
            onClick={() => {
              if (currentPage > 1) {
                setCurrentPage(currentPage - 1)
              }
            }}
          >
            &lt; Previous
          </button>
          <button
            onClick={() => {
              if (currentPage < totalPages) {
                setCurrentPage(currentPage + 1)
              }
            }}
          >
            Next &gt;
          </button>
        </div>
        <div className="gallery">
          {currentItems.map((art) => (
            <div className="publicart__card" key={art.title}>
              <div className="top">
                <div className="publicart__card-imgbox prompt-card">
                  <img src={`/assets/${art.imgpath}`} alt={art.title} />
                  <div className="publicart__card-imgtitle">{art.title}</div>
                </div>
                <div className="publicart__card-textbox">
                  <div className="publicart__card-bodyheading">Artist:</div>
                  <div className="publicart__card-bodytext">{art.artist}</div>
                  <div className="publicart__card-bodyheading">Adress:</div>
                  <div className="publicart__card-bodytext">{art.address}</div>
                  <div className="publicart__card-bodyheading">
                    Description:
                  </div>
                  <div className="publicart__card-bodytext">
                    {art.short_desc}
                  </div>
                </div>
              </div>

              <button onClick={() => handleAddToItinerary(art)}>+ Add</button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default PublicArt
