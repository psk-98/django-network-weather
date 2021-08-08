document.addEventListener('DOMContentLoaded', () => {
    applyTheme();
    if (!localStorage.getItem('units')){
        localStorage.setItem('units','metric')
    }
    is_favorites();
    toggleDisplays('the-favs');
    document.getElementById('city').addEventListener('keypress',(e) => {
        if (document.getElementById("city").value && e.key === 'Enter'){
            handleSearch();
        }
    })
})

if (!localStorage.getItem('mode')){
    localStorage.setItem('mode','light');
}

const degrees_icon = `<svg id='degrees' xmlns="http://www.w3.org/2000/svg" width="4.332" height="4.368" viewBox="0 0 4.332 4.368">
                        <path id="Icon_weather-degrees" data-name="Icon weather-degrees" d="M15.828,11.052a2.1,2.1,0,0,1,.636-1.536,2.158,2.158,0,0,1,3.06,0,2.122,2.122,0,0,1,.636,1.536,2.149,2.149,0,0,1-.636,1.548A2.06,2.06,0,0,1,18,13.248a2.192,2.192,0,0,1-2.172-2.2Zm1.056,0a1.124,1.124,0,0,0,.324.8,1.14,1.14,0,0,0,1.944-.8,1.044,1.044,0,0,0-.336-.792,1.136,1.136,0,0,0-.8-.336,1.124,1.124,0,0,0-.8.324A1.085,1.085,0,0,0,16.884,11.052Z" transform="translate(-15.828 -8.88)"/>
                        </svg>`;

let favorite_places = [];
let places_ids = [];

favoritesDisplay = (places) => {
    const favs = document.getElementById('the-list');
    favs.innerHTML = '';
    favorite_places.forEach(element => {
        const div = document.createElement('div');
        const span = document.createElement('div');
        span.innerHTML = "-";
        span.className = 'remove-btn bg-light';
        span.setAttribute('data-remove', element);
        const span2 = document.createElement('div');
        span2.className = 'the-city bg-light';
        span2.innerHTML = element;
        div.appendChild(span2);
        div.appendChild(span);
        div.className = 'fav-city';
        span2.setAttribute('data-city', element);
        favs.appendChild(div);
    });
   document.querySelectorAll('div.the-city').forEach(element => {
       element.addEventListener('click',handleClick);
   });
   document.querySelectorAll('div.remove-btn').forEach(element => {
        element.addEventListener('click',handleRemove);
   })
   applyTheme();
}

handleRemove = (e) => {
    var city = e.target.getAttribute('data-remove');
    var id = places_ids[favorite_places.indexOf(city)];
    fetch(`/weather/remove/${id}`,{
        method : "DELETE",
        headers: {
            'X-CSRFToken': csrftoken
        }
    })
    .then(response => response.json())
    .then(result => {
        console.log(result)
        is_favorites(city);
    })
    .catch(err => console.log(err))
}

toggleDisplays = (display) => {
    document.getElementById('display').style.display = 'none';
    document.getElementById('the-favs').style.display = 'none';

    document.getElementById(`${display}`).style.display = 'block';
}

changeUnits = () => {
    if (localStorage.getItem('units')=='metric'){
        localStorage.setItem('units','imperial');
    }else if (localStorage.getItem('units')=='imperial'){
        localStorage.setItem('units','metric');
    }
    
    if (document.getElementById('display').style.display === 'block'){
        city = document.getElementById("city-name").innerHTML;
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=ec63b673cae80127f305bb05b0257800`)
        .then(response => response.json())
        .then(result => {
            onecall(result.coord.lon,result.coord.lat,result.name,result.sys.country);     
        })
        .catch(err => console.log(err))
    }
}

//changed
handleClick = (e) =>{
    
    var city = e.target.getAttribute('data-city');
    document.getElementById('display').innerHTML = '';
    var thediv = document.createElement('div') ;
    thediv.className = 'd-flex justify-content-center';
    var the = document.createElement('div');
    the.className = 'spinner-border';
    var span = document.createElement('span') ;
    span.className = 'sr-only';
    the.appendChild(span);
    thediv.appendChild(the);
    document.getElementById('display').appendChild(thediv);
    toggleDisplays('display');
                        
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=ec63b673cae80127f305bb05b0257800`)
    .then(response => response.json())
    .then(result => {
        onecall(result.coord.lon,result.coord.lat,result.name,result.sys.country);     
    })
    .catch(err => console.log(err))
}

