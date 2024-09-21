let Task = require("../models/task");
let TaskDetails = require("../models/taskDetails");
const excel = require("exceljs");
const XLSX = require("xlsx");
const fs = require("fs");

qqq = async (data) => {
  return await data.map((o, i) => {
    Task.findById(o?.taskId, (err2, data2) => {
      if (err2) res.status(400).send({ err2 })
      return data2;
    })
  });
}

fetchAll = async (req, res, next) => {
  const { email, query, category } = req.body;
  // TaskDetails.find({ email : email, category : category}, async (err,data) => {
  //   if(err) res.status(400).send({ err });
  //       // let jjk = [];
  //       // const promise3 = new Promise((resolve, reject) => { 
  //       //   data.map((o,i) => {
  //       //     Task.findById(o?.taskId, (err2,data2) => {
  //       //       if(err2) res.status(400).send({ err2 })
  //       //       jjk.push(data2);
  //       //       console.log(">>",i);
  //       //       if(i === data.length - 1){
  //       //         console.log("<<",i);
  //       //         setTimeout(()=>{
  //       //           resolve(true);
  //       //         },600)
  //       //       }
  //       //     })
  //       //   });
  //       // });
  //       // Promise.all([promise3]).then((v)=>{
  //       //     console.log( ">>>-jjk-<<<", jjk);
  //       //     // res.send({ data : jjk });
  //       // });
  // });


  //if(query){
  //let mlkk = category !== "" ? category : '';
  //console.log("category >>>>>>",mlkk);

  let queriedTaskData = []

  if (category) {
    queriedTaskData = await queryTasks(email, category, query);
  } else {
    queriedTaskData = await queryTasksWithoutCategory(email, category, query);
  }

  return res.status(200).send({ data: queriedTaskData, message: `Successfully fetched task list${query ? ' on query keyword' : ''}` });
}

const queryTasksWithoutCategory = async (email, category, query) => {
  return Task.aggregate([
    { $match: { email: email, taskname: { $regex: query ? query : '', $options: 'i' } } },
    { $sort: { date: 1 } },
    { $project: { email: 0, __v: 0 } },
  ], (err, tasks) => {
    if (err) res.status(400).send({ err })
    return tasks;
  })
}

const queryTasks = async (email, category, query) => {
  return Task.aggregate([
    { $match: { email: email, category: category, taskname: { $regex: query ? query : '', $options: 'i' } } },
    { $sort: { date: 1 } },
    { $project: { email: 0, __v: 0 } },
  ], (err, tasks) => {
    if (err) res.status(400).send({ err })
    return tasks;
  });
}

search = (req, res, next) => {
  const { email, query } = req.body;
  Task.find({ email: email, taskname: { $regex: '.*' + query + '.*' } }, (err, data) => {
    if (err) res.status(400).send({ err })
    return res.status(200).send({ data: user, message: "Successfully fetched task list" });
  })
}

categorySearch = (req, res, next) => {
  const { email, query } = req.body;
}

add = (req, res, next) => {
  Task.create({ ...req.body, isOver: false }, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.send({ data, message: "Task Created" });
    }
  });
};

edit = async (req, res, next) => {
  const { id, newTaskName } = req.body;
  Task.findByIdAndUpdate(id, { $set: { taskname: newTaskName } }, (err, data) => {
    if (err) res.status(400).send({ err })
    res.status(200).send({ taskname: newTaskName, message: "Task Name edited successfully." })
  })
};

statusToggle = (req, res, next) => {
  const { id, isOver } = req.body;
  Task.findByIdAndUpdate(id, { $set: { isOver: isOver } }, (err, data) => {
    if (err) return res.status(500).send({ err, message: "Error on Status toggled" })
    res.status(200).send({ status: isOver, message: "Status toggled" });
  })
}

// -- used for 'Task info & detail' (when in popup)
infoAndDetail = (req, res, next) => {
  Task.findById(req.params.id, (err, data) => {
    if (err) return res.status(500).send({ err, message: "Error fetching task info" })
    res.status(200).send({ data, message: "Successfully fetched task details" });

    // TaskDetails.findOne({taskId: req.params.id}, (err2, taskDetails) => {
    //   if(err2) return res.status(500).send({ err2, message : "Error fetching task details"})
    //   if(taskDetails) {
    //     res.status(200).send({ data, taskDetails, message : "Successfully fetched task details"});
    //   } else {
    //     res.status(200).send({ data, message : "Successfully fetched task info"});
    //   }
    // });
  });
};

