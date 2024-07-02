const mongoose = require("mongoose");

const proManageSchema = new mongoose.Schema(
  {  
    userId:{
    type: String,
    required: true,
  },
    priority: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    users:{
      type :Array,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },

    date: {
      type: String,
      required: true,
    },
    list: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    checkList: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  }, { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);


module.exports = mongoose.model("proManage", proManageSchema);