handleSearch = () =>{

    document.getElementById('display').innerHTML = '';
    var city = document.getElementById('city').value;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=ec63b673cae80127f305bb05b0257800`)
    .then(response => response.json())
    .then(result => {
        onecall(result.coord.lon,result.coord.lat,result.name,result.sys.country); 
        var thediv = document.createElement('div') ;
        thediv.className = 'd-flex justify-content-center';
        var the = document.createElement('div');
        the.className = 'spinner-border';
        var span = document.createElement('span');
        span.className = 'sr-only';
        the.appendChild(span);
        thediv.appendChild(the);
        document.getElementById('display').appendChild(thediv);
        toggleDisplays('display');
    })
}

onecall = (lon,lat,name,country) =>{

    var unit = localStorage.getItem('units');

    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&units=${unit}&appid=ec63b673cae80127f305bb05b0257800`)
    .then(response => response.json())
    .then(result => {
        document.getElementById('display').innerHTML = '';
        handleMain(result,name,country);
        createCarousel(name);
        handleDaily(result,name);
        handleDetails(result,name);
        document.getElementById('city').value = '';    
    })
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

// add or remove from favorites
favorites = (city,country) => {

    var the_btn = document.getElementById('add-to-btn');
    if (the_btn.innerHTML === '+') {
        fetch('/weather/add', {
            method : 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
              "name" : `${city}`,
              "country" : `${country}`
            })
        })
        .then(response => response.json())
        .then(result =>{
            is_favorites(city);
        })
        .catch(err => console.log(err))

    }else if (the_btn.innerHTML === '-') {
        var id = places_ids[favorite_places.indexOf(city)];
        console.log(places_ids[id])
        console.log(favorite_places[id])
        fetch(`/weather/remove/${id}`,{
            method : "DELETE",
            headers: {
                'X-CSRFToken': csrftoken
            }
        })
        .then(response => response.json())
        .then(result => {
            console.log(result)
            is_favorites(city);
        })
        .catch(err => console.log(err))
    }
}

is_favorites = (place) => {
    favorite_places = [];
    places_ids = [];
    fetch('/weather/is_favorite')
    .then(response => response.json())
    .then(result => {
        result.forEach(place => {
            favorite_places.push(place.name);
            places_ids.push(place.id);
        });
        favoritesDisplay(result);
        if (favorite_places.indexOf(`${place}`)===-1){
            document.getElementById('add-to-btn').innerHTML = '+';
        }else{
            document.getElementById('add-to-btn').innerHTML = '-';
        }
    })
    .catch(err => {

    })
}

toggleDark = () => {
    if (localStorage.getItem('mode') === 'light'){
        localStorage.setItem('mode','dark');
    }else {
        localStorage.setItem('mode','light');   
    }
    applyTheme();
}

applyTheme = () => {

    var body = document.querySelector('body');
    var cards = document.querySelectorAll('.card');
    var navbar = document.querySelector('nav');
    var controls = document.querySelectorAll('.change-svg');
    var inputboxes = document.querySelectorAll('.form-control');
    var btns = document.querySelectorAll('input');
    var degreesicon = document.querySelectorAll('#degrees');
    var favs = document.querySelectorAll('.the-city');
    var favs_btn = document.querySelectorAll('.remove-btn');

    if (localStorage.getItem('mode') === 'light'){
        body.classList.remove('bg-dark','text-white');
        navbar.className = 'navbar navbar-expand-lg navbar-light bg-light';
        degreesicon.forEach(element => {
            if (element.id === 'degrees'){
                element.style.fill = '#343a40';
           } 
        });
        btns.forEach(btn => {
            if (btn.className === 'btn btn-light'){
                btn.className = 'btn btn-dark';
            }
        });
        inputboxes.forEach(inputbox => {
            inputbox.classList.remove('bg-dark','text-white');
        });
        controls.forEach(control => {
            control.style.fill = '#343a40';
        });
        cards.forEach(card => {
            card.classList.remove('bg-dark','text-light');
        });
        favs.forEach(fav => {
            if (fav.className === 'the-city bg-dark'){
                fav.className = 'the-city bg-light';
            }
        });
        favs_btn.forEach(btn => {
            if (btn.className === 'remove-btn bg-dark'){
                btn.className = 'remove-btn bg-light';
            }
        });
    
    }else if (localStorage.getItem('mode') === 'dark') {
        body.classList.add('bg-dark','text-white');
        navbar.className = 'navbar navbar-expand-lg navbar-dark bg-dark';
        degreesicon.forEach(element => {
            if (element.id === 'degrees'){
                element.style.fill = '#fff';
           } 
        });
        btns.forEach(btn => {
            if (btn.className === 'btn btn-dark'){
                btn.className = 'btn btn-light';
            }
        });
        inputboxes.forEach(inputbox => {
            inputbox.classList.add('bg-dark','text-white');
        });
        controls.forEach(control => {
            control.style.fill = '#fff';
        });
        cards.forEach(card => {
            card.classList.add('bg-dark','text-light');
        });
        favs.forEach(fav => {
            if (fav.className === 'the-city bg-light'){
                fav.className = 'the-city bg-dark';
            }
        });
        favs_btn.forEach(btn => {
            if (btn.className === 'remove-btn bg-light'){
                btn.className = 'remove-btn bg-dark';
            }
        });
    } 
}

