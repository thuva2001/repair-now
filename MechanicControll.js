import asynchandler from 'express-async-handler';


//Create a new mechanic shop


const createMechanic = asynchandler(async (req, res) => {
    const {ShopName,Location,ShopAddress,ShopNear,ShopType,PhoneNumber,Email,ShopTime} = req.body;
  
    const publicId = req.file.originalname || `shop_${Date.now()}`;
    // Upload image to Cloudinary
    //nedd to be finish later
    const result = await cloudinary.uploader.upload(req.file.path, {
        folder: `needtocreate`,
        public_id: publicId,
    
    });
    //Creates a new mechanic document in MongoDB.
    const mechanic = await Mechanic.create({
        ShopName,Location,ShopAddress,ShopNear,ShopType,PhoneNumber,Email,
        ShopPhoto:{
          public_id: result.public_id,
          url: result.secure_url,
        } 
        ,ShopTime
 });
  
     if (mechanic) {
      res.status(201).json(mechanic);
    } else {
      res.status(400);
      throw new Error('Invalid data');
    }
});


  
  
  //Get all shops mechanics
 
  const getMechanic = asynchandler(async (req, res) => {
    const mechanic = await Mechanic.find({});
    res.json(mechanic);
  });



  //Get all mechanics with ispost true
const gettrueMechanic = asynchandler(async (req, res) => {
  const mechanics = await Mechanic.find({ ispost: true });
  res.json(mechanics);
});
  
  // Get a single shop by ID

  const getMechanicById = asynchandler(async (req, res) => {
    const mechanic = await Mechanic.findById(req.params.id);
  
    if (mechanic) {
      res.json(mechanic);
    } else {
      res.status(404);
      throw new Error('mechanic not found');
    }
  });

  //Update a mechanic by ID


const updateMechanicById = async (req, res) => {
  const { ShopName, Location,ShopAddress,ShopNear, ShopType, PhoneNumber, Email, ShopTime, ispost } = req.body;

  try {
    const mechanic = await Mechanic.findById(req.params.id);

    if (mechanic) {
      mechanic.ShopName = ShopName || mechanic.ShopName;
      mechanic.Location = Location || mechanic.Location;
      mechanic.ShopAddress = ShopAddress || mechanic.ShopAddress;
      mechanic.ShopNear = ShopNear || mechanic.ShopNear;
      mechanic.ShopType = ShopType || mechanic.ShopType;
      mechanic.PhoneNumber = PhoneNumber || mechanic.PhoneNumber;
      mechanic.Email = Email || mechanic.Email;
      mechanic.ShopTime = ShopTime || mechanic.ShopTime;
      mechanic.ispost = ispost !== undefined ? ispost : mechanic.ispost; // Update ispost if provided

      const updatedMechanic = await mechanic.save();
      res.json(updatedMechanic);
    } else {
      res.status(404).json({ message: 'Shop not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
  
  
  
  
  //Delete mechanic by ID
  
  const deleteMechanicById = asynchandler(async (req, res) => {
   const {id} =req.params;
   
    try  {
      const mechanicdelete= await Mechanic.findOneAndDelete(id)
      res.json({ message: 'mechanic removed',mechanicdelete });
    } catch {
      res.status(404);
      throw new Error('mechanic not found');
    }
  
  
  });

  
  export { createMechanic ,getMechanic,getMechanicById,updateMechanicById,deleteMechanicById,gettrueMechanic,};