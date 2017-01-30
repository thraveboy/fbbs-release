var fbbsGlobalCharInstance = null;

function FBBSDataDraw (ctx, title = "", type = "value_label") {
  this.ctx = ctx;
  this.title = title;
  this.type = type;
  this.xaxis_type = "category";
  this.chart_type = "line";
  this.label_type = "descent";
  this.chart_border_color = "rgba(200,0,100,0.9)";
  this.chart_fill_color = "rgba(150,20,200,0.6)";

  this.ctx.width = 640;
  this.ctx.height = 480;

  var chart_elem = document.getElementById("dashChart");
  var chart_x_max = chart_elem.width;

  var gradient = chart_elem.getContext("2d").createLinearGradient(0,0, 
                                                                  chart_x_max,
                                                                  0);
  gradient.addColorStop("1.0","white");
  gradient.addColorStop("0.5","blue");
  gradient.addColorStop("0.25","cyan");
  gradient.addColorStop("0.15","yellow");
  gradient.addColorStop("0.0","white");

  var gradient2 = chart_elem.getContext("2d").createLinearGradient(0,0, 
                                                                   chart_x_max,
                                                                   0);
  gradient2.addColorStop("1.0","rgba(250,250,250,0.6)");
  gradient2.addColorStop("0.5","rgba(0,0,250,0.15)");
  gradient2.addColorStop("0.25","rgba(0,250,250,0.2)");
  gradient2.addColorStop("0.15", "rgba(250,250,0,0.2)");
  gradient2.addColorStop("0.0","rgba(250,250,250,0.5)");

  this.chart_fill_color= "rgba(100,25,225,0.6)";
  this.label_text_color = gradient;
  this.label_line_color = gradient2;

  this.processDataDraw = processDataDraw;
  this.generateDataObj = generateTimeValueDataObj;
  if (type == "value_time") {
    this.generateDataObj = generateValueTimeDataObj;
    this.xaxis_type = "time";
    this.label_type = "point";
  }
  if (type == "prev_timediff_60min") {
    this.generateDataObj = generatePrevTimeDiff60MinDataObj;
    this.xaxis_type = "category";
    this.label_type = "descent";
  }
}

function generateTimeValueDataObj (keyval_obj) {
  var current_time = new Date().getTime();
  var return_obj = { 
      data: "", 
      label: "", 
      html: "",
      min_timestamp: current_time,
      max_timestamp: current_time
  };
  var entry_obj = new Object();
 
  Object.keys(keyval_obj).forEach(function(key,index) {
    Object.keys(keyval_obj).forEach(function(id,idx) {
        entry_obj[id] = keyval_obj[id];
       });
    });
  var new_id = msgId(entry_obj);
  var new_value = msgValue(entry_obj).trim();
  var new_timestamp = msgTimestamp(entry_obj);
  return_obj.label = new_value;
  var timestamp_to_milli = parseInt(new_timestamp,10)*1000;
  if (timestamp_to_milli < return_obj.min_timestamp)
    return_obj.min_timestamp = timestamp_to_milli;
  if (timestamp_to_milli > return_obj.max_timestamp)
    return_obj.max_timestamp = timestamp_to_milli;
  return_obj.data = {x:  new_timestamp*1000, y: -new_value.length};
  var entry_time = parseInt(msgTimestamp(entry_obj));
  var timestamp_diff = (timestamp_to_milli - current_time);
  var new_timediff = Math.abs(Math.round(timestamp_diff/6000)/10);
  return_obj.html = "|@" + new_id + "|minsago(" + new_timediff + ")-=> " +
                    new_value + "<br>";
  return_obj.label = new_value + "|minsago(" + new_timediff +")";
  return return_obj;
}

