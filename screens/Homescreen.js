import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  ScrollViewComponent,
  StatusBar,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { View, Text, SafeAreaView } from "react-native";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { CalendarDaysIcon, MapPinIcon } from "react-native-heroicons/solid";
import { debounce } from "lodash";
import { fetchforecast, fetchlocation } from "../api/weather";
import * as Progress from 'react-native-progress';
import { getData, storeData } from "../utils/asyncestorage";

const Homescreen = () => {
  const [togglesearch, settogglesearch] = useState(false);
  const [locations, setlocations] = useState([]);
  const [weather, setweather] = useState({});
  const [loading, setloading] = useState(true)

  const handlesearch = (loc) => {
    setlocations([]);
    settogglesearch(false);
    setloading(true)
    fetchforecast({ cityName: loc.name, days: "7" }).then((data) => {
      setweather(data);
      setloading(false)
      storeData('city', loc.name)
    });
  };

  const handleloction = (value) => {
    if (value.length > 2) {
      fetchlocation({ cityName: value }).then((data) => {
        setlocations(data);
        setloading(false)
      });
    }
  };
useEffect(()=>{
  fetchmydata();
},[])

async function fetchmydata (){
  let getcity = await getData('city')
  let cityName = 'Lahore'
  if(getcity) cityName = getcity
  fetchforecast({
    cityName,
    days : '7'
  }).then(data => {
    setweather(data)
    setloading(false)
  })

}

  const handletextdebounce = useCallback(debounce(handleloction, 1200), []);
  const { current, location } = weather;
  return (
    <View style={{ backgroundColor: "#006d77" }} className="flex-1 relative">
      <StatusBar barStyle={"light-content"} />
       {loading ? (
          <View className ='flex-1 justify-center items-center'>
            <Progress.CircleSnail size={120} thickness={10} color={'white'}/>
          </View>
        ) : (
      <SafeAreaView className="flex flex-1">
        {/* Search Section */}
        <View style={{ height: "8%" }} className="mx-4 relative z-50">
          <View
            className=" rounded-full flex-row justify-end items-center  mt-12"
            style={togglesearch ? { backgroundColor: "#e29578" } : null}
          >
            {togglesearch ? (
              <TextInput
                onChangeText={handletextdebounce}
                placeholder="Search city"
                placeholderTextColor={"white"}
                className="pl-6 h-12 flex-1 text-base text-white"
              />
            ) : null}

            <TouchableOpacity
              onPress={() => settogglesearch(!togglesearch)}
              style={{ backgroundColor: "#e29578" }}
              className="rounded-full p-3 m-1"
            >
              <MagnifyingGlassIcon color={"white"} size={24} />
            </TouchableOpacity>
          </View>
          {locations.length > 0 && togglesearch ? (
            <View style={{backgroundColor : '#edf6f9'}} className=" absolute w-full top-28 rounded-3xl" >
              {locations.map((loc, index) => {
                let showboder = index != locations.length;
                let borderclass = showboder
                  ? " border-b-2 border-b-gray-400"
                  : "";
                return (
                  <TouchableOpacity
                    onPress={() => handlesearch(loc)}
                    key={index}
                    className={
                      " flex-row items-center p-3 px-4 border-0 mb-1 " +
                      borderclass
                    }
                  >
                    <MapPinIcon size={24} color={"gray"} />
                    <Text className="text-black text-lg ml-3">
                      {loc?.name}, {loc?.country}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}
        </View>
        {/* Forecast Section */}
           <View className="flex justify-around mx-4 mb-2 mt-4 flex-1 ">
          <Text className="text-white text-center text-2xl font-bold">
            {location?.name}
            <Text className="text-lg text-gray-300 font-semibold ">
              {"  " + location?.country}
            </Text>
          </Text>
          <View className="flex-row justify-center">
            <Image
              source={{ uri: "https:" + current?.condition?.icon }}
              className="w-52 h-52"
            />
          </View>
          {/* degree celcius */}
          <View className="space-y-2">
            <Text className="text-center font-bold text-white text-6xl ml-5">
              {current?.temp_c}&#176;
            </Text>
            <Text className="text-center  text-white text-xl ml-5 tracking-widest">
              {current?.condition?.text}
            </Text>
          </View>
          {/* otherstats */}
          <View className="flex-row justify-between mx-4">
            <View className="flex-row space-x-2 items-center">
              <Image
                source={require("../assets/icons/wind.png")}
                className="h-6 w-6"
                tintColor={"white"}
              />
              <Text className="text-white text-base font-semibold ml-2">
                {current?.wind_kph}kph
              </Text>
            </View>
            <View className="flex-row space-x-2 items-center">
              <Image
                source={require("../assets/icons/umbrella.png")}
                className="h-6 w-6"
                tintColor={"white"}
              />
              <Text className="text-white text-base font-semibold ml-2">
                {current?.humidity}%
              </Text>
            </View>
            <View className="flex-row space-x-2 items-center">
              <Image
                source={require("../assets/icons/sun.png")}
                className="h-6 w-6"
                tintColor={"white"}
              />
              <Text className="text-white text-base font-semibold ml-2">
                {weather?.forecast?.forecastday[0]?.astro?.sunrise}
              </Text>
            </View>
          </View>
        </View>
        {/* Forcast for next day */}
        <View className="mb-3 space-y-3">
          <View className="flex-row items-center space-x-2 mx-5">
            <CalendarDaysIcon size={22} color={"white"} />
            <Text className=" ml-2 text-white text-base">Daily Forecast</Text>
          </View>
          <ScrollView
            horizontal
            contentContainerStyle={{ padddingHorizontal: 5 }}
            showsHorizontalScrollIndicator={false}
          >
            {weather?.forecast?.forecastday.map((item, index) => {
              let date = new Date(item.date)
              let options = {weekday : 'long'}
              let dayname = date.toLocaleDateString('en-US',options)
              return (
                <View
                  key={index}
                  style={{ backgroundColor: "#83c5be" }}
                  className="flex justify-center items-center w-24 rounded-3xl py-4 space-y-1 m-4 "
                >
                  <Image
                    source={{uri : 'https:'+item?.day?.condition?.icon}}
                    className="h-11 w-11"
                  />
                  <Text className="text-white">{dayname}</Text>
                  <Text className="text-white text-xl font-semibold">
                    {item?.day?.avgtemp_c}&#176;
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        </View>
       
      </SafeAreaView> )}
    </View>
  );
};

export default Homescreen;
