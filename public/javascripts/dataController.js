    // #TODO Refresh automatically every second
    // ### This should't be here

    let timeNowSpan = document.getElementById('timeNow');
    let timeNow = moment().format('LTS');
    timeNowSpan.innerHTML = `${timeNow}`;

    setInterval(() => {
        timeNow = moment().format('LTS');
        timeNowSpan.innerHTML = `${timeNow}`;
    }, 1000);

// Obtain Data from Database
function obtain_data() {
    fetch('/api')
        .then(response => {
            return response.json()
        })
        .then(data => {
            create_table(data);
            suggest_id(data)
        })
}

//suggest ID 
function suggest_id(data){
    let inputid = document.getElementById('inputID');
    let lastId = data[data.length - 1].id;
    inputid.value = lastId + 1;
}

// Create dynamic Table function
// And other stuff
function create_table(data) {

    let thead = document.getElementById('tableHead');
    let headerContent = '';
    let tbody = document.getElementById('tableBody');
    let bodyContent = '';
    let dataCount = data.length;
    let lastTaskEnd =  timeNow;
    let sumTimeDiv = document.getElementById('sumTime');
    let sumTime = 0;
    let taskDone = false;

    // This loops creates the Header for the html table
    // With the props from the json data
    for (var prop in data[0]) {
        headerContent += `<th>${prop}</th>`
    }
    thead.innerHTML =headerContent +  '<th>End Time</th>' ;

    //This loop fills the content of the html table
    //we need to use Object.values because our Items inside
    //the json are Objects
    for (let index = 0; index < dataCount; index++) {
        let rowClass = '';
        if(data[index].finished){
            rowClass = 'done';
            taskDone = true;
        } else {
            // Calculates the end of the current task if it isn't marked as done
            //lastTaskEnd = lastTaskEnd.add(data[index].time, 'minutes').calendar();
            let minutes = data[index].time;
            sumTime += data[index].time;
            lastTaskEnd = moment(lastTaskEnd, 'hh:mm A')
                            .add(minutes, 'minutes')
                            .format('LT');
            taskDone = false;
        }   

        bodyContent += `<tr class="${rowClass}" onclick=check_todo(${data[index].id})>`
        Object.values(data[index]).forEach(element => {
            bodyContent += `<td>${element}</td>`
        });
        if(taskDone){
            bodyContent += `<td>---</td>`
        } else {
            bodyContent += `<td>${lastTaskEnd}</td>`
        }
   
        bodyContent += '</tr>'
    }
        tbody.innerHTML = bodyContent;    

    console.log("The time is", sumTime);
    sumTimeDiv.innerHTML = `Time left: ${sumTime} Minutes`;

    document.getElementById('placeHolderButtonDelete')
    .innerHTML = `<input class="button" onclick=delete_data() type="submit" value="Delete Finished"></input>`
    
}

// TODO Function 
function check_todo(id){
    data = {id: id}

    fetch('/api/done', {
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
            'Content-Type': 'application/json'
        }
    })
    obtain_data()
}

// Delete Function
function delete_data() {
    console.log('Trying to delete ');
  
    fetch('/api/delete',{
        method: 'POST'
    })
    obtain_data()
}

obtain_data();