function generateValueTimeDataObj (keyval_obj) {
  var current_time = new Date().getTime();
  var return_obj = { 
      data: "", 
      label: "", 
      html: "",
      min_timestamp: current_time,
      max_timestamp: current_time
  };
  var entry_obj = new Object();
 
  Object.keys(keyval_obj).forEach(function(key,index) {
    Object.keys(keyval_obj).forEach(function(id,idx) {
        entry_obj[id] = keyval_obj[id];
       });
    });
  var new_id = msgId(entry_obj);
  var new_value = msgValue(entry_obj).trim();

  var splitted_new = new_value.split(" ");
  var new_timestamp = "";
  if ((splitted_new != undefined) && (splitted_new[0] != undefined)) {
    new_timestamp = moment(splitted_new[0]).unix();
  } 
  else {
    new_timestamp = msgTimestamp(entry_obj);
  }
  return_obj.label = new_value;
  var timestamp_to_milli = parseInt(new_timestamp,10)*1000;
  if (timestamp_to_milli < return_obj.min_timestamp)
    return_obj.min_timestamp = timestamp_to_milli;
  if (timestamp_to_milli > return_obj.max_timestamp)
    return_obj.max_timestamp = timestamp_to_milli;
  return_obj.data = {x:  new_timestamp*1000, y: new_value.length};
  var entry_time = parseInt(msgTimestamp(entry_obj));
  var timestamp_diff = (timestamp_to_milli - current_time);
  var new_timediff = Math.abs(Math.round(timestamp_diff/6000)/10);
  return_obj.html = "|@" + new_id + "|ts(" + new_timestamp*1000 + ")-=> " +
                    new_value + "<br>";
  return_obj.label = new_value;
  return return_obj;
}

function generateValueLabelDataObj (keyval_obj) {
  var current_time = new Date().getTime();
  var return_obj = { 
      data: "", 
      label: "", 
      html: "",
      min_timestamp: current_time,
      max_timestamp: current_time
  };
  var entry_obj = new Object();
 
  Object.keys(keyval_obj).forEach(function(key,index) {
    Object.keys(keyval_obj).forEach(function(id,idx) {
        entry_obj[id] = keyval_obj[id];
       });
    });
  var new_id = msgId(entry_obj);
  var new_value = msgValue(entry_obj).trim();
  var new_timestamp = msgTimestamp(entry_obj);
  return_obj.label = new_value;
  var timestamp_to_milli = parseInt(new_timestamp,10)*1000;
  if (timestamp_to_milli < return_obj.min_timestamp)
    return_obj.min_timestamp = timestamp_to_milli;
  if (timestamp_to_milli > return_obj.max_timestamp)
    return_obj.max_timestamp = timestamp_to_milli;
  return_obj.data = new_value.length;
  var entry_time = parseInt(msgTimestamp(entry_obj));
  var timestamp_diff = (timestamp_to_milli - current_time);
  var new_timediff = Math.abs(Math.round(timestamp_diff/6000)/10);
  return_obj.html = "|@" + new_id + "|minsago=" + new_timediff + ")-=> " +
                    new_value + "<br>";
  return return_obj;
}

function generatePrevTimeDiff60MinDataObj( keyval_obj) {
  var current_time = new Date().getTime();
  var return_obj = { 
      data: "", 
      label: "", 
      html: "",
      min_timestamp: current_time,
      max_timestamp: current_time
  };
  var entry_obj = new Object();
 
  Object.keys(keyval_obj).forEach(function(key,index) {
    Object.keys(keyval_obj).forEach(function(id,idx) {
        entry_obj[id] = keyval_obj[id];
       });
    });
  var new_id = msgId(entry_obj);
  var new_value = msgValue(entry_obj).trim();
  var new_timestamp = msgTimestamp(entry_obj);
  return_obj.label = new_value;
  var timestamp_to_milli = parseInt(new_timestamp,10)*1000;
  if (timestamp_to_milli < return_obj.min_timestamp)
    return_obj.min_timestamp = timestamp_to_milli;
  if (timestamp_to_milli > return_obj.max_timestamp)
    return_obj.max_timestamp = timestamp_to_milli;
  var entry_time = parseInt(msgTimestamp(entry_obj));
  var timestamp_diff = (timestamp_to_milli - current_time);
  var new_timediff = Math.abs((Math.round(timestamp_diff/6000))/10);
  return_obj.data = (6000 - (new_timediff*100)) + new_value.length;
  return_obj.html = "|@" + new_id + "|minsago=" + new_timediff + ")-=> " +
                    new_value + "<br>";
  return return_obj;
}