//display main card with city name and todays weather
handleMain = (result,name,country) => {
    var units = ''; 

    var unixtime = result.current.dt - result.timezone_offset;
    var date = new Date(unixtime*1000);

    var card = document.createElement('div');
    card.className = 'card';
    if (localStorage.getItem('mode')==='dark'){
        card.className = 'card bg-dark';
    }

    var icon = result.current.weather[0].icon
    var card_body = document.createElement('div');
    card_body.className = 'card-body';

    var toggle = document.createElement('span')
    toggle.id = 'add-to-btn';
    toggle.style.marginLeft = '90%';
   
    // add button to add and remove from favorite
    
    if (favorite_places.indexOf(`${name}`)===-1){
        toggle.innerHTML = '+';
    }else{
        toggle.innerHTML = '-';
    }
    toggle.addEventListener('click',()=>{
        favorites(name,country)});
    card_body.appendChild(toggle);
                
    var day = document.createElement('h5');
    day.className = 'card-title';
    day.innerHTML = getWeekDay(date);
    card_body.appendChild(day)

    var city = document.createElement('h6');
    city.className = 'card-subtitle';
    city.id = 'city-name';
    city.innerHTML = name;
    card_body.appendChild(city);

    var temp = document.createElement('p');
    temp.className = 'card-text';
    var round_temp = Math.round(result.current.temp);
    var round_temp_max = Math.round(result.daily[0].temp.max);
    var round_temp_min = Math.round(result.daily[0].temp.min);
    var round_feels = Math.round(result.current.feels_like);
    if (localStorage.getItem('units')=='metric'){
        units = `C`;
    }else{
        units = `F`;
    }
    temp.innerHTML = `<img src=https://openweathermap.org/img/wn/${icon}.png /> ${round_temp}<sup>${degrees_icon}</sup>${units} <br> 
                        <small>${round_temp_max}<sup>${degrees_icon}</sup>/${round_temp_min}<sup>${degrees_icon}</sup>
                          <br> Feels like ${round_feels}<sup>${degrees_icon}</sup> <br> ${result.current.weather[0].description}</small>`
    card_body.appendChild(temp);

    card.appendChild(card_body);
    var col = document.createElement('div');
    col.className = name;
    col.id = 'main';
    col.appendChild(card);
    var display = document.getElementById('display');
    display.appendChild(col);
    applyTheme();
}