detail = (req, res, next) => {
  TaskDetails.findOne({ taskId: req.params.id }, (err2, taskDetails) => {
    // console.log("Task-details-----",err2, taskDetails)
    if (err2) {
      return res.status(500).send({ err2, message: "Error fetching task details" })
    } else {
      return res.status(200).send({ taskDetails, message: "Successfully fetched task details" });
    }
  });
};

countDocumentsInCollection = (req, res, next) => {
  let countDoc = 0;
  let remainingDocsToInsert = 0;
  Task.countDocuments({ email: req.body.email }, (err, taskCount) => {
    if (err) { res.status(500).send({ err, message: "Task count error" }); }
    else {
      //console.log("count docs",taskCount);
      if (taskCount >= 10) {
        res.status(500).send({ error: true, type: "Task count exceeds", message: "You have run out of tasks. The Task limit for every account is 10. Please delete previous tasks, if you want to create any new." });
      } else {
        res.status(200).send({ message: "Task count lower than limit." });
      }
    }
  });

}

removeImg = (req, res, next) => {
  // console.log("removeImg",req);
  Task.findByIdAndUpdate(req.params.id, { $set: { imagePath: "" } }, (err, task) => {
    if (err) res.status(500).send({ err, message: "Error removing the task image" });
    else res.status(200).send({ task, message: "Task image successfully removed" });
  })
}

detailsSave = (req, res, next) => {
  Task.findById(req.body.id, (err0, data0) => {
    const data_body = JSON.parse(JSON.stringify(req.body));
    if (err0) return res.status(500).send({ err0, message: "Error fetching user" });
    // console.log("data0----------",data0);
    if (data0.email.length) {
      // console.log("detailsSave taskname ---------------",data_body);
      const { taskname, date, dueDate, description, subTasks, isOver, priority, category } = data_body;
      // let isOverBoolean = isOver === 'true' ? true : false;
      // let priorityNum = Number(priority);
      let categoryArr = [];
      categoryArr = category.split(",");
      let subTasksArr = [];
      subTasksArr = subTasks.split(",");

      // console.log("detailsSave ---------------",data_body,isOverBoolean,priorityNum,categoryArr,subTasksArr, imagePath);

      let obj = { taskname, date, dueDate, description, isOver, priority };

      if (req.file) obj = { taskname, date, dueDate, description, isOver, priority, imagePath: req.file.filename };

      if (category !== "") obj.category = categoryArr;
      if (subTasks !== "") obj.subTasks = subTasksArr;

      // if(category === "") delete obj.category;
      // if(subTasks === "") delete obj.subTasks;

      if (category === "") obj.category = [];
      if (subTasks === "") obj.subTasks = [];

      // console.log("Updated - Task - Object",obj);

      Task.findByIdAndUpdate(data0._id, { $set: obj }, (err, data) => {
        // console.log("data0--dd--xx------",data);
        if (err) return res.status(500).send({ err, message: "Error creating Task Details" });
        res.status(200).send({ data, category, message: "Updated Task Details" });
      });

      // TaskDetails.find({ taskId: _id },(err4, data4)=>{
      //     console.log("TaskDetails ---------------",err4,data4);
      //     if(data4 != null && data4.length) {
      //       TaskDetails.findOneAndUpdate({ taskId: _id }, {$set : {category: category, description: description, subTasks: subTasks } }, (err, data) => {
      //         return res.status(200).send({ data, message : "Updated Task Details"});
      //       });
      //     } else {
      //       TaskDetails.create({taskId: _id, description, subTasks, category}, (err2, data2) => {
      //         if(err2) return res.status(500).send({ err2, message : "Error creating Task Details"});
      //         return res.status(200).send({ data2, message : "Created Task Details"});
      //       });
      //     }
      // })

    }
  });
}

taskDelete = (req, res, next) => {
  // console.log("delete route", req.params.id);
  Task.findByIdAndDelete(req.params.id, (error, data) => {
    if (error) {
      res.status(500).json(error);
    } else {
      res.status(200).json(data);
    }
  });
};


// const allTasksFetch = async(email) => {
//   return Task.aggregate([
//     { $match : { email : email }},
//     { $sort : { date : 1}},
//     { $project : { email : 0, __v : 0 }},
//   ], (err, tasks)=>{
//     if(err) res.status(400).send({ err })
//     return tasks;
//   });
// }

