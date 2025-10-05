function isEmpty(value){
    if(value === null || value === undefined || value.trim() === ''){
        return true
    }else{
        return false
    }
}

function std_time(date,time){
    return new Date(date+time)
}

function load_brand(){
    axios.post('/brand').then(res=>{
        res.data.brands.forEach(item=>{
            $("#brand").append($(`
                <option value="${item.id}">${item.name}</option>
            `))
        })
    })
}

const appendOption = (selector, item) => {
    $(selector).append($(`
        <option value="${item.id}">${item.name}</option>
    `));
}
function load_place(){
    axios.post('/place').then(res => {
        res.data.places.forEach(item => {
            appendOption("#rental_place", item);
            appendOption("#return_place", item);
        });
    })
}
load_place()


// 選取車輛
function select(){

    if($('#rental_date').val() === '' || $('#rental_date').val() === ''){
        swal({
            'title':'請先確認時間',
            'text':'請輸入取還車時間'   ,
            'icon':'warning',
            'timer':1500
        })
    }else {
        swal({
            'title':'請稍候',
            'text':'正在查詢剩餘車輛'   ,
            'icon':'success',
            'timer':1500,
            'buttons':false
        })
        axios.post('/vehicle', {
            "filter": false,
            'start': $('#rental_date').val(),
            'end': $('#return_date').val()
        }).then(res => {
            res.data.vehicles.forEach(item => {
                $('#vehicle').append($(`
                <div class="col-lg-3 col-sm-4 col-sm-6">
                    <div  class="card vehicle" style="margin: 10px">
                        <img class="picture" src="${item.image.replace('/public/','')}">
                        <div style="padding: 20px">
                            <h5 style="color: #101737">${item.name}</h5>
                            <p style="margin-bottom: 2px;color: #ababab">${item.type}</p>
                            <p style="margin-bottom: 2px"><span style="color: #0e6efd;font-weight: 800">${item.price}$</span> <span style="color: #ababab;font-size: smaller">/ Day</span></p>
                            <input class="form-check-input" type="checkbox" id="${item.id}" onclick="select_(${item.id})">
                            <label style="color: #777777" class="form-check-label" for="flexCheckDefault">
                                選擇車輛
                            </label>
                        </div>
                    </div>
                </div>
            `))
            })
        })
        $("#select").empty()

        $("#rent").append($(`
            <a  style="height: 42px;margin: 10px" onclick="rent()"  class="btn btn-primary">我要租車</a>
        `))
    }
}


// 選擇車輛
function select_sub(){
    if($('#rental_date').val() === '' || $('#rental_date').val() === ''){
        swal({
            'title':'請先確認時間',
            'text':'請輸入取還車時間'   ,
            'icon':'warning',
            'timer':1500
        })
    }else {
        swal({
            'title':'請稍候',
            'text':'正在查詢剩餘車輛'   ,
            'icon':'success',
            'timer':1500,
            'buttons':false
        })
        const brand = $("#brand").val()
        const type = $("#type").val()
        const low_price = $("#low_price").val()
        const high_price = $("#high_price").val()
        axios.post('/vehicle', {
            'filter': true,
            'brand': brand,
            'type': type,
            'low_price': low_price,
            'high_price': high_price,
            'start': $('#rental_date').val(),
        }).then(res => {
            res.data.vehicles.forEach(item => {
                $('#vehicle').append($(`
                <div class="col-lg-3 col-sm-4 col-sm-6">
                    <div  class="card vehicle" style="margin: 10px">
                        <img class="picture" src="${item.image}">
                        <div style="padding: 20px">
                            <h5 style="color: #101737">${item.name}</h5>
                            <p style="margin-bottom: 2px;color: #ababab">${item.type}</p>
                            <p style="margin-bottom: 2px"><span style="color: #0e6efd;font-weight: 800">${item.subscription}$</span> <span style="color: #ababab;font-size: smaller">/ Month</span></p>
                            <input class="form-check-input" type="checkbox" id="${item.id}"  onclick="select_(${item.id})" >
                            <label style="color: #777777" class="form-check-label" for="flexCheckDefault" >
                                    選擇車輛
                            </label>
                        </div>
                    </div>
                </div>
            `))
            })
        })
        $("#select").empty()

        $("#rent").append($(`
            <a  style="height: 42px;margin: 10px" onclick="rent_sub()"  class="btn btn-primary">我要租車</a>
        `))
    }
}



// A 借 B 還
let A_B = false
function A_rents_B_returns(){
    if(A_B === false){
        $('#place').empty()
        $('#place').append($(`
                <div style="display: flex;justify-content: space-between;">
                    <div style="width: 100%;margin-right: 10px">
                        <p>選擇取車地點</p>
                        <select style="height: 42px;width: 100%" class="form-select" id="rental_place">
                            <option >選擇取還車地點</option>
                            
                        </select>
                    </div>
                    <div style="width: 100%;margin-left: 10px">
                        <p>選擇還車地點</p>
                        <select style="height: 42px;width: 100%" class="form-select" id="return_place">
                            <option >選擇取還車地點</option>
                        </select>
                    </div>
                </div>
            `))
        A_B = true
        load_place()
    }else{
        A_B = false
        $('#place').empty()
        $('#place').append($(`
                <p>選擇取還車地點</p>
                <select style="height: 42px" class="form-select" id="rental_place">
                    <option >選擇取還車地點</option>
                </select>
        `))
        load_place()
    }
}

