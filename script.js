"use strict";

let selectedFile, prevFile;
let input = document.getElementById("input");
let btn = document.getElementById("button");
let jsondata = document.getElementById("jsondata");
let table = document.getElementById("data-table");
let searchInput = document.getElementById("search-input");
let dataArray = [
  { Name: "Elon Musk", "Register Number": "2101CA20110", python: 85 },
  { Name: "Jeff Bezos", "Register Number": "2101CA20113", python: 87 },
  { Name: "Tony Stark", "Register Number": "2101CA20114", python: 89 },
];

const getGrade = (mark) => {
  if (mark >= 91) return "S";
  else if (mark >= 81) return "A+";
  else if (mark >= 71) return "A";
  else if (mark >= 66) return "B+";
  else if (mark >= 61) return "B";
  else if (mark >= 56) return "C";
  else if (mark >= 50) return "D";
  else return "F";
};

const updateTable = (data) => {
  table.innerHTML = ``;
  //create header tag
  let headerTag = `<thead><tr class="heading">`;
  let headingArr = [];
  let obj1 = data[0];
  Object.keys(obj1).forEach((headings) => {
    let heading = headings;
    if (!isNaN(headings.slice(-1))) heading = headings.slice(0, -2);
    headerTag += `<th>${heading}</th>`;
    headingArr.push(heading);
  });
  headerTag += `</tr></thead>`;
  table.insertAdjacentHTML("afterbegin", headerTag);

  for (let obj of data) {
    // console.log(obj);
    //dataArray.push(obj);
    let i = 0;
    let row = `<tbody><tr>`;
    Object.values(obj).forEach((studentData) => {
      if (isNaN(+studentData) || obj["SGPA"] == studentData)
        row += `<td data-label="${headingArr[i]}">${studentData}</td>`;
      else
        row += `<td data-label="${headingArr[i]}">${getGrade(
          +studentData
        )}</td>`;
      i++;
    });
    row += `</tr></tbody>`;
    table.insertAdjacentHTML("beforeend", row);
  }
};

//---------------------------------------------------------
const updateCGPA = (json) => {
  const arrayOfData = JSON.parse(json);
  let credits = [],
    creditSum = 0;
  let subjectTitles = Object.keys(arrayOfData[0]);
  //extracting credits of each subject in seperate array
  subjectTitles.forEach((sub) => {
    if (sub.slice(-1) in ["1", "2", "3", "4", "5", "6"]) {
      creditSum += parseInt(sub.slice(-1));
      credits.push(parseInt(sub.slice(-1)));
    }
  });
  // console.log(credits);

  //loop each object and update it with sgpa
  arrayOfData.forEach((obj) => {
    let i = 0;
    let sum = 0;
    // console.log("cool");
    Object.values(obj).forEach((sub) => {
      if (!isNaN(sub * 1)) {
        sum += sub * credits[i];
        i++;
      }
    });
    obj.SGPA = sum / (creditSum * 10); // multiply 10 to make it scale of 10
    // console.log(sum, obj);
  });
  dataArray = arrayOfData;
  updateTable(arrayOfData);

  // jsondata.innerHTML = JSON.stringify(arrayOfData, undefined, 4);
};

//------------------------EVENT LISTENERS-----------------
input.addEventListener("change", (event) => {
  selectedFile = event.target.files[0];
});

btn.addEventListener("click", () => {
  if (selectedFile && selectedFile != prevFile) {
    table.innerHTML = "";
    let fileReader = new FileReader();
    fileReader.readAsBinaryString(selectedFile);
    fileReader.onload = (event) => {
      let data = event.target.result;
      let workbook = XLSX.read(data, { type: "binary" });
      workbook.SheetNames.forEach((sheet) => {
        let rowObject = XLSX.utils.sheet_to_row_object_array(
          workbook.Sheets[sheet]
        );
        let arrOfObj = JSON.stringify(rowObject, undefined, 4);
        updateCGPA(arrOfObj);
        prevFile = selectedFile;
      });
    };
  }
});

searchInput.addEventListener("keyup", (event) => {
  let value = event.target.value.toLowerCase();
  //console.log(value);

  value = value.toLowerCase();

  let filteredData = dataArray.filter((obj) => {
    if (obj.Name.toLowerCase().includes(value)) return obj;
  });
  //console.log(filteredData);

  updateTable(filteredData);
});
