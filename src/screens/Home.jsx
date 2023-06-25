import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import {
  Button,
  Chip,
  IconButton,
  MD3DarkTheme,
  Snackbar,
  Text,
  TextInput,
} from "react-native-paper";
import TrainCard from "../components/TrainCard";

const Home = () => {
  const [date, setDate] = useState(new Date(Date.now()));
  const [show, setShow] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [searchData, setSearchData] = useState({ from: [], to: [] });
  const [quota, setQuota] = useState("GN");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [signal, setSignal] = useState(false);

  const changeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
  };

  const searchStation = async (search, type) => {
    if (search.length < 3) {
      setSearchData({ from: [], to: [] });
      return;
    }
    const controller = new AbortController();
    signal.length && controller.abort();
    setSearchData({ from: [], to: [] });
    setSignal(controller.signal);
    const response = await fetch(
      "https://asia-south1-captcha-372516.cloudfunctions.net/getmytrain?message=" +
        search,
      { signal }
    );
    const data = await response.json();
    if (type === "From") setSearchData({ from: data, to: searchData.to });
    else setSearchData({ from: searchData.from, to: data });
  };

  const fetchTrains = async () => {
    setLoading(true);
    setResults([]);
    if (to === from) {
      setLoading(false);
      alert("Source and destination cannot be same");
      return;
    }
    const dateOptions = {
      year: date.getFullYear(),
      month: ("" + (date.getMonth() + 1)).padStart(2, "0"),
      day: date.getDate(),
    };
    try {
      const URL = `https://us-central1-mind-pen-22c05.cloudfunctions.net/searchTrains?src=${
        from.split("(")[1].split(")")[0]
      }&des=${to.split("(")[1].split(")")[0]}&date=${dateOptions.year}${
        dateOptions.month
      }${dateOptions.day}&quota=${quota}`;

      const response = await fetch(URL);
      const data = await response.json();
      setResults(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      Alert.alert("Error", "Something went wrong");
      return;
    }
  };

  return (
    <View className="relative flex h-screen w-full gap-4">
      <View className="relative w-full">
        <TextInput
          label={"From"}
          placeholder="Search for stations"
          mode="outlined"
          value={from}
          onChangeText={(text) => {
            setFrom(text);
            searchStation(text, "From");
          }}
        />
        {searchData.from.length > 0 && (
          <ScrollView className="w-full h-96 z-50 flex">
            {searchData.from.map((station) => (
              <View
                key={station.code}
                className="flex flex-row p-4 justify-center border-gray-300 border-t-0 border-[0.25px]"
                onTouchEnd={() => {
                  setFrom(station.name + " (" + station.code + ")");
                  setSearchData({ from: [], to: searchData.to });
                }}
              >
                <Text className="flex-1">
                  {station.name}, {station.state}
                </Text>
                <Text className="ml-auto">{station.code}</Text>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
      <IconButton
        icon="swap-vertical"
        mode="contained-tonal"
        className="absolute right-0 top-8 z-10 border-2"
        size={48}
        onPress={() => {
          setFrom(to);
          setTo(from);
        }}
      />
      <View className="relative w-full">
        <TextInput
          label={"To"}
          placeholder="Search for stations"
          mode="outlined"
          value={to}
          onChangeText={(text) => {
            setTo(text);
            searchStation(text, "To");
          }}
        />
        {searchData.to.length > 0 && (
          <ScrollView className="w-full h-96 z-50 flex">
            {searchData.to.map((station) => (
              <View
                key={station.code}
                className="flex flex-row p-4 justify-center border-gray-300 border-t-0 border-[0.25px]"
                onTouchEnd={() => {
                  setTo(station.name + " (" + station.code + ")");
                  setSearchData({ from: searchData.from, to: [] });
                }}
              >
                <Text className="flex-1">
                  {station.name}, {station.state}
                </Text>
                <Text className="ml-auto">{station.code}</Text>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
      <View className="relative w-full">
        <TextInput
          label={"Journey Date"}
          mode="outlined"
          placeholder="Select Journey Date"
          onPress={() => setShow(true)}
          value={date.toDateString() || ""}
          onChange={(value) => setDate(value)}
        />
        <Button
          className="absolute flex items-stretch invisible scale-125 left-10 right-10 bottom-1 top-1 mt-2"
          onPress={() => setShow(true)}
          style={{ borderRadius: 0 }}
        />
        <IconButton
          icon="calendar"
          mode="contained-tonal"
          className="absolute right-2 bottom-0 z-10"
          size={24}
          onPress={() => setShow(true)}
        />
      </View>
      {show && (
        <DateTimePicker
          mode="date"
          display="spinner"
          value={date}
          onChange={changeDate}
        />
      )}
      <View className="flex flex-row items-center space-x-2">
        <Text>Quota:</Text>
        <Chip
          mode={quota === "GN" ? "flat" : "outlined"}
          onPress={() => setQuota("GN")}
        >
          General
        </Chip>
        <Chip
          mode={quota === "TQ" ? "flat" : "outlined"}
          onPress={() => setQuota("TQ")}
        >
          Tatkal
        </Chip>
      </View>
      <Button
        mode="contained-tonal"
        className="rounded-xl w-full border-4 border-purple-400"
        onPress={fetchTrains}
        icon={"train"}
        loading={loading}
        textColor={MD3DarkTheme.colors.primary}
        disabled={from.length < 3 || to.length < 3 || loading}
      >
        Search
      </Button>
      <View>
        {results.length > 0 && (
          <ScrollView horizontal className="flex flex-row gap-2">
            {Array.from(Array(7).keys()).map((i, index) => (
              <Chip
                key={i}
                mode={index === 3 ? "flat" : "outlined"}
                onPress={() => {
                  const newDate = new Date(
                    date.getTime() + (i - 3) * 24 * 60 * 60 * 1000
                  );
                  setDate(newDate);
                  fetchTrains();
                }}
              >
                {new Date(
                  date.getTime() + (i - 3) * 24 * 60 * 60 * 1000
                ).getDate()}
                {" / "}
                {new Date(
                  date.getTime() + (i - 3) * 24 * 60 * 60 * 1000
                ).getMonth()}
              </Chip>
            ))}
          </ScrollView>
        )}
      </View>
      
      <ScrollView
        className="w-full flex-1 mb-16 z-50"
        nestedScrollEnabled={true}
      >
        <View className="grid grid-cols-2">
          {results.map((train) => (
            <TrainCard key={train.train_no} train={train} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;
