import Drawing from "../modal/Design.mjs";
import "../config/index.mjs";


const saveData = async (req, res) => {
  

  const {lines, pstTime, randomId } = req.body; 
  
    try {
      if ((randomId !== "") && (lines !== "") && (pstTime !== "")) {
        
        const drawing = new Drawing({
          randomId,
          lines,
          pstTime,
        });
  
        await drawing.save();
        res.send("Data added");
      
      } else {
      
        res.send("Data is Empty can't added");
      
      }
    } catch (error) {

      console.error("Error saving  item:", error);
      res.status(500).send("Error saving  item");

    }
  };
  
const updateData = async (req, res) => {
try {
    const id = req.params.randomId;
    const updatedLines = req.body.lines;

    console.log("Data:", updatedLines);
    console.log("ID:", id);

    const result = await Drawing.updateOne({ randomId: id }, { $set: { lines: updatedLines } });

    if (result.modifiedCount === 1) {
    res.status(200).send("Update successful");
    } else {
    res.status(404).send("Data not found");
    }
} catch (error) {
    console.error("Error updating data:", error);
    res.status(500).send("Error updating data");
}
};
  
const getData = async (req, res) => {
    try {
      const { randomId } = req.params;
  
      // Find the drawing by randomId in the database
      const drawing = await Drawing.findOne({ randomId });
  
      if (!drawing) {

        return res.status(404).json({ message: 'Drawing not found' });
      
      }
  
      res.status(200).json(drawing);

    } catch (error) {
     
      console.error('Error while fetching drawing by randomId:', error);
      res.status(500).json({ error: error.message });
    
    }
};

const deleteData = async (req, res) => {

  const id = req.params.id;

  try {
    const result = await Drawing.deleteOne(id);

    if (result.deletedCount === 1) {
      res.send("Data deleted successfully");
    } else {
      res.send("Data not found");
    }
  
  } catch (error) {
  
    console.error("Error deleting todo item:", error);
    res.status(500).send("Error deleting todo item");
  
  }

};


export {saveData , getData , deleteData , updateData};