function processDataDraw( input_json ) {
  var data_array = [];
  var label_array = [];
  var dashHtml = "";
  var min_timestamp = new Date().getTime();
  var max_timestamp = min_timestamp;
  var current_time = min_timestamp/1000;
  var previous_time = current_time;

  try {
    var jsonresponseparsed = JSON.parse(input_json);
  } catch(err) {
    return;
  }

  if ((jsonresponseparsed == undefined) ||
      (jsonresponseparsed.value == undefined) ||
      (jsonresponseparsed.value[0] == undefined)) return;

  var jsonresponseobj = jsonresponseparsed.value[0];

  var dataProcessor = this.generateDataObj;
  Object.keys(jsonresponseobj).forEach(function(key,index) {
    var array_obj = jsonresponseobj[key];
    var raw_obj = {}
    array_obj.forEach(function addObj (var_obj) { 
        Object.keys(var_obj).forEach(function(vkey,vindex) {
            raw_obj[vkey] = var_obj[vkey];
          });
      });
    var data_obj = dataProcessor(raw_obj);
    data_array.push(data_obj.data);
    label_array.push(data_obj.label);
    dashHtml += data_obj.html;
    if (data_obj.min_timestamp < min_timestamp) {
      min_timestamp = data_obj.min_timestamp;
    }
    if (data_obj.min_timestamp > max_timestamp) {
      max_timestamp = data_obj.max_timestamp;
    }
   });

   var min_moment = moment(min_timestamp);
   var max_moment = moment(max_timestamp);

   var dataStruct = {
     labels: label_array,
     datasets: [
       {
         type: this.chart_type,
         label: this.title,
         data : data_array,
         fill: true,
         fillColor: "rgba(0,0,125,0.5)",
         borderColor: this.chart_border_color,
         backgroundColor: this.chart_fill_color,
         pointStyle: "rectRot",
         pointRadius: 5,
         pointBackgroundColor: "rgba(40,200,170,0.9)",
         borderWidth: 2
       }
     ]};

  var label_text_color = this.label_text_color;
  var label_line_color = this.label_line_color;
  var label_type = this.label_type;
  var xaxis_type = this.xaxis_type;
  var chart_options = {
           responsive: false,
           maintainAspectRatio: true,
           animation: {
               duration: 10,
               onComplete: function () {
                   var ctx = this.chart.ctx;
                   ctx.font = "monospace",
                   ctx.fillStyle = "rgba(200, 220, 20, 0.6)";
                   ctx.strokeColor = "rgba(200,220, 20, 0.9)";
                   var chart_elem = document.getElementById("dashChart");
                   var chart_x_max = chart_elem.width;
                   var chart_y_max = chart_elem.height;
                   var current_data;
                   var current_color = "rgb(0,0,0)";
                   var clean_x_div = 1.0;
                   var clean_y_div = 1.0;
                   this.data.datasets.forEach(function (dataset) {
                       var current_x = 0;
                       var current_y = 0;
                       ctx.fillStyle=label_text_color;
                       ctx.strokeStyle="rgba(255,255,255,0.3)";
                       var text_wid_pix = 0;
                       var text_height_pix = 0;
                       var prev_x = 0;
                       var prev_y = 0;
                       var prev_point_y = 0;
                       var prev_point_x = 0;
                       Object.keys(dataset._meta).forEach(function (key,idx) {
                           var j=0;
                           ctx.font = "8pt monospace";
                           dataset._meta[key].data.forEach(function (p_obj) {
                               current_y = Math.max(p_obj._model.y,
                                                    25);
                               if (label_type == "descent") {
                                 current_y = (chart_y_max)  - 
                                             (chart_y_max - ((j+2) * 25));
                               }
                               text_wid_pix = ctx.measureText(label_array[j]);
                               current_x = p_obj._model.x;
                               current_x = Math.min(current_x,
                                   chart_x_max-(text_wid_pix.width));

                               ctx.beginPath();
                               ctx.moveTo(prev_x, prev_y);
                               ctx.lineTo(p_obj._model.x + 1,
                                          p_obj._model.y * 2);
                               ctx.strokeStyle=label_line_color;
                               ctx.stroke();
                               ctx.moveTo(prev_point_x, prev_point_y);
                               ctx.lineTo(p_obj._model.x,
                                          p_obj._model.y);
                               ctx.stroke();
                               ctx.moveTo(p_obj._model.x, p_obj._model.y);
                               ctx.lineTo(prev_x, prev_y);
                               ctx.stroke();

                               ctx.fillStyle="rgba(3,13,29,0.81)";
                               ctx.fillRect(current_x+10, current_y-15,
                                            25+text_wid_pix.width, 21);
                               ctx.strokeStyle="rgba(150,250,50,0.2)";
                               ctx.rect(current_x+5, current_y-15,
                                        25+text_wid_pix.width, 16);
                               ctx.stroke();

                               ctx.fillStyle=label_text_color;
                               ctx.fillRect(p_obj._model.x, p_obj._model.y,
                                            1,
                                            Math.abs(p_obj._model.y));
                               ctx.fillStyle=label_text_color;
                               ctx.fillText(label_array[j],
                                            current_x+10, current_y-15);
                               prev_x = p_obj._model.x + 1;
                               prev_y = p_obj._model.y * 2;
                               prev_point_x = p_obj._model.x;
                               prev_point_y = p_obj._model.y;
                               j++;
                             });
                         });
                       });
                     }
                   },
               legend: {
                   display: true,
                   position: 'top',
                   labels: {
                       showScaleLabels: true,
                       usePointStyle: true,
                       fontColor: "rgba(190,250,220,0.9)",
                       fontStyle: "bold"
                     },
                   reverse: false
                 },
               scales: {
                  xAxes: [{
                      type: xaxis_type,
                      time: {
                          max: max_moment,
                          min: min_moment
                      },
                      display: false,
                      gridLines: {
                          display: false,
                          offsetGridLines: true
                        },
                      position: "bottom",
                      ticks: {
                        fontSize: 12,
                        fontColor: "rgba(0,250,0,0.9)",
                        fontFamily: "monospace",
                        mirror: false,
                        display: false
                      }
                  }],
                  yAxes: [{
                    display: false,
                    position: "right",
                    gridLines: {
                        display: false,
                        lineWidth: 3,
                      },
                    ticks: {
                      fontColor: "rgba(50,50,0,0.3)",
                      fontFamily: "monospace"
                    },
                  }]
                }
              };

 
  var old_graph = null; 
  if (fbbsGlobalCharInstance != null) {
    old_graph = fbbsGlobalCharInstance;
    old_graph.destroy();
    old_graph = null;
  }
  var new_graph =  new Chart(this.ctx, {
      type: "bar",
      data: dataStruct,
      labels: label_array,
      options: chart_options
    });
  fbbsGlobalCharInstance = new_graph;

  document.getElementById("dash").innerHTML = dashHtml;
}

function msgId(msgObj) {
  var return_html = "";
  if (msgObj) {
    if (msgObj["id"] !=  undefined) {
      return_html += msgObj["id"];
    }
  }
  return return_html;
}

function msgIP(msgObj) {
  var return_html = "";
  if (msgObj) {
    if (msgObj["ip"] !=  undefined) {
      return_html += msgObj["ip"];
    }
  }
  return return_html;
}

function msgValue(msgObj) {
  var return_html = "";
  if (msgObj) {
    if (msgObj["value"] !=  undefined) {
      return_html += msgObj["value"];
    }
  }
  return return_html;
}

function msgTimestamp(msgObj) {
  var return_html = "";

  if (msgObj) {
    if (msgObj["timestamp"] !=  undefined) {
     return_html += msgObj["timestamp"];
    }
  }
  return return_html ;
}
