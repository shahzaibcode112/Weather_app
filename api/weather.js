import axios, { Axios } from "axios";

const apikey = 'b10826ebe7334b1e8c452535250309'

const forecastendpoint = pramas => `https://api.weatherapi.com/v1/forecast.json?key=${apikey}&q=${pramas.cityName}&days=${pramas.days}&aqi=no&alerts=no`
const locationendpoint = pramas => `https://api.weatherapi.com/v1/search.json?key=${apikey}&q=${pramas.cityName}`

const apicall = async (endpoints)=>{
        const options ={
            method : 'GET',
            url : endpoints
        }
        try {
           const response = await axios.request(options);
           return response.data
        } catch (error) {
            console.log('error',error)
            return null
        }
}

 export const fetchforecast = (pramas)=>{
    return apicall(forecastendpoint(pramas))
}

export const fetchlocation = (pramas)=>{
    return apicall(locationendpoint(pramas))
}