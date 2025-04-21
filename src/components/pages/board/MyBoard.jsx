import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { postBoardColumn, getBoardColumns, updateBoardColumns } from '../../utils/Api'
import ShareBoardModal from '../../common/modals/ShareBoardModal'
import { X, Link as LinkIcon, Search } from 'lucide-react'

const MyBoard = () => {
  const { id } = useParams()
  const [columns, setColumns] = useState([])
  const [loading, setLoading] = useState(true)
  const [addingList, setAddingList] = useState(false)
  const [newListTitle, setNewListTitle] = useState("")
  const [modal, setModal] = useState(false)

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const response = await getBoardColumns(id)
        // Make sure columns are sorted by position if your API doesn't already do this
        const sortedColumns = response.data.sort((a, b) => a.position - b.position)
        setColumns(sortedColumns)
      } catch (error) {
        console.error("Error fetching board columns:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchColumns()
  }, [id])

  const handleModal = () => {
    setModal(true)
  }

  const closeModal = () => {
    setModal(false)
  }

  const handleDragEnd = async (result) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result

    if (source.index === destination.index) return

    // Create a copy of the columns array
    const items = Array.from(columns)
    const [reorderedItem] = items.splice(source.index, 1)
    items.splice(destination.index, 0, reorderedItem)

    // Update the position property for all affected columns
    const updatedItems = items.map((item, index) => ({
      ...item,
      position: index
    }))

    // Update state with the new positions
    setColumns(updatedItems)

    try {
      // Update the position of the dragged column
      await updateBoardColumns({
        boardId: id,
        columnId: draggableId,
        newPosition: destination.index,
        // You might need to include all column positions if your API supports batch updates
        allColumns: updatedItems.map((col, idx) => ({ id: col._id, position: idx }))
      })
      
      console.log("Column position updated successfully!")
    } catch (error) {
      console.error("Error updating column position:", error)
      // Revert to original state if the API call fails
      fetchColumns()
    }
  }

  const handleAddList = async (e) => {
    e.preventDefault()
    if (newListTitle.trim() === "") return

    try {
      // When adding a new column, set its position to be at the end
      const position = columns.length
      const response = await postBoardColumn({ 
        boardId: id, 
        title: newListTitle,
        position: position // Make sure your API accepts and stores this position value
      })
      
      setColumns([...columns, response.data])
      setNewListTitle("")
      setAddingList(false)
    } catch (error) {
      console.error("Error creating column:", error)
    }
  }

  return (
    <div 
      className="p-6 h-screen bg-cover bg-center overflow-x-auto" 
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1470&q=80')" }}
    >
      <div className="flex justify-between mb-6">
        <h2 className="text-3xl font-bold text-white drop-shadow-lg">My Trello Board</h2>
        <button 
          onClick={handleModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-lg"
        >
          Share Board
        </button>
      </div>

      {loading ? (
        <p className="text-white">Loading columns...</p>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="columns" direction="horizontal" type="column">
            {(provided) => (
              <div 
                {...provided.droppableProps} 
                ref={provided.innerRef}
                className="flex gap-6"
              >
                {columns.map((col, index) => (
                  <Draggable key={col._id} draggableId={col._id} index={index}>
                    {(provided) => (
                      <div 
                        ref={provided.innerRef} 
                        {...provided.draggableProps} 
                        {...provided.dragHandleProps}
                        className="bg-white/90 p-4 rounded-lg shadow-lg min-w-[250px] max-w-[250px] flex flex-col"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-semibold text-lg truncate">{col.title}</h3>
                          <button className="text-gray-400 hover:text-gray-600">
                            ⋮
                          </button>
                        </div>
                        <div className="flex-grow">
                          <p className="text-sm text-gray-500">+ Add a card</p>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}

                {/* Add another list */}
                <div className="min-w-[250px] max-w-[250px] p-4 bg-white/50 rounded-lg flex flex-col shadow-lg">
                  {addingList ? (
                    <form onSubmit={handleAddList} className="flex flex-col gap-3">
                      <input
                        type="text"
                        placeholder="Enter list title..."
                        value={newListTitle}
                        onChange={(e) => setNewListTitle(e.target.value)}
                        className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button 
                          type="submit"
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                        >
                          Add List
                        </button>
                        <button 
                          type="button"
                          onClick={() => {
                            setAddingList(false)
                            setNewListTitle("")
                          }}
                          className="text-gray-700 hover:text-black text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      onClick={() => setAddingList(true)}
                      className="text-gray-800 hover:text-black font-medium text-left"
                    >
                      + Add another list
                    </button>
                  )}
                </div>

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
      
      {modal && (
        <ShareBoardModal onClose={closeModal} boardId={id} />
      )}
    </div>
  )
}

export default MyBoard