createCarousel = (name) => {

    var carousel = document.createElement('div');
    carousel.className = "carousel slide";
    carousel.id = `carousel${name}`;
    carousel.setAttribute('data-ride','carousel');
    
    var prev_div = document.createElement('div');
    prev_div.className = "control";
    var prev = document.createElement('a');
        prev.innerHTML = `<svg class="previous change-svg" viewBox="9 11.76 134.527 77.346">
                            <path id="Icon_material-keyboard-arrow-d" d="M 24.80685997009277 89.10609436035156 L 76.2633056640625 41.29973983764648 L 127.7197265625 89.10610198974609 L 143.5265960693359 74.38841247558594 L 76.2633056640625 11.75999641418457 L 9 74.38841247558594 L 24.80685997009277 89.10609436035156 Z">
                            </path>
                        </svg>`;
    prev.className = 'carousel-control-prev';
    prev.setAttribute('data-slide','prev');
    prev.setAttribute('href',`#carousel${name}`)
    prev_div.appendChild(prev);

    var next_div = document.createElement('div');
    next_div.className = "control";
    var next = document.createElement('a');
        next.innerHTML = `<svg class="next change-svg" viewBox="9 11.76 134.527 77.346">
                                <path id="Icon_material-keyboard-arrow-d_q" d="M 24.80685997009277 89.10609436035156 L 76.2633056640625 41.29973983764648 L 127.7197265625 89.10610198974609 L 143.5265960693359 74.38841247558594 L 76.2633056640625 11.75999641418457 L 9 74.38841247558594 L 24.80685997009277 89.10609436035156 Z">
                                </path>
                            </svg>`;
    next.className = 'carousel-control-next';
    next.setAttribute('data-slide','next');
    next.setAttribute('href',`#carousel${name}`);
    next_div.appendChild(next);

    var the_display = document.createElement('div');
    the_display.className = 'the-display';
    var inside = document.createElement('div');
    inside.className = 'carousel-inner';
    inside.id = `carousel-${name}`;
    the_display.appendChild(inside);

    carousel.appendChild(prev_div);
    carousel.appendChild(the_display);
    carousel.appendChild(next_div);

    var display = document.getElementById('display');
    display.appendChild(carousel);

    applyTheme();
}

handleDetails = (result,name) => {
    var item = document.createElement('div');
    item.className = 'carousel-item';

    var card = document.createElement('div');
    card.className = 'card';
    if (localStorage.getItem('mode')==='dark'){
        card.className = 'card bg-dark';
    }
    card.id = "card-details";

    var card_body = document.createElement('div');
    card_body.className = 'card-body';
    var marg = (0.25 * 280)
    card_body.style.marginTop = `${marg}px`;
    card_body.style.marginBottom = `${marg}px`;

    var UVindex = document.createElement('h6');
    UVindex.className = 'card-subtitle';
    UVindex.innerHTML = handleUV(result.current.uvi);
    card_body.appendChild(UVindex);

    var humidity = document.createElement('h6');
    humidity.className = 'card-subtitle';
    humidity.innerHTML = `<div class='row'>  <div id='thelabel'>Humidity </div> <div id='thevalue'>${result.current.humidity}%</div> </div>`;
    card_body.appendChild(humidity);
    
    var visibile = document.createElement('h6');
    visibile.className = 'card-subtitle';
    visibile.innerHTML = handleVisibility(result.current.visibility);
    card_body.appendChild(visibile);

    var wind_deg = document.createElement('h6');
    wind_deg.className = 'card-subtitle';
    wind_deg.innerHTML = handleWindDirection(result.current.wind_deg);
    card_body.appendChild(wind_deg);

    var wind_speed = document.createElement('h6');
    wind_speed.className = 'card-subtitle';
    wind_speed.innerHTML = handleWindSpeed(result.current.wind_speed);
    card_body.appendChild(wind_speed);

    card.appendChild(card_body);
    item.appendChild(card);
    document.getElementById(`carousel-${name}`).appendChild(item);
}

handleDaily = (result,name) => {
    var item = document.createElement('div');
    item.className = 'carousel-item active';

    for(var i=1;i<4;i++){
        var unixtime = result.daily[i].dt - result.timezone_offset;
        var date = new Date(unixtime*1000);

        var icon_img = result.daily[i].weather[0].icon;

        var daily = document.createElement('div');
        daily.className = 'daily';

        var card = document.createElement('div');
        card.id = "card-daily";
        card.className = 'card';
        if (localStorage.getItem('mode')==='dark'){
            card.className = 'card bg-dark';
        }

        var card_body = document.createElement('div');
        card_body.className = 'card-body';

        divs = document.createElement('div');
        divs.id = 'daily-divs';
        var day = document.createElement('h5');
        day.className = 'card-title';
        day.innerHTML = getWeekDay(date);
        divs.appendChild(day);
        card_body.appendChild(divs);

        icon_divs = document.createElement('div');
        icon_divs.id = 'daily-divs';
        var icon = document.createElement('h6');
        icon.className = 'card-subtitle';
        icon.innerHTML = `<img src=https://openweathermap.org/img/wn/${icon_img}.png />`;
        icon_divs.appendChild(icon);
        card_body.appendChild(icon_divs);

        temp_divs = document.createElement('div');
        temp_divs.id = 'daily-divs';
        var temp_max = document.createElement('p');
        temp_max.className = 'card-text';
        var round_temp_max = Math.round(result.daily[i].temp.max);
        temp_max.innerHTML = `${round_temp_max}<sup>${degrees_icon}</sup>`;
        temp_divs.appendChild(temp_max);

        var temp_min = document.createElement('p');
        temp_min.className = 'card-text';
        var round_temp_min = Math.round(result.daily[i].temp.min);
        temp_min.innerHTML = `${round_temp_min}<sup>${degrees_icon}</sup>`;
        temp_divs.appendChild(temp_min);
        card_body.appendChild(temp_divs);

        card.appendChild(card_body);
        daily.appendChild(card);
        item.appendChild(daily);
    }
    document.getElementById(`carousel-${name}`).appendChild(item);
    applyTheme();
}