downloadTasks = async (req, res, next) => {
  const { email, category, query } = req.body;

  try {
    var taskList = []
    //const taskList = await allTasksFetch(email);
    if (category) {
      taskList = await queryTasks(email, category, query);
    } else {
      taskList = await queryTasksWithoutCategory(email, category, query);
    }

    // console.log("taskList",email, taskList);
    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("data", {
      views: [{ state: "frozen", xSplit: 1, ySplit: 1 }],
    });
    let columnJSON = JSON.parse(JSON.stringify(taskList[0]));

    delete columnJSON._id;
    // delete columnJSON.subTasks;
    // delete columnJSON.imagePath;

    // console.log("columnJSON",columnJSON);

    //var column_name = [];

    //var dataValidationColumns = {};

    ///let columnNameDisplay = DownloadWasteRiskColumnMapping();

    // let colss = Object.keys(jsonObject[0]);
    // let column_count = colss.length;

    // var columnPos = generateExcelColumnNames(column_count);

    worksheet.columns = Object.keys(columnJSON).map((column, index) => {
      return { header: column, key: column, width: 40 };
    });

    worksheet.addRows(taskList);

    ["A1", "B1", "C1", "D1", "E1", "F1", "G1"].forEach(cell => {
      worksheet.getCell(cell).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "ff1e232f" }
      };
      worksheet.getCell(cell).font = {
        bold: true,
        color: { argb: "ffffffff" }
      }
    });

    res.setHeader("Access-Control-Expose-Headers", "Content-Disposition"); //IMPORTANT FOR React.js content-disposition get Name
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=aaa-chart-data.xlsx`);

    return workbook.xlsx.write(res).then(function (workbook_write_res) {
      // console.log("workbook_write_res",workbook_write_res);
      res.end();
    });
  } catch (error) {
    if (req.fileValidationError) {
      res.status(500).send({ message: req.fileValidationError });
    } else {
      res.send({ error: error.message });
    }
  }

  // worksheet.columns = Object.keys(columnJSON).map((column, index) => {
  //   column_name.push({ name : column , pos : columnPos[index]});
  //   return { header: columnNameDisplay[column], key: column, width: 25 };
  // });

}

uploadTasks = async (req, res, next) => {
  try {

    // countDocumentsInCollection(req.body.email)
    // .then((r) => {
    //   console.log("countDoc",r);
    // }).catch((err) => {
    //   console.log("err",err);
    // })

    let countDoc = 0;
    let remainingDocsToInsert = 0;
    countDoc = await Task.countDocuments({ email: req.body.email });

    //console.log("countDoc",countDoc);

    //countDocs.then((results) => {
    const WasteRiskDetailPendingUpdatesModel = Task;
    let fileName = req.file.filename;
    //  console.log("Excel file",fileName);
    // let simulationID = fileName.split("upload_")[1];
    // simulationID = simulationID.replace(".xlsx", "");
    // console.log("Excel file",fileName);
    let workbook = XLSX.readFile(`./public/xlsx/${fileName}`);
    let sheetNames = workbook.SheetNames;

    data = {
      data: XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[0]], { raw: false, defval: "" }),
    };

    if (data.data.length === 0) {
      res.status(422).send({ message: 'Invalid File, please check and upload correct file', error: 'INVALID_FILE' });
      /** Delete Upload Temp File */
      fs.unlink(`public/xlsx/${fileName}`, function (err) {
        if (err) throw err;
        // if no error, file has been deleted successfully
        // console.log("File deleted!","data.data.length === 0");
      });
      //saveTask(uniqueTaskId, 'FG-SLOB', 'upload', 'error', '');
      return;
    }

    data.data.map(s => {
      let isOverBoolean = (/true/).test(s.isOver);
      s.isOver = isOverBoolean;
      s.priority = Number(s.priority);
      s.subTasks = JSON.parse(s.subTasks);
      s.category = JSON.parse(s.category);
      s.email = req.body.email;
    });



    //console.log("data.data --- UPLOADED DATA",data.data);

    remainingDocsToInsert = 10 - countDoc;

    if (remainingDocsToInsert <= 0) res.status(500).send({ message: 'You have run out of Tasks' });
    else {

      let insertManyReq = Task.insertMany(data.data, { limit: remainingDocsToInsert });

      insertManyReq.then((response) => {
        res.status(200).send({ message: "Upload request initiated successfully" });
      }).catch((error) => {
        res.status(500).send({ message: error });
      });

      //console.log("insertMany",jhk)

      fs.unlink(`public/xlsx/${fileName}`, function (err) {
        if (err) throw err;
        // if no error, file has been deleted successfully
        //console.log("File deleted!");
      });
    }



  } catch (err) {
    if (req.fileValidationError) {
      res.status(500).send({ message: req.fileValidationError });
    } else {
      // console.log("Error /uploadTasks ", err);
      res.status(500).send({ message: err });
    }
  }
}

module.exports = { fetchAll, search, add, edit, infoAndDetail, detail, taskDelete, statusToggle, detailsSave, downloadTasks, uploadTasks, removeImg, countDocumentsInCollection };