// 日租車 特效
function daily(){
    $("#content").empty()
    $("#content").append($(`
        <div style="margin: 10px" id="place">
            <p>選擇取還車地點</p>
            <select style="height: 42px" class="form-select" id="rental_place">
                <option >選擇取還車地點</option>

            </select>
        </div>
        <div>
            <div class="row" style="padding: 13px">
                <div style="padding: 10px" class="col-sm-6">
                    <p>選擇取車時間</p>
                    <div style="display: flex">
                        <input style="height: 42px;margin-right: 5px" class="form-control"  type="date" id="rental_date" name="date">

                        <select style="height: 42px;margin-left: 5px" id="rental_time" class="form-select" aria-label="Default select example">
                            <option >選擇時間</option>
                            <option value="T08:00:00+08:00">8:00</option>
                            <option value="T08:30:00+08:00">8:30</option>
                            <option value="T09:00:00+08:00">9:00</option>
                            <option value="T09:30:00+08:00">9:30</option>
                            <option value="T10:00:00+08:00">10:00</option>
                            <option value="T10:30:00+08:00">10:30</option>
                            <option value="T11:00:00+08:00">11:00</option>
                            <option value="T11:30:00+08:00">11:30</option>
                            <option value="T12:00:00+08:00">12:00</option>
                            <option value="T12:30:00+08:00">12:30</option>
                            <option value="T13:00:00+08:00">13:00</option>
                            <option value="T13:30:00+08:00">13:30</option>
                            <option value="T14:00:00+08:00">14:00</option>
                            <option value="T14:30:00+08:00">14:30</option>
                            <option value="T15:00:00+08:00">15:00</option>
                            <option value="T15:30:00+08:00">15:30</option>
                            <option value="T16:00:00+08:00">16:00</option>
                            <option value="T16:30:00+08:00">16:30</option>
                            <option value="T17:00:00+08:00">17:00</option>
                            <option value="T17:30:00+08:00">17:30</option>
                            <option value="T18:00:00+08:00">18:00</option>
                            <option value="T18:30:00+08:00">18:30</option>
                            <option value="T19:00:00+08:00">19:00</option>
                            <option value="T19:30:00+08:00">19:30</option>
                            <option value="T20:00:00+08:00">20:00</option>
                            <option value="T20:30:00+08:00">20:30</option>
                        </select>
                    </div>
                </div>

                <div style="padding: 10px" class="col-sm-6">
                    <p>選擇還車時間</p>
                    <div style="display: flex">
                        <input style="height: 42px;margin-right: 5px" class="form-control" type="date" id="return_date" name="date">
                        <select style="height: 42px;margin-left: 5px" id="return_time" class="form-select" aria-label="Default select example">
                            <option >選擇時間</option>
                            <option value="T08:00:00+08:00">8:00</option>
                            <option value="T08:30:00+08:00">8:30</option>
                            <option value="T09:00:00+08:00">9:00</option>
                            <option value="T09:30:00+08:00">9:30</option>
                            <option value="T10:00:00+08:00">10:00</option>
                            <option value="T10:30:00+08:00">10:30</option>
                            <option value="T11:00:00+08:00">11:00</option>
                            <option value="T11:30:00+08:00">11:30</option>
                            <option value="T12:00:00+08:00">12:00</option>
                            <option value="T12:30:00+08:00">12:30</option>
                            <option value="T13:00:00+08:00">13:00</option>
                            <option value="T13:30:00+08:00">13:30</option>
                            <option value="T14:00:00+08:00">14:00</option>
                            <option value="T14:30:00+08:00">14:30</option>
                            <option value="T15:00:00+08:00">15:00</option>
                            <option value="T15:30:00+08:00">15:30</option>
                            <option value="T16:00:00+08:00">16:00</option>
                            <option value="T16:30:00+08:00">16:30</option>
                            <option value="T17:00:00+08:00">17:00</option>
                            <option value="T17:30:00+08:00">17:30</option>
                            <option value="T18:00:00+08:00">18:00</option>
                            <option value="T18:30:00+08:00">18:30</option>
                            <option value="T19:00:00+08:00">19:00</option>
                            <option value="T19:30:00+08:00">19:30</option>
                            <option value="T20:00:00+08:00">20:00</option>
                            <option value="T20:30:00+08:00">20:30</option>
                        </select>
                    </div>
                </div>

            </div>
            <div style="width: 100%;margin: 10px" class="form-check">
                <input class="form-check-input" type="checkbox" value="" onclick="A_rents_B_returns()">
                <label class="form-check-label" for="flexCheckDefault">
                    甲租乙還
                </label>
            </div>
        </div>
        <div id="select" style="display: contents;">
            <a  style="height: 42px;margin: 10px" onclick="select()"  class="btn btn-primary">選擇車型</a>

        </div>
        <div id="vehicle" class="row">

        </div>
        <div id="rent" style="display: contents">
        </div>

    `))
    $('#daily').removeClass('btn_color')
    $('#contract').removeClass('btn_color');
    $('#daily').addClass('btn_color')

    load_place()

}


