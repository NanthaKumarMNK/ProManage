const ProManage = require("../models/proManage");
const User = require("../models/auth");
const proManage = require("../models/proManage");

const postCreateList = async (req, res, next) => {
  try {
    const formData = req.body;
    const userId = req.userId;

     function checkAllValues(obj) {
      const { users, ...rest } = obj;
      for (let key in rest) {
        if (typeof rest[key] === 'object' && rest[key] !== null) {
          if (!checkAllValues(rest[key])) {
            return false;
          }
        } else {
          if (!rest[key] && key !== 'users') {
            return false;
          }
        }
      }
      return true;
    }
    
    const allKeysFilled = checkAllValues(formData);
    if (!allKeysFilled ) {
      return res.status(400).json({ errormessage: "Invalid List" });
    }
    if (!formData.priority || !formData.title || !formData.date || !formData.list || !formData.checkList){
      return res.status(400).json({ errormessage: "Invalid List" });
    }
    

      if (Object.keys(formData.list).length < 1) {
        return res.status(400).json({ errormessage: "Invalid list number" });
      }
      
      if (Object.keys(formData.list).length !== Object.keys(formData.checkList).length) {
        return res.status(400).json({ errormessage: "Invalid check list number" });
      }

      const email= await User.findById(userId)
      if (!email){
        return res.status(400).json({ errormessage: "Invalid user" });
      }
      if (formData.users.length===0 ||formData.users.length>2){
        return res.status(400).json({ errormessage: "Invalid number of assigned users" });
      }
      

    const listData = new ProManage({
      userId:userId,
    priority:formData.priority,
    title:formData.title,
    users:formData.users,
    status: "To do",
    date: formData.date,
    list: formData.list,
    checkList: formData.checkList
    });

    await listData.save();

    res.json({ message: "List Created Successfully" });
  } catch (error) {
    next(error);
  }
};

const putEditList = async (req, res, next) => {
  try {
    let listId = req.params.listId.replace(":", "");
    const formData = req.body;
    
    function checkAllValues(obj) {
      const { users, ...rest } = obj;
      for (let key in rest) {
        if (typeof rest[key] === 'object' && rest[key] !== null) {
          if (!checkAllValues(rest[key])) {
            return false;
          }
        } else {
          if (!rest[key] && key !== 'users') {
            return false;
          }
        }
      }
      return true;
    }
    
    const allKeysFilled = checkAllValues(formData);
    if (!allKeysFilled ) {
      return res.status(400).json({ errormessage: "Invalid List" });
    }
    if (!formData.priority || !formData.title || !formData.status || !formData.date || !formData.list || !formData.checkList){
      return res.status(400).json({ message: "Invalid List" });
    }
    

      if (Object.keys(formData.list).length < 1) {
        return res.status(400).json({ message: "Invalid list number" });
      }
      
      if (Object.keys(formData.list).length !== Object.keys(formData.checkList).length) {
        return res.status(400).json({ message: "Invalid check list number" });
      }
      if (formData.users.length===0 ||formData.users.length>2){
        return res.status(400).json({ errormessage: "Invalid number of assigned users" });
      }
     
    const updatedList = await ProManage.findByIdAndUpdate(listId, formData, {
      new: true,
    });

    if (!updatedList) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json({ message: "List updated successfully" });
  } catch (error) {
    next(error);
  }
};


const deleteList = async (req, res, next) => {
  try {
    const listId = req.params.listId;

    const deletedQuiz = await ProManage.findByIdAndDelete(listId);

    if (!deletedQuiz) {
      return res.status(404).json({ message: "List not found" });
    }

    return res.json({ message: "List deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const putList = async (req, res, next) => {
  try {
    const listId = req.params.listId;
    const formData = req.body;
    const listDetails = await ProManage.findById(listId);
    if (!listDetails){
      return res.status(400).json({message:"List not found"})
    }
  
    let updateQuery;
    if (formData.checkList) {
      updateQuery = { checkList: { ...listDetails.checkList, ...formData.checkList } };
    } else {
      updateQuery = { status: formData.status };
    }
    const updatedList = await ProManage.findByIdAndUpdate(listId, updateQuery, { new: true });

    if (!updatedList) {
      return res.status(404).json({ message: "List not found" });
    }

    return res.json({ updated: "List updated successfully",updatedList });
  } catch (error) {
    next(error);
  }
};


const getList = async (req, res, next) => {
  try {
    const listId = req.params.listId;
    if (!listId){
      return res.status(404).json({ errormessage: "Invalid List Id" });
    }

    const listDetails = await ProManage.findById(listId, {
      list: 1,
      title: 1,
      priority:1,
      date:1,
      _id: 0,
      checkList:1,
      status:1
    });

    if (!listDetails) {
      return res.status(404).json({ errormessage : "List not created" });
    }
    res.json(listDetails);
  } catch (error) {
    next(error);
  }
};

const getAllList = async (req, res, next) => {
  try {
    const myEmail = req.params.myEmail;
    const {date,status} = req.query
    const currentDate = new Date();
    const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
    if (!myEmail){
      res.status(400).json({message:"Invalid Email"})
    }
    let query = {
      users: myEmail,
      status:status
    };
    if (date === 'Today') {
      query.createdAt = { $gte: startOfDay, $lt: new Date() };
    } else if (date === 'Week') {
      const Week = new Date(currentDate);
      Week.setDate(currentDate.getDate() - 7);
      query.createdAt = { $gte: Week, $lt: new Date() };
    } else if (date === 'Month') {
      const Month = new Date(currentDate);
      Month.setDate(currentDate.getDate() - 30);
      query.createdAt = { $gte: Month, $lt: new Date() };
    }
    const listDetails = await ProManage.find(query);
    if (!listDetails || listDetails.length === 0) {
      return res.status(200).json({ response: "No task" });
    }
    res.json(listDetails);
  } catch (error) {
    next(error);
  }
};


const getAnalytics=async(req,res,next)=>{
  try {
    const allData=await ProManage.find({}, {priority:1, status:1,_id:0})
    if(!allData){
      return res.status(400).json({message:"No data created"})
    }
    const statusCounts = {
     
      Low: 0,
      Moderate: 0,
      High: 0,
        Due:0,
    Backlog: 0,
    'To do': 0,
    'In Progress': 0,
    Done: 0
    };

    allData.forEach(task => {
      if (statusCounts.hasOwnProperty(task.status)) {
        statusCounts[task.status]++;
      }
      if (statusCounts.hasOwnProperty(task.priority)) {
        statusCounts[task.priority]++;
      }
    });
    statusCounts.Due=statusCounts.Backlog+statusCounts["To do"]+statusCounts["In Progress"]
    res.status(200).json(statusCounts)

  } catch (error) {
    next(error);
  }
}


module.exports = {
  postCreateList,
  putEditList,
  putList,
  deleteList,
  getList,
  getAllList,
  getAnalytics
};
