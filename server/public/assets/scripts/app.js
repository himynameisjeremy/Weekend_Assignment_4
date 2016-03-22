var totalTaskArray = [];

$(document).ready(function() {
  getInfo();
  $('form').on('submit', handleSubmit);
  $('.toDoList').on('click', '.delete', deleteToServer);
  $('.toDoList').on('click', '.complete', completeToServer);
  $('.completedTasks').on('click', '.delete', deleteToServer);
});

function getInfo(){
  $.ajax({
        type: "GET",
        url: "/tasks/",
        success: function(response){
          throwStuffinArray(response);
        }
    });
}

function handleSubmit(event) {
  event.preventDefault();
  var taskArray = $('form').serializeArray();
  var taskData = {};
  $.each(taskArray, function(index, element){
    taskData[element.name] = element.value;
  });
  sendDataToServer(taskData);
  $('form').find('input[type=text]').val("");
}

function sendDataToServer(taskData) {
  $.ajax({
    type: 'POST',
    url: '/tasks',
    data: taskData,
    success: function(response){
      getInfo();
    }
  });
}

function deleteToServer() {
  var id = $(this).data('id');
  console.log("inside deleteToServerFunc after this.data",id);
  var idObject = {"id":id};
  console.log("The idObject is ",idObject);
  $.ajax({
    type: 'DELETE',
    url: '/tasks',
    data: idObject,
    success: function(response){
      console.log("Getting a response? Yes");

    }
  });
  $(this).parent().remove();
}

function completeToServer() {
  var id = $(this).data('id');
  var idObject = {"id":id};
  $.ajax({
    type: 'PUT',
    url: '/tasks',
    data: idObject,
    success: function(response){
      // var data = response;
      // return data;
    }
  });
  // $('.toDoList').text("");
  // $('.completedTasks').text("");

  //Inserting the setTimeout b/c there is a glitch that happens occasionally
  //where it will not communicate fast enough.
  setTimeout( getInfo(), 50);
}

// function complete(){
//   var id = $(this).data('id');
//   var idObject = {"id":id};
//   completeToServer(idObject);
//   getInfo();
// }


// function throwStuffinArray(data){
//   totalTaskArray = [];
//   throwStuffinArray2(data);

// }

function throwStuffinArray(data){
  totalTaskArray = [];
  $('.toDoList').text("");
  $('.completedTasks').text("");
  for(var i = 0; i < data.length; i++){
    totalTaskArray.push(data[i]);
  }
  for(i = 0; i < totalTaskArray.length; i++){
    doTheseThings = totalTaskArray[i];
    if(doTheseThings.status === true){
      $('.completedTasks').append('<div data-id='+""+doTheseThings.id+'>'+'</div>');
      var finList = $('.completedTasks').children().last();
      finList.append('<p>#' + doTheseThings.id + ') NAME: ' + doTheseThings.task_name);
      finList.append('<button class="delete" data-id='+""+doTheseThings.id+'>'+'Delete</button>');
    } else{
      $('.toDoList').append('<div data-id='+""+doTheseThings.id+'>'+'</div>');
      var shortList = $('.toDoList').children().last();
      shortList.append('<p>#' + doTheseThings.id + ') NAME: ' + doTheseThings.task_name);
      shortList.append('<button class="complete" data-id='+""+doTheseThings.id+'>'+'Complete</button>');
      shortList.append('<button class="delete" data-id='+""+doTheseThings.id+'>'+'Delete</button>');
    }
  }
}