// 訂閱車 特效
function contract(){
    A_B = false
    $("#content").empty()
    $("#content").append($(`
            <div style="margin: 10px">
                <p>選擇取車區域</p>
                <select style="height: 42px" id="rental_place" class="form-select" aria-label="Default select example">
                    <option >選擇取還車地點</option>
                    
                </select>
            </div>

            <div style="display: flex;flex-direction: row;justify-content: space-around;align-items: center;">
                <div style="margin: 10px;width: 100%">
                    <p>車款廠牌</p>
                    <select style="height: 42px" id="brand" class="form-select" aria-label="Default select example">
                        <option >不限</option>
                      
                    </select>
                </div>
                <div style="margin: 10px;width: 100%">
                    <p>車款類別</p>
                    <select style="height: 42px" id="type" class="form-select" aria-label="Default select example">
                        <option >不限</option>
                        <option value="car">經濟轎車</option>
                        <option value="Luxury_car">豪華轎車</option>
                        <option value="RV">休旅車</option>
                        <option value="boxcar">廂型車</option>
                        <option value="motorcycle">機車</option>
                        <option value="truck">貨車</option>
                    </select>
                </div>
            </div>
            
            <div style="display: flex;flex-direction: row;justify-content: space-around;align-items: center;">
                <div style="margin: 10px;width: 100%">
                    <p>選擇取車日期</p>
                    <input style="height: 42px" class="form-control" type="date" id="rental_date" name="date">

                </div>
                <div style="margin: 10px;width: 100%">
                    <p>選擇取車時間</p>
                    <select style="height: 42px" class="form-select" id="rental_time" aria-label="Default select example">
                            <option >選擇時間</option>
                            <option value="T08:00:00+08:00">8:00</option>
                            <option value="T08:30:00+08:00">8:30</option>
                            <option value="T09:00:00+08:00">9:00</option>
                            <option value="T09:30:00+08:00">9:30</option>
                            <option value="T10:00:00+08:00">10:00</option>
                            <option value="T10:30:00+08:00">10:30</option>
                            <option value="T11:00:00+08:00">11:00</option>
                            <option value="T11:30:00+08:00">11:30</option>
                            <option value="T12:00:00+08:00">12:00</option>
                            <option value="T12:30:00+08:00">12:30</option>
                            <option value="T13:00:00+08:00">13:00</option>
                            <option value="T13:30:00+08:00">13:30</option>
                            <option value="T14:00:00+08:00">14:00</option>
                            <option value="T14:30:00+08:00">14:30</option>
                            <option value="T15:00:00+08:00">15:00</option>
                            <option value="T15:30:00+08:00">15:30</option>
                            <option value="T16:00:00+08:00">16:00</option>
                            <option value="T16:30:00+08:00">16:30</option>
                            <option value="T17:00:00+08:00">17:00</option>
                            <option value="T17:30:00+08:00">17:30</option>
                            <option value="T18:00:00+08:00">18:00</option>
                            <option value="T18:30:00+08:00">18:30</option>
                            <option value="T19:00:00+08:00">19:00</option>
                            <option value="T19:30:00+08:00">19:30</option>
                            <option value="T20:00:00+08:00">20:00</option>
                            <option value="T20:30:00+08:00">20:30</option>
                    </select>
                </div>
            </div>
            
            <div>
                <div style="display: flex;flex-direction: row;justify-content: space-around;align-items: center;">
                    <div style="width: 100%;margin: 10px">
                        <p>最低價格</p>
                        <input style="height: 42px" class="form-control" type="number" id="low_price" name="date" placeholder="起始價格">
                    </div>
                    <div style="width: 100%;margin: 10px">
                        <p>最高價格</p>
                        <input style="height: 42px" class="form-control" type="number" id="high_price" name="date" placeholder="最高價格">
                    </div>
                </div>
                
            </div>
            <div id="select" style="display: contents;">
            <a  style="height: 42px;margin: 10px" onclick="select_sub()"  class="btn btn-primary">選擇車型</a>

        </div>
        <div id="vehicle" class="row">

        </div>
        <div id="rent" style="display: contents;">
        </div>
        `))
    $('#daily').removeClass('btn_color')
    $('#contract').removeClass('btn_color');
    $('#contract').addClass('btn_color')

    load_brand()
    load_place()
}