handleVisibility = (vis) => {
    var dis = '';
    if (localStorage.getItem('units')=='metric'){
        if(vis<1000){
            dis = `${vis} metres`;
            
        }else{
            dis = Math.round(vis/1000);
            dis =`${dis} KM`;
            
        }
    }else{
        if(vis<1609.344){
            dis = `${vis} Metres`;
            
        }else{
            dis = Math.round(vis/1609.344);
            dis =`${dis} Miles`
            
        }
    }
    return `<div class='row' >
                <div id='thelabel' >Visibility</div>
                <div id='thevalue' >${dis}</div> 
            </div>`;
}

handleUV = (index) => {
    var UV = '';
    if (index<3){
        UV = 'Low';
    }else if (index>=3){
        UV = 'Moderate'
    }else if (index>=5){
        UV = 'High';
    }else if (index>=8){
        UV = 'Very High';
    }else{
        UV='Extreme';
    }
    return `<div class='row'>
                <div id='thelabel'>UV index</div> 
                <div id='thevalue'>${UV}</div> 
            </div>`;
}

handleWindSpeed = (speed) => {
    var units = 'mi/h';
    if (localStorage.getItem('units')=='metric'){
        speed = Math.round(speed * 3.6); 
        units = 'km/h';
    }
    // had units to local storage and if which units before displaying
    var wind_speed = `<div class='row'> 
                        <div id='thelabel'>Wind speed</div>
                        <div id='thevalue'>${speed} ${units}</div> 
                    </div>`;
    return wind_speed;
}

// handle wind direction
handleWindDirection = (deg) => {
    var dirtext = degToDir(deg);
    var direction = `<div class='row'>  
                        <div id='thelabel'>Wind direction</div>
                        <div id='thevalue'>${dirtext}</div> 
                    </div>` ;
    return direction;
}

degToDir = (deg) =>{
    if (deg>22.5 && deg<=45){
        return "NNE";
    }else if (deg>45 && deg<=67.5){
        return "ENE";
    }else if (deg>67.5 && deg<=90){
        return "E";
    }else if (deg>90 && deg<=112.5){
        return "ESE";
    }else if (deg>112.5 && deg<=135){
        return "ESE";
    }else if (deg>135 && deg<=157.5){
        return "SE";
    }else if (deg>157.5 && deg<=180){
        return "SSE";
    }else if (deg>180 && deg<=202.5){
        return "S";
    }else if (deg>202.5 && deg<=225){
        return "SSW";
    }else if (deg>225 && deg<=247.5){
        return "SW";
    }else if (deg>247.5 && deg<=270){
        return "WSW";
    }else if (deg>270 && deg<=292.5){
        return "W";
    }else if (deg>292.5 && deg<=315){
        return "WNW";
    }else if (deg>315 && deg<=337.5){
        return "NW";
    }else if (deg>337.5 && deg<=360){
        return "NNW";
    }else{
        return "N"; 
    }
}

 //Function takes in a Date object and returns the day of the week in a text format.
getWeekDay = (date) => {
    //Create an array containing each day, starting with Sunday.
    var weekdays = new Array(
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    );
    //Use the getDay() method to get the day.
    var day = date.getDay();
    //Return the element that corresponds to that index.
    return weekdays[